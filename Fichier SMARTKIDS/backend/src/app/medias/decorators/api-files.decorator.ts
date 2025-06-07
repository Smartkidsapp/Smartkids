import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { defaultStorage } from 'src/core/file-storage/disk.file-storage';

export function ApiFiles(
  fieldName: string = 'files',
  required: boolean = false,
  maxCount: number = 10,
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
    UseInterceptors(FilesInterceptor(fieldName, maxCount, options)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: requiredFields,
        properties: {
          [fieldName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
          ...apiProperties,
        },
      },
    }),
  );
}
