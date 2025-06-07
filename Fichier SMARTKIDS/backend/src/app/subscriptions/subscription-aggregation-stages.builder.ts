import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { MEDIA_PATHS, MediaTypeEnum } from '../medias/schemas/media.schema';
import { Subscription } from './schemas/subscription.schema';
import { FilterSubscriptionsDto } from './dto/filter-subscriptions.dto';

export class SubscriptionAggregationStagesBuilder {
  private listStages: PipelineStage[] = [];
  private countStages: PipelineStage[] = [];
  private filter: FilterQuery<Subscription> = {
    $and: [],
  };

  constructor(
    private paginationDto: FilterSubscriptionsDto & {
      limit?: number;
      page?: number;
      groupBy?: string;
    },
    private userId: Types.ObjectId,
  ) {}

  reset(
    paginationDto?: FilterSubscriptionsDto & {
      limit?: number;
      page?: number;
    },
  ) {
    if (paginationDto) {
      this.paginationDto = paginationDto;
    }

    this.filter = {
      $and: [],
    };
    this.listStages = [];
    this.countStages = [];
    return this;
  }

  match() {
    if (this.paginationDto.query) {
      this.filter.$and!.push({
        $or: [
          {
            'user.name': {
              $regex: new RegExp(this.paginationDto.query),
              $options: 'si',
            },
            'user.email': {
              $regex: new RegExp(this.paginationDto.query),
              $options: 'si',
            },
          },
        ],
      });
    }

    if (!this.filter.$and?.length) {
      delete this.filter.$and;
    }

    this.listStages.push({
      $match: this.filter,
    });

    this.countStages.push({
      $match: this.filter,
    });

    return this;
  }

  lookupUnwinds() {
    const lookupStage: PipelineStage[] = [];

    lookupStage.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        pipeline: [
          {
            $lookup: {
              from: 'media',
              localField: 'media',
              foreignField: '_id',
              as: 'media',
            },
          },
          {
            $unwind: {
              path: '$media',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        foreignField: '_id',
        as: 'user',
      },
    });

    lookupStage.push({
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    });

    lookupStage.push({
      $addFields: {
        id: '$_id',
        'user.avatar': {
          $cond: {
            if: { $eq: ['$user.media.type', MediaTypeEnum.USER_PHOTO] },
            then: {
              $concat: [
                process.env.SERVER_URL,
                `/assets/${MEDIA_PATHS[MediaTypeEnum.USER_PHOTO]}/`,
                '$user.media.src',
              ],
            },
            else: null,
          },
        },
      },
    });

    this.listStages.push(...lookupStage);
    this.countStages.push(...lookupStage);
    return this;
  }

  sort() {
  this.listStages.push({
    $sort: {
      createdAt: -1,
    },
  });
    return this;
  }

  skip() {
    const page = this.paginationDto.page || 1;
    const limit = this.paginationDto.limit || 10;
    this.listStages.push({
      $skip: (page - 1) * limit,
    });
    return this;
  }

  limit() {
    const limit = this.paginationDto.limit || 10;

    this.listStages.push({
      $limit: limit,
    });

    return this;
  }

  project() {
    this.listStages.push({
      $project: this.projectedFields,
    });
    return this;
  }

  private projectedFields = {
    _id: 0,
    __v: 0,
    'media._id': 0,
    'media.__v': 0,

    'user.media._id': 0,
    'user.media.__v': 0,
  };

  buildStages() {
    if (this.paginationDto.groupBy) {
      this.countStages.push({
        $group: {
          _id: `$${this.paginationDto.groupBy}`,
          count: { $count: {} },
        },
      });
    } else {
      this.countStages.push({
        $count: 'count',
      });
    }

    return {
      listStages: this.listStages,
      countStages: this.countStages,
    };
  }

  getFilters() {
    return this.filter;
  }
}
