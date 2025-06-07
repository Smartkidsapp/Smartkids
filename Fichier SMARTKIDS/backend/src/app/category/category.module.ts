import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { MediaModule } from '../medias/media.module';
import { AdminCategoryController } from './admin.category.controller';
import { Media, MediaSchema } from '../medias/schemas/media.schema';

@Module({
  controllers: [CategoryController, AdminCategoryController],
  providers: [CategoryService],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Media.name, schema: MediaSchema },
    ]),
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
