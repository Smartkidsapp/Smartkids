import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoriteService } from './favorite.service';
import { Request } from 'express';
import { CreateFavoriteDto } from './dtos/favorite.dto';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';

@ApiTags('Favorite')
@ApiBearerAuth()
@Controller('api/v1/favorites')
export class FavoriteController {

    constructor(private readonly favoriteService: FavoriteService) { }

    @Post('/')
    async createRating(
        @Body() createFavoriteDto: CreateFavoriteDto,
        @Req() request: Request
    ) {

        const userId = request.user.sub;

        const result = await this.favoriteService.create(
            userId,
            createFavoriteDto,
        );

        return new SuccessResponse(SuccessResponseEnum.OK, 'Votre favori a été envoyé avec succès', result);
    }

    @Get('/')
    async getEtablissementRatings(@Req() request: Request) {

        const userId = request.user.sub;

        const result = await this.favoriteService.findByUser(userId);

        return new SuccessResponse(SuccessResponseEnum.OK, null, result);
    }

    @Get('/:id')
    async isFavorite(@Req() request: Request, @Param() { id }: MongoIdDto) {

        const userId = request.user.sub;

        const result = await this.favoriteService.isFavorite(userId, id);

        return new SuccessResponse(SuccessResponseEnum.OK, null, result);
    }
}
