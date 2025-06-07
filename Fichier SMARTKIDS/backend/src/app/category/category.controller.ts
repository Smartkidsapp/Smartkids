import { Body, Controller, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ApiFile } from '../medias/decorators/api-file.decorator';
import { PublicAccess } from '../auth/decorators/public-access.decorator';

@ApiTags('Category')
@Controller('/api/v1/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @PublicAccess()
  @Get('/')
  async getCategories() {
    const categories = await this.categoryService.findAll();

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, categories);
  }
}
