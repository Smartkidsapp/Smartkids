import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { MediaService } from '../medias/media.service';
import { MediaTypeEnum } from '../medias/schemas/media.schema';
import { PaginateCategoriesDto } from './dtos/paginate-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly mediaService: MediaService
  ) { }

  async create(userId: string, createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<CategoryDocument | null> {
    const category = await this.categoryModel.create(createCategoryDto);

    const media = await this.mediaService.createGeneric({
      file,
      ref: new Types.ObjectId(category.id),
      type: MediaTypeEnum.CATEGORY_IMAGE,
      userId,
    });
    if (media) {
      category.icon = new Types.ObjectId(media.id);
      category.save();
    }

    return category;
  }

  async edit(userId: string, createCategoryDto: CreateCategoryDto, file: Express.Multer.File, id: string): Promise<CategoryDocument | null> {
    const category = await this.categoryModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id)
      },
      createCategoryDto
      ,
      {
        new: true
      }
    );

    if (file) {
      const media = await this.mediaService.createGeneric({
        file,
        ref: new Types.ObjectId(category.id),
        type: MediaTypeEnum.CATEGORY_IMAGE,
        userId,
      });
      if (media) {
        category.icon = new Types.ObjectId(media.id);
        category.save();
      }
    }

    return category;
  }

  async findAll(): Promise<CategoryDocument[] | null> {
    return this.categoryModel.find().sort({ titre: 1 })
      .populate({
        path: 'icon',
        model: 'Media'
      })
      .exec();
  }

  async findOne(id: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findById(new Types.ObjectId(id))
      .populate({
        path: 'icon',
        model: 'Media'
      })
      .exec();
  }

  async paginateCategories({ limit, sort, page, filter }: PaginateCategoriesDto) {
    const filterQuery: FilterQuery<Category> = {
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
      this.categoryModel
        .find(filterQuery.$and.length > 0 ? filterQuery : {})
        .sort({ titre: 1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'icon',
          model: 'Media'
        }),
      this.categoryModel.countDocuments(filterQuery.$and.length > 0 ? filterQuery : {}),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      items: categories,
      total,
      page,
      totalPages,
    };
  }
}
