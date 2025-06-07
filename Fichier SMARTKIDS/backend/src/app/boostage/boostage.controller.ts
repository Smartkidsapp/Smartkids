import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BoostageService } from './boostage.service';
import { CreateBoostageDto } from './dto/create-boostage.dto';
import { Request } from 'express';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { SearchEtablissementDto } from '../etablissement/dtos/search-etablissement.dto';

@ApiTags('boostage')
@ApiBearerAuth()
@Controller('/api/v1/boostage')
export class BoostageController {

    constructor(
        private readonly boostageService: BoostageService,
    ) { }

    @Post('/')
    async createEtablissement(
        @Body() createBoostageDto: CreateBoostageDto,
        @Req() request: Request
    ) {

        const userId = request.user.sub;

        const result = await this.boostageService.create(
            userId,
            createBoostageDto,
        );

        return new SuccessResponse(SuccessResponseEnum.OK, 'Votre établissement a été boosté avec succès', result);
    }

    @Get('/etablissements')
    async getRandomBoostedEtablissements(@Query() searchEtablissementDto: SearchEtablissementDto) {
  
      const etablissements = await this.boostageService.getRandomBoostedEtablissements(searchEtablissementDto);

      return new SuccessResponse(SuccessResponseEnum.OK, null, etablissements);
    }
}
