import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { defaultStorage } from 'src/core/file-storage/disk.file-storage';
import { fileMimetypeFilter } from './file-mime-type.filer';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function ApiFile(
  fieldName: string = 'file',
  required: boolean = false,
  localOptions?: Omit<MulterOptions, 'storage'>,
  api: {
    fileDescription?: string;
    properties?: Record<string, SchemaObject | ReferenceObject>;
    required: string[];
  } = {
    properties: {},
    required: [],
  },
) {
  const options: MulterOptions = localOptions ? localOptions : {};
  options.storage = defaultStorage;

  const apiProperties = api.properties ?? {};

  const requiredFields = api.required?.length ? api.required : [];
  if (required) {
    requiredFields.push(fieldName);
  }

  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, options)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: requiredFields,
        properties: {
          [fieldName]: {
            description: api.fileDescription ?? 'The file to upload',
            type: 'string',
            format: 'binary',
          },
          ...apiProperties,
        },
      },
    }),
  );
}

export function ApiImageFile(
  fileName: string = 'image',
  required: boolean = false,
) {
  return ApiFile(fileName, required, {
    fileFilter: fileMimetypeFilter('image'),
  });
}

export function ApiPdfFile(
  fileName: string = 'document',
  required: boolean = false,
) {
  return ApiFile(fileName, required, {
    fileFilter: fileMimetypeFilter('pdf'),
  });
}
