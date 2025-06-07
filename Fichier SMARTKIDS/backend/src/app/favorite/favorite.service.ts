import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from './schemas/favorite.schema';
import { CreateFavoriteDto } from './dtos/favorite.dto';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
    ) { }

    async create(
        author: string,
        createFavoriteDto: CreateFavoriteDto
    ) {
        const existingFavorite = await this.favoriteModel.findOne({
            etablissement: new Types.ObjectId(createFavoriteDto.etablissementId),
            user: new Types.ObjectId(author),
        });

        if (existingFavorite) {
            await this.favoriteModel.deleteOne({
                _id: existingFavorite._id,
            });
            return existingFavorite;
        } else {
            return await this.favoriteModel.create({
                ...createFavoriteDto,
                etablissement: new Types.ObjectId(createFavoriteDto.etablissementId),
                user: new Types.ObjectId(author),
            });
        }
    }

    async isFavorite(
        author: string,
        id: string
    ) {
        const existingFavorite = await this.favoriteModel.findOne({
            etablissement: new Types.ObjectId(id),
            user: new Types.ObjectId(author),
        });

        if (existingFavorite) {
            return true;
        } else {
            return false;
        }
    }

    async findByUser(id: string) {
        const favorites = await this.favoriteModel.find({ user: new Types.ObjectId(id) })
            .populate({
                path: 'etablissement',
                populate: [
                    {
                        path: 'images',
                        model: 'Media'
                    },
                    {
                        path: 'category',
                        model: 'Category'
                    }
                ]
            })
            .populate('user');
        return favorites;
    }
}
