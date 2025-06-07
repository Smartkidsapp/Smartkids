import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import {
  SuccessResponse,
  SuccessResponseEnum,
} from 'src/core/httpResponse/SuccessReponse';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMediaDto } from './dtos/create-media.dto';
import { ApiFile } from './decorators/api-file.decorator';
import { Types } from 'mongoose';
import { MEDIA_TYPES } from './schemas/media.schema';
import { Request } from 'express';
import { UpdateMediaDto } from './dtos/update-media.dto';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';
import { UserRoleEnum } from '../users/schemas/users.schema';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';

@ApiTags('Medias')
@ApiBearerAuth()
@Controller('/api/v1/medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @OnlyRoles(UserRoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param() { id }: MongoIdDto) {
    const media = await this.mediaService.findOne(id);
    if (!media) {
      throw new NotFoundException('Media non trouvé.');
    }

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, media);
  }

  @ApiFile('file', true, undefined, {
    properties: {
      ref: {
        type: 'string',
        description: 'The id of the document to attach with the media.',
      },
      type: {
        type: 'string',
        description: 'The type of the medias',
        enum: [...MEDIA_TYPES],
      },
    },
    required: ['ref', 'type'],
  })
  @Post()
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 10 })],
      }),
    )
    file: Express.Multer.File,
    @Body() createMediaDto: CreateMediaDto,
    @Req() request: Request,
  ) {
    // TODO: check if the user is the owner of the ref or if the user is admin.
    const userId = request.user.sub;
    const media = await this.mediaService.createGeneric({
      file,
      ref: new Types.ObjectId(createMediaDto.ref),
      type: createMediaDto.type,
      userId,
    });

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, media);
  }

  @ApiFile('file', true, undefined, {
    properties: {
      type: {
        type: 'string',
        description: 'The type of the medias',
        enum: [...MEDIA_TYPES],
      },
    },
    required: ['type'],
  })
  @Put(':id')
  async update(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1000 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @Body() createMediaDto: UpdateMediaDto,
    @Param() { id }: MongoIdDto,
    @Req() request: Request,
  ) {
    const userId = request.user.sub;
    const media = await this.mediaService.updateGeneric({
      file,
      type: createMediaDto.type,
      id,
      userId,
    });

    if (!media) {
      throw new NotFoundException('Media non trouvé.');
    }

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, media);
  }

  @Delete(':id')
  async delete(@Param() { id }: MongoIdDto, @Req() request: Request) {
    const userId = request.user.sub;
    const media = await this.mediaService.deleteUserMedia(id, userId);
    if (!media) {
      throw new NotFoundException('Media non trouvé.');
    }

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, media);
  }
}
