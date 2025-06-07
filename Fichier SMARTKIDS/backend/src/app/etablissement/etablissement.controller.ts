import { Body, Controller, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UploadedFiles, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EtablissementService } from './etablissement.service';
import { CreateEtablissementDto } from './dtos/create-etablissement.dto';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { ApiFile } from '../medias/decorators/api-file.decorator';
import { MEDIA_TYPES } from '../medias/schemas/media.schema';
import { ApiFiles } from '../medias/decorators/api-files.decorator';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';
import { SearchEtablissementDto } from './dtos/search-etablissement.dto';
import { Request } from 'express';
import { PublicAccess } from '../auth/decorators/public-access.decorator';

@ApiTags('etablissement')
@Controller('/api/v1/etablissement')
export class EtablissementController {
    constructor(
        private readonly etablissementService: EtablissementService,
    ) { }

    @PublicAccess()
    @Get('/')
    async find(@Query() searchEtablissementDto: SearchEtablissementDto) {

        const etablissements = await this.etablissementService.findBy(searchEtablissementDto);

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, etablissements);
    }

    @PublicAccess()
    @Get('/paginate')
    async paginate(@Query() searchEtablissementDto: SearchEtablissementDto) {

        const result = await this.etablissementService.paginate(searchEtablissementDto);

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, result);
    }

    @PublicAccess()
    @Post('/:id/click')
    async incrementClick(@Param() { id }: MongoIdDto) {
    const result = await this.etablissementService.incrementClick(id);
    return new SuccessResponse(SuccessResponseEnum.OK, 'Click enregistré', result);
    }

    @PublicAccess()
    @Post('/:id/vue')
    async incrementVue(@Param() { id }: MongoIdDto) {
    const result = await this.etablissementService.incrementVue(id);
    return new SuccessResponse(SuccessResponseEnum.OK, 'Vue enregistrée', result);
    }



    @ApiBearerAuth()
    @Get('/me/user')
    async findByUser(@Req() request: Request) {
        const userId = request.user.sub;
        const etablissements = await this.etablissementService.findByUser(userId);
        return new SuccessResponse(SuccessResponseEnum.OK, undefined, etablissements);
    }

    @PublicAccess()
    @Get(':id')
    async findOne(@Param() { id }: MongoIdDto) {
        const etablissement = await this.etablissementService.findOne(id);

        if (!etablissement) {
            throw new NotFoundException('Etablissement non trouvé.');
        }

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, etablissement);
    }

    @ApiBearerAuth()
    @ApiFiles('images', true, undefined)
    @Post('/')
    async createEtablissement(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 10 })],
            }),
        )
        files: Express.Multer.File[],
        @Body() createEtablissementDto: CreateEtablissementDto,
        @Req() request: Request
    ) {

        const userId = request.user.sub;

        const result = await this.etablissementService.create(
            userId,
            createEtablissementDto,
            files
        );

        return new SuccessResponse(SuccessResponseEnum.OK, 'Votre établissement a été créé avec succès', result);
    }

    @ApiBearerAuth()
    @ApiFiles('images', false, undefined)
    @Put('/')
    async editEtablissement(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 10 })],
                fileIsRequired: false
            }),

        )
        files: Express.Multer.File[],
        @Body() createEtablissementDto: CreateEtablissementDto,
        @Req() request: Request
    ) {

        const userId = request.user.sub;

        const result = await this.etablissementService.edit(
            userId,
            createEtablissementDto,
            files
        );

        return new SuccessResponse(SuccessResponseEnum.OK, 'Votre établissement a été modifié avec succès', result);
    }

    @ApiBearerAuth()
    @Delete(':etablissementId/images/:mediaId')
    async deleteImage(
        @Param('etablissementId') etablissementId: string,
        @Param('mediaId') mediaId: string
      ) {
        return this.etablissementService.deleteImage(etablissementId, mediaId);
      }
}
