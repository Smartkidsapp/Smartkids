import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating } from './schemas/rating.schema';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/schemas/users.schema';
import { Etablissement } from '../etablissement/schemas/etablissement.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(
    author: string,
    createRatingDto: CreateRatingDto
  ) {
    return await this.ratingModel.create({
      ...createRatingDto,
      etablissement: new Types.ObjectId(createRatingDto.etablissementId),
      author: new Types.ObjectId(author),
    });
  }

  async canUserRate(userId: string, etablissementId: string) {
    const existingRatings = await this.ratingModel.countDocuments({
      $and: [
        {
          etablissement: new Types.ObjectId(etablissementId),
          author: new Types.ObjectId(userId),
        },
      ],
    });

    return existingRatings === 0;
  }

  async findByEtablissement(id: string) {
    const ratings = await this.ratingModel.find({etablissement: new Types.ObjectId(id)})
    .populate('etablissement')
    .populate('author');
    return ratings;
  }

  async getUserRatingAVG(userId: string) {
    const result = await this.ratingModel.aggregate<{
      avg: number;
      total: number;
    }>([
      {
        $match: {
          subject: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$mark' },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avg: 1,
          total: 1,
        },
      },
    ]);

    if (result.length > 0) {
      return result[0];
    } else {
      return {
        avg: 0,
        total: 0,
      };
    }
  }

  async getEtablissementRatingAVG(etablissementId: string) {
    const result = await this.ratingModel.aggregate<{
      avg: number;
      total: number;
    }>([
      {
        $match: {
          etablissement: new Types.ObjectId(etablissementId),
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$mark' },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avg: 1,
          total: 1,
        },
      },
    ]);

    if (result.length > 0) {
      return result[0];
    } else {
      return {
        avg: 0,
        total: 0,
      };
    }
  }
}
