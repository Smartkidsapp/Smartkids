import { MediaDocument, MediaRefEntity } from '../schemas/media.schema';

export const MEDIA_CREATED_EVENT_NAME = 'media::created';
export const MEDIA_READ_REF_EVENT_NAME = 'media::read-ref';
export const MEDIA_UPDATED_EVENT_NAME = 'media::updated';
export const MEDIA_DELETED_EVENT_NAME = 'media::deleted';

export class MediaCreatedEvent {
  constructor(
    public media: MediaDocument<MediaRefEntity>,
    public userId?: string,
  ) {}
}

export class MediaReadRefEvent {
  constructor(public media: MediaDocument<MediaRefEntity>) {}
}

export class MediaUpdatedEvent {
  constructor(
    public media: MediaDocument<MediaRefEntity>,
    public userId?: string,
  ) {}
}

export class MediaDeletedEvent {
  constructor(
    public media: MediaDocument<MediaRefEntity>,
    public userId?: string,
  ) {}
}
