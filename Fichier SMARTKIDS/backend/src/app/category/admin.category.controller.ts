import { Body, Controller, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { ApiFiles } from '../medias/decorators/api-files.decorator';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';
import { Request } from 'express';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';
import { UserRoleEnum } from '../users/schemas/users.schema';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ApiFile } from '../medias/decorators/api-file.decorator';
import { PaginateCategoriesDto } from './dtos/paginate-category.dto';

@ApiTags('category')
@ApiBearerAuth()
@Controller('/api/v1/admin/categories')
@OnlyRoles(UserRoleEnum.ADMIN)
export class AdminCategoryController {

    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @ApiFile('image', true, undefined)
    @Post('/')
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 10 })],
            }),
        )
        file: Express.Multer.File,
        @Req() request: Request
    ) {
        const userId = request.user.sub;
        const category = await this.categoryService.create(
            userId,
            createCategoryDto,
            file 
        );

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, category);
    }

    @ApiFile('image', false, undefined)
    @Put('/:id')
    async updateCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 10 })],
                fileIsRequired: false
            }),
        )
        file: Express.Multer.File,
        @Req() request: Request,
        @Param() { id }: MongoIdDto
    ) {
        const userId = request.user.sub;
        console.log(file);
        const category = await this.categoryService.edit(
            userId,
            createCategoryDto,
            file,
            id
        );

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, category);
    }

    @Get('/')
    async paginateCategories(@Query() paginateCategoriesDto: PaginateCategoriesDto) {
      const categories = await this.categoryService.paginateCategories(paginateCategoriesDto);
  
      return new SuccessResponse(SuccessResponseEnum.OK, undefined, categories);
    }

    @Get('/all')
    async getAllCategories() {
      const categories = await this.categoryService.findAll();
  
      return new SuccessResponse(SuccessResponseEnum.OK, undefined, categories);
    }

    @Get('/:id')
    async getCategory(@Param() { id }: MongoIdDto) {
        const categories = await this.categoryService.findOne(id);

        return new SuccessResponse(SuccessResponseEnum.OK, undefined, categories);
    }
}
