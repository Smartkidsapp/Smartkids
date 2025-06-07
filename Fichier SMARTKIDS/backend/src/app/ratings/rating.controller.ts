import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { RatingService } from './rating.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Request } from 'express';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';

@ApiTags('Ratings')
@ApiBearerAuth()
@Controller('api/v1/ratings')
export class RatingController {

  constructor(private readonly ratingService: RatingService) { }

  @Post('/')
  async createRating(
    @Body() createRatingDto: CreateRatingDto,
    @Req() request: Request
  ) {

    const userId = request.user.sub;

    const result = await this.ratingService.create(
      userId,
      createRatingDto,
    );

    return new SuccessResponse(SuccessResponseEnum.OK, 'Votre avis a été envoyé avec succès', result);
  }

  @Get('/user/can-rate')
  async canUserRate(
    @Query() {etablissementId}: {etablissementId: string},
    @Req() request: Request
  ) {

    const userId = request.user.sub;

    const result = await this.ratingService.canUserRate(
      userId,
      etablissementId,
    );

    return new SuccessResponse(SuccessResponseEnum.OK, 'Votre avis a été envoyé avec succès', result);
  }

  @Get('/etablissement/:id')
  async getEtablissementRatings(@Param() { id }: MongoIdDto) {

    const result = await this.ratingService.findByEtablissement(id);

    return new SuccessResponse(SuccessResponseEnum.OK, 'Votre avis a été envoyé avec succès', result);
  }
}
