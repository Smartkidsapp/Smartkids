import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { defaultStorage } from 'src/core/file-storage/disk.file-storage';

export type UploadFields = MulterField & { required?: boolean };

export function ApiFileFields(
  uploadFields: UploadFields[],
  localOptions?: Omit<MulterOptions, 'storage'>,
) {
  const bodyProperties: Record<string, SchemaObject | ReferenceObject> =
    Object.assign(
      {},
      ...uploadFields.map((field) => {
        return { [field.name]: { type: 'string', format: 'binary' } };
      }),
    );
  const apiBody = ApiBody({
    schema: {
      type: 'object',
      properties: bodyProperties,
      required: uploadFields.filter((f) => f.required).map((f) => f.name),
    },
  });

  const options: MulterOptions = localOptions ? localOptions : {};
  options.storage = defaultStorage;

  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadFields, options)),
    ApiConsumes('multipart/form-data'),
    apiBody,
  );
}
