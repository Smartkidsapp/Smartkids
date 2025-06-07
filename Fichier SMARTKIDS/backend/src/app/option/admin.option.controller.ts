import { Body, Controller, Delete, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { ApiFiles } from '../medias/decorators/api-files.decorator';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';
import { Request } from 'express';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';
import { UserRoleEnum } from '../users/schemas/users.schema';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dtos/create-option.dto';
import { PaginateOptionsDto } from './dtos/paginate-options.dto';

@ApiTags('option')
@ApiBearerAuth()
@Controller('/api/v1/admin/options')
@OnlyRoles(UserRoleEnum.ADMIN)
export class AdminOptionController {
    constructor(
        private readonly optionService: OptionService,
    ) { }

    @Post('/')
    async createOption(@Body() createOptionDto: CreateOptionDto) {

        const option = await this.optionService.create(createOptionDto,);

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, option);
    }

    @Put('/:id')
    async updateCategory(
        @Body() createOptionDto: CreateOptionDto,
        @Param() { id }: MongoIdDto
    ) {
        const category = await this.optionService.edit(id, createOptionDto);

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, category);
    }

    @Get('/')
    async paginateOptions(@Query() paginateOptionsDto: PaginateOptionsDto) {
      const categories = await this.optionService.paginateOptions(paginateOptionsDto);
  
      return new SuccessResponse(SuccessResponseEnum.OK, undefined, categories);
    }

    @Get('/:id')
    async getCategory(@Param() { id }: MongoIdDto) {
        const option = await this.optionService.findOne(id);

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, option);
    }

    @Delete('/:id')
    deleteUser(@Param() { id }: MongoIdDto) {
      return this.optionService.deleteOption(id);
    }
}
