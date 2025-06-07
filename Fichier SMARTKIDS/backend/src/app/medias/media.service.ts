import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  MEDIA_PATHS,
  Media,
  MediaDocument,
  MediaRefEntity,
  MediaTypeEnum,
} from './schemas/media.schema';
import { join } from 'path';
import { move, remove } from 'fs-extra';
import { InjectModel } from '@nestjs/mongoose';
import { UPLOAD_DIR } from 'src/core/constants/dir.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MEDIA_DELETED_EVENT_NAME,
  MediaDeletedEvent,
} from './events/media-created.event';
import { Etablissement } from '../etablissement/schemas/etablissement.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Etablissement.name) private etablissementModel: Model<Etablissement>,
    @InjectModel(Media.name)
    private readonly mediaModel: Model<Media<MediaRefEntity>>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create({
    file,
    ref,
    type,
  }: {
    file: Express.Multer.File;
    ref: Types.ObjectId;
    type: MediaTypeEnum;
  }) {
    const dest = join(this.getAbsoluteDestDirByType(type), file.filename);
    await move(file.path, dest);
    return await this.mediaModel.create({
      originalName: file.originalname,
      ref,
      src: file.filename,
      type,
      size: file.size,
      mime: file.mimetype,
    });
  }

  async createGeneric(data: {
    file: Express.Multer.File;
    ref: Types.ObjectId;
    type: MediaTypeEnum;
    userId: string;
  }) {
    const media = await this.create(data);

    return media;
  }

  async delete(id: string) {
    const media = await this.mediaModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });

    if (media) {
      try {
        join(this.getAbsoluteDestDirByType(media.type), media.src);
      } catch (error) {}
    }

    return media;
  }

  async deleteFile(media: Media<MediaRefEntity>) {
    const path = join(this.getAbsoluteDestDirByType(media.type), media.src);
    await remove(path);
  }
  

  async deleteUserMedia(id: string, userId: string) {
    const media = await this.mediaModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
      })
      .populate('ref');
      
    if (!media) {
      throw new NotFoundException('Media non trouvé.');
    }

    if (!this.canUserUpdateMedia(media, userId)) {
      throw new UnauthorizedException('Action non autorisée.');
    }

    if(media.type == 'etbs-image') {
      const etablissement = await this.etablissementModel.findOneAndUpdate(
        {
          _id: media.ref._id
        },
        {
          $pull: {images: media._id}
        },
        {
          new: true
        }
      );
    }

    await this.eventEmitter.emitAsync(
      MEDIA_DELETED_EVENT_NAME,
      new MediaDeletedEvent(media),
    );

    if (media) {
      try {
        await remove(
          join(this.getAbsoluteDestDirByType(media.type), media.src),
        );
      } catch (error) {}
    }

    return media;
  }

  async canUserUpdateMedia(
    media: MediaDocument<MediaRefEntity>,
    userId: string,
  ) {
    switch (media.type) {
      case MediaTypeEnum.USER_PHOTO:
        return media.ref._id.toString() === userId;
      default:
        return false
    }
  }

  async updateGeneric(data: {
    id: string;
    file: Express.Multer.File;
    type: MediaTypeEnum;
    userId: string;
  }) {
    const media = await this.mediaModel.findOne({
      _id: new Types.ObjectId(data.id),
      type: data.type,
    });
    if (!media) {
      throw new NotFoundException('Media non trouvé.');
    }

    if (!this.canUserUpdateMedia(media, data.userId)) {
      throw new UnauthorizedException('Action non autorisée.');
    }

    return this.update({
      ...data,
    });
  }

  async update({
    file,
    id,
    type,
  }: {
    id: string;
    file: Express.Multer.File;
    type: MediaTypeEnum;
  }) {
    const dest = join(this.getAbsoluteDestDirByType(type), file.filename);
    await move(file.path, dest);
    const media = await this.mediaModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          originalName: file.originalname,
          src: file.filename,
        },
      },
    );

    if (media) {
      try {
        await remove(join(this.getAbsoluteDestDirByType(type), media.src));
      } catch (error) {
        console.log({ error });
      }

      return this.findOne(media._id.toString());
    }
  }

  async findOne(id: string) {
    return this.mediaModel.findById(new Types.ObjectId(id));
  }

  getAbsoluteDestDirByType(type: MediaTypeEnum) {
    return join(UPLOAD_DIR, MEDIA_PATHS[type]);
  }
}
