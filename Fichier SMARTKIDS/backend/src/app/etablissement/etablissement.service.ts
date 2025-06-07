import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Etablissement, EtablissementDocument } from './schemas/etablissement.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateEtablissementDto } from './dtos/create-etablissement.dto';
import { MediaService } from '../medias/media.service';
import { Media, MediaDocument, MediaTypeEnum } from '../medias/schemas/media.schema';
import { SearchEtablissementDto } from './dtos/search-etablissement.dto';
import { User, UserStatusEnum } from '../users/schemas/users.schema';
import { PaginateEtablissementsDto } from './dtos/paginate-etbs.dto';
import userStrings from '../users/user.strings';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';

function cleanSocialLinks(dto: any) {
  const socialFields = ['facebook', 'instagram', 'linkedin', 'tiktok'];
  for (const field of socialFields) {
    const value = dto[field];
    if (!value || value === 'null' || value === 'undefined' || value.trim() === '') {
      dto[field] = undefined;
    }
  }
}


@Injectable()
export class EtablissementService {

  constructor(
    @InjectModel(Etablissement.name) private etablissementModel: Model<Etablissement>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument<EtablissementDocument>>,
    private readonly mediaService: MediaService
  ) { }

  async findBy(searchEtablissementDto: SearchEtablissementDto) {

    const { longitude, latitude, page, limit, nom, category, distance, min_age, max_age, options } = searchEtablissementDto;

    const pipeline = [];

    // Conditionally add the $geoNear stage only if both latitude and longitude are provided
    if (latitude != null && longitude != null) {
      const earthRadius = 6378.1; // Earth's radius in kilometers
      pipeline.push(
        {
          $addFields: {
            distance: {
              $multiply: [
                earthRadius,
                {
                  $acos: {
                    $add: [
                      {
                        $multiply: [
                          { $sin: { $degreesToRadians: "$latitude" } },
                          { $sin: { $degreesToRadians: parseFloat(latitude.toString()) } }
                        ]
                      },
                      {
                        $multiply: [
                          { $cos: { $degreesToRadians: "$latitude" } },
                          { $cos: { $degreesToRadians: parseFloat(latitude.toString()) } },
                          {
                            $cos: {
                              $subtract: [
                                { $degreesToRadians: "$longitude" },
                                { $degreesToRadians: parseFloat(longitude.toString()) }
                              ]
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        },
        {
          $sort: { distance: 1 }
        }
      );

      if (distance && distance > 0) {
        pipeline.push({
          $match: {
            distance: { $lte: parseInt(distance.toString()) }
          }
        })
      }
    }
    console.log(min_age, max_age);
    if (min_age && max_age) {
      pipeline.push(
        {
          $match: {
            min_age: { $lte: parseInt(max_age.toString()) },
            max_age: { $gte: parseInt(min_age.toString()) }
          }
        }
      )
    }

    if (options && options.length > 0) {
      let optionsId = options.split(',');
      pipeline.push(
        {
          $match: {
            options: { $in: optionsId.map(id => id) }
          }
        }
      )
    }

    // Add the $match stage for filtering based on the search DTO
    const filter: any = {};
    if (searchEtablissementDto.nom) {
      filter.nom = {
        $regex: new RegExp(searchEtablissementDto.nom, 'i')
      };
    }
    if (searchEtablissementDto.category) {
      filter.category = new Types.ObjectId(searchEtablissementDto.category)
    }
    pipeline.push({
      $match: filter
    });

    // Add the $lookup stages to populate category, options, and images
    pipeline.push(
      {
        $addFields: {
          userId: { $toObjectId: "$userId" } // Convert userId from string to ObjectId
        }
      },
      {
        $lookup: {
          from: 'users', // Assuming the User collection is called 'users'
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false // Ensure that only establishments with a user are included
        }
      },
      {
        $match: {
          'user.status': UserStatusEnum.ACTIVE // Assuming the status field is a string in the 'user' document
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          options: {
            $map: {
              input: "$options",
              as: "optionId",
              in: { $convert: { input: "$$optionId", to: "objectId" } }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'options',
          localField: 'options',
          foreignField: '_id',
          as: 'options'
        }
      },
      {
        $lookup: {
          from: 'media',
          localField: 'images',
          foreignField: '_id',
          as: 'images'
        }
      },
      // Custom transformation stage
      {
        $addFields: {
          id: { $toString: "$_id" },
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    );

    return this.etablissementModel.aggregate(pipeline).exec();
  }

  async paginate(searchEtablissementDto: SearchEtablissementDto) {

    const { longitude, latitude, page, limit, nom, category, distance, min_age, max_age, options } = searchEtablissementDto;

    const pipeline = [];
    const countPipeline = [];

    // Conditionally add the $geoNear stage only if both latitude and longitude are provided
    if (latitude != null && longitude != null) {
      const earthRadius = 6378.1; // Earth's radius in kilometers
      pipeline.push(
        {
          $addFields: {
            distance: {
              $multiply: [
                earthRadius,
                {
                  $acos: {
                    $add: [
                      {
                        $multiply: [
                          { $sin: { $degreesToRadians: "$latitude" } },
                          { $sin: { $degreesToRadians: parseFloat(latitude.toString()) } }
                        ]
                      },
                      {
                        $multiply: [
                          { $cos: { $degreesToRadians: "$latitude" } },
                          { $cos: { $degreesToRadians: parseFloat(latitude.toString()) } },
                          {
                            $cos: {
                              $subtract: [
                                { $degreesToRadians: "$longitude" },
                                { $degreesToRadians: parseFloat(longitude.toString()) }
                              ]
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        },
        {
          $sort: { distance: 1 }
        }
      );

      if (distance && distance > 0) {
        pipeline.push({
          $match: {
            distance: { $lte: parseInt(distance.toString()) }
          }
        })
      }
    }

    if (min_age && max_age) {
      pipeline.push(
        {
          $match: {
            min_age: { $lte: parseInt(max_age.toString()) },
            max_age: { $gte: parseInt(min_age.toString()) }
          }
        }
      )
    }

    if (options && options.length > 0) {
      let optionsId = options.split(',');
      pipeline.push(
        {
          $match: {
            options: { $in: optionsId.map(id => id) }
          }
        }
      )
    }

    // Add the $match stage for filtering based on the search DTO
    const filter: any = {};
    if (searchEtablissementDto.nom) {
      filter.nom = {
        $regex: new RegExp(searchEtablissementDto.nom, 'i')
      };
    }
    if (searchEtablissementDto.category) {
      filter.category = new Types.ObjectId(searchEtablissementDto.category)
    }
    pipeline.push({
      $match: filter
    });

    // Add the $lookup stages to populate category, options, and images
    pipeline.push(
      {
        $addFields: {
          userId: { $toObjectId: "$userId" } // Convert userId from string to ObjectId
        }
      },
      {
        $lookup: {
          from: 'users', // Assuming the User collection is called 'users'
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false // Ensure that only establishments with a user are included
        }
      },
      {
        $match: {
          'user.status': UserStatusEnum.ACTIVE // Assuming the status field is a string in the 'user' document
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          options: {
            $map: {
              input: "$options",
              as: "optionId",
              in: { $convert: { input: "$$optionId", to: "objectId" } }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'options',
          localField: 'options',
          foreignField: '_id',
          as: 'options'
        }
      },
      {
        $lookup: {
          from: 'media',
          localField: 'images',
          foreignField: '_id',
          as: 'images'
        }
      },
      // Custom transformation stage
      {
        $addFields: {
          id: { $toString: "$_id" },
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0
        }
      }
    );

    countPipeline.push(...pipeline);

    countPipeline.push({
      $count: 'count',
    });

    pipeline.push(
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    )

    const [data, countRes] = await Promise.all([
      this.etablissementModel.aggregate(pipeline).exec(),
      this.etablissementModel.aggregate<{ count: number }>(countPipeline),
    ]);

    const total = countRes.length ? countRes[0].count : 0;
    const pagesCount = Math.ceil(total / searchEtablissementDto.limit);
    const hasMore = searchEtablissementDto.page < pagesCount;

    return {
      items: data,
      total: total,
      has_more: hasMore,
      page: searchEtablissementDto.page,
      limit: searchEtablissementDto.limit,
      totalPages: pagesCount,
    };
  }

  async findOne(id: string) {
    return this.etablissementModel.findById(new Types.ObjectId(id))
      .populate('category')
      .populate({
        path: 'options',
        model: 'Option'
      })
      .populate({
        path: 'images',
        model: 'Media'
      })
      .exec();
  }

  async findByUser(userId: string) {
    return this.etablissementModel.findOne({ userId })
      .populate('category')
      .populate({
        path: 'options',
        model: 'Option'
      })
      .populate({
        path: 'images',
        model: 'Media'
      })
      .exec();
  }

  async paginateEtablissements({ limit, sort, page, filter }: PaginateEtablissementsDto) {
    const filterQuery: FilterQuery<Etablissement> = {
      $and: [],
    };

    if (filter.nom) {
      filterQuery.$and.push({
        nom: {
          $regex: new RegExp(filter.nom),
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
            nom: {
              $regex: new RegExp(filter.query),
              $options: 'si',
            },
          },
        ],
      });
    }

    const skip = (page - 1) * limit;
    const [etablissements, total] = await Promise.all([
      this.etablissementModel
        .find(filterQuery.$and.length > 0 ? filterQuery : {})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('category')
        .populate({
          path: 'options',
          model: 'Option'
        })
        .populate({
          path: 'images',
          model: 'Media'
        }),
      this.etablissementModel.countDocuments(filterQuery.$and.length > 0 ? filterQuery : {}),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      items: etablissements,
      total,
      page,
      totalPages,
    };
  }

  async create(userId: string, createEtablissementDto: CreateEtablissementDto, files: Express.Multer.File[]) {
    cleanSocialLinks(createEtablissementDto);
  
    const parsedDailyOpeningHours = createEtablissementDto.dailyOpeningHours.map(item => JSON.parse(item));
    const parsedServices = Array.isArray(createEtablissementDto.services)
      ? createEtablissementDto.services.map(item => JSON.parse(item))
      : (createEtablissementDto.services ? [JSON.parse(createEtablissementDto.services)] : []);
  
    const etablissement = await this.etablissementModel.create({
      ...createEtablissementDto,
      dailyOpeningHours: parsedDailyOpeningHours,
      services: parsedServices,
      userId,
      category: new Types.ObjectId(createEtablissementDto.category),
      click: createEtablissementDto.click,
      vue: createEtablissementDto.vue,
      website: createEtablissementDto.website,
      instagram: createEtablissementDto.instagram,
      facebook: createEtablissementDto.facebook,
      tiktok: createEtablissementDto.tiktok,
      linkedin: createEtablissementDto.linkedin,
    });
  
    for (let i = 0; i < files.length; i++) {
      const media = await this.mediaService.createGeneric({
        file: files[i],
        ref: new Types.ObjectId(etablissement.id),
        type: MediaTypeEnum.ETBS_IMAGE,
        userId,
      });
      etablissement.images.push(new Types.ObjectId(media.id));
    }
  
    await etablissement.save();
  
    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { isSeller: true },
      { new: true }
    );
  
    return { etablissement, user };
  }
  
  
  async edit(userId: string, createEtablissementDto: CreateEtablissementDto, files: Express.Multer.File[]) {
    const parsedDailyOpeningHours = createEtablissementDto.dailyOpeningHours.map(item => JSON.parse(item));
    const parsedServices = Array.isArray(createEtablissementDto.services)
      ? createEtablissementDto.services.map(item => JSON.parse(item))
      : (createEtablissementDto.services ? [JSON.parse(createEtablissementDto.services)] : []);

  
    const etablissement = await this.etablissementModel.findOneAndUpdate(
      { userId },
      {
        ...createEtablissementDto,
        dailyOpeningHours: parsedDailyOpeningHours,
        services: parsedServices,
        category: new Types.ObjectId(createEtablissementDto.category),
        click: createEtablissementDto.click,
        vue: createEtablissementDto.vue,
        website: createEtablissementDto.website,
        instagram: createEtablissementDto.instagram,
        facebook: createEtablissementDto.facebook,
        tiktok: createEtablissementDto.tiktok,
        linkedin: createEtablissementDto.linkedin,
      },
      { new: true }
    )
      .populate('category')
      .populate({ path: 'options', model: 'Option' })
      .populate({ path: 'images', model: 'Media' });
  
    for (let i = 0; i < files.length; i++) {
      const media = await this.mediaService.createGeneric({
        file: files[i],
        ref: new Types.ObjectId(etablissement.id),
        type: MediaTypeEnum.ETBS_IMAGE,
        userId,
      });
      etablissement.images.push(new Types.ObjectId(media.id));
    }
  
    await etablissement.save();
  
    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { isSeller: true },
      { new: true }
    );
  
    return { etablissement, user };
  }

  async incrementClick(id: string) {
    const etb = await this.etablissementModel.findByIdAndUpdate(
      id,
      { $inc: { click: 1 } },
      { new: true }
    );
    if (!etb) throw new NotFoundException('Établissement non trouvé');
    return etb;
  }
  
  async incrementVue(id: string) {
    const etb = await this.etablissementModel.findByIdAndUpdate(
      id,
      { $inc: { vue: 1 } },
      { new: true }
    );
    if (!etb) throw new NotFoundException('Établissement non trouvé');
    return etb;
  }
  


  async deleteImage(etablissementId: string, mediaId: string) {
    const etablissement = await this.etablissementModel.findById(etablissementId);
    if (!etablissement) {
      throw new NotFoundException('Etablissement non trouvé');
    }
  
    const media = await this.mediaModel.findById(mediaId);
    if (!media) {
      throw new NotFoundException('Media non trouvé');
    }
  
    if (!etablissement.images.includes(media._id)) {
      throw new NotFoundException("L'image ne correspond pas à cet établissement");
    }
  
    try {
      await this.mediaService.deleteFile(media.url);
    } catch (err) {
      console.error('Erreur suppression fichier :', err);
      // Optionnel : throw new InternalServerErrorException('Erreur lors de la suppression du fichier.');
    }
  
    try {
      await this.mediaModel.findByIdAndDelete(mediaId);
      await this.etablissementModel.findByIdAndUpdate(etablissementId, {
        $pull: { images: media._id }
      });
    } catch (err) {
      console.error('Erreur suppression base de données :', err);
      throw new InternalServerErrorException('Erreur lors de la suppression en base de données.');
    }
  
    return new SuccessResponse(SuccessResponseEnum.OK, 'Image supprimée');
  }
  
  
  
  

  async deleteEtablissement(id: string) {
    const etablissement = await this.etablissementModel.findByIdAndDelete(id);

    if (!etablissement) {
      throw new NotFoundException(userStrings.ETABLISSEMENT_NOT_FOUND);
    }

    const user = await this.userModel.findOneAndUpdate(
      {
        userId: etablissement.userId

      },
      {
        isSeller: false
      },
      {
        new: true
      }
    );

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      "L'établissement a été définitivement supprimé.",
    );
  }

}
