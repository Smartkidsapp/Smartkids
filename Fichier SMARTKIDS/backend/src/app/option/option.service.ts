import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Option, OptionDocument } from './schemas/option.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateOptionDto } from './dtos/create-option.dto';
import { PaginateOptionsDto } from './dtos/paginate-options.dto';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import userStrings from '../users/user.strings';
import { Etablissement } from '../etablissement/schemas/etablissement.schema';

@Injectable()
export class OptionService {
  constructor(
    @InjectModel(Option.name) private optionModel: Model<OptionDocument>,
    @InjectModel(Etablissement.name) private etablissementModel: Model<Etablissement>,
  ) { }

  async create(createOptionDto: CreateOptionDto): Promise<OptionDocument | null> {
    const option = await this.optionModel.create(createOptionDto)
    return option;
  }

  async edit(id: string, createOptionDto: CreateOptionDto): Promise<OptionDocument | null> {
    const option = await this.optionModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id)
      },
      createOptionDto,
      {
        new: true
      }
    );
    return option;
  }

  async findOne(id: string): Promise<OptionDocument | null> {
    return this.optionModel.findById(new Types.ObjectId(id))
      .populate({
        path: 'icon',
        model: 'Media'
      })
      .exec();
  }

  async findBy(params: any): Promise<OptionDocument[] | null> {
    let filter = {};
    console.log(params);
    if (params.category) {
      filter = { categories: { $in: [params.category] } };
    }

    return this.optionModel.find(filter).sort({ titre: 1 }).exec();
  }

  async paginateOptions({ limit, sort, page, filter }: PaginateOptionsDto) {
    const filterQuery: FilterQuery<Option> = {
      $and: [],
    };

    if (filter.titre) {
      filterQuery.$and.push({
        titre: {
          $regex: new RegExp(filter.titre),
          $options: 'si',
        },
      });
    }

    if (filter.query) {
      filterQuery.$and.push({
        $or: [
          {
            description: {
              $regex: new RegExp(filter.query),
              $options: 'si',
            },
          },
          {
            titre: {
              $regex: new RegExp(filter.query),
              $options: 'si',
            },
          },
        ],
      });
    }

    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
      this.optionModel
        .find(filterQuery.$and.length > 0 ? filterQuery : {})
        .sort({ titre: 1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'icon',
          model: 'Media'
        })
        .populate({
          path: 'categories',
          model: 'Category'
        }),
      this.optionModel.countDocuments(filterQuery.$and.length > 0 ? filterQuery : {}),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      items: categories,
      total,
      page,
      totalPages,
    };
  }

  async deleteOption(id: string) {
    const option = await this.optionModel.findById(id);
    if (!option) {
      throw new NotFoundException(userStrings.OPTION_NOT_FOUND);
    }

    const res = await this.deleteOptionInsideEtbs(option.id);

    if (res.status === "ERROR") {
      return {
        status: 'ERROR',
        code: 'ACTION_FORBIDEN',
      };
    }

    await this.optionModel.deleteOne({ _id: option._id });

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      "L'option a été définitivement supprimé.",
    );
  }

  async deleteOptionInsideEtbs(optionId: string): Promise<
    | { status: 'OK' }
    | {
        status: 'ERROR';
        code: 'ACTION_FORBIDEN';
      }
  > {
    try {
      // Find all etablissements that include the optionId in their options array
      const etablissements = await this.etablissementModel.find({
        options: optionId,
      });
  
      if (!etablissements.length) {
        // No etablissements found with this option, nothing to do
        return { status: 'OK' };
      }
  
      // Remove the optionId from the options array of each etablissement
      await this.etablissementModel.updateMany(
        { options: optionId },
        { $pull: { options: optionId } },
      );
  
      return { status: 'OK' };
    } catch (error) {
      // If something goes wrong, return an error response
      console.error('Error removing option from etablissements:', error);
  
      return {
        status: 'ERROR',
        code: 'ACTION_FORBIDEN',
      };
    }
  }
  
}
