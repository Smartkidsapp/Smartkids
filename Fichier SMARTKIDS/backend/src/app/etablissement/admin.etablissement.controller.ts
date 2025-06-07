import { Body, Controller, Delete, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EtablissementService } from './etablissement.service';
import { CreateEtablissementDto } from './dtos/create-etablissement.dto';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { ApiFiles } from '../medias/decorators/api-files.decorator';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';
import { SearchEtablissementDto } from './dtos/search-etablissement.dto';
import { Request } from 'express';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';
import { UserRoleEnum } from '../users/schemas/users.schema';
import { PaginateEtablissementsDto } from './dtos/paginate-etbs.dto';

@ApiTags('etablissement')
@ApiBearerAuth()
@Controller('/api/v1/admin/etablissement')
@OnlyRoles(UserRoleEnum.ADMIN)
export class AdminEtablissementController {
    
    constructor(
        private readonly etablissementService: EtablissementService,
    ) { }

    @Get('/')
    async paginateEtablissementss(@Query() paginateEtablissementsDto: PaginateEtablissementsDto) {
      const etablissement = await this.etablissementService.paginateEtablissements(paginateEtablissementsDto);
  
      return new SuccessResponse(SuccessResponseEnum.OK, undefined, etablissement);
    }

    @Get('/user/:id')
    async findByUser(@Param() { id }: MongoIdDto) {
        const etablissements = await this.etablissementService.findByUser(id);
        return new SuccessResponse(SuccessResponseEnum.OK, undefined, etablissements);
    }

    @Get(':id')
    async findOne(@Param() { id }: MongoIdDto) {
        const etablissement = await this.etablissementService.findOne(id);

        if (!etablissement) {
            throw new NotFoundException('Etablissement non trouvé.');
        }

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, etablissement);
    }

    @Delete('/:id')
    deleteUser(@Param() { id }: MongoIdDto) {
      return this.etablissementService.deleteEtablissement(id);
    }
}
