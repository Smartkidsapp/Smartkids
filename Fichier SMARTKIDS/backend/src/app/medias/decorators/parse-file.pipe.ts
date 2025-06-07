import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export default function ParseFile(
  mimes: string[] = [],
  maxSize = 1024 * 1000 * 10,
  required: boolean = true,
) {
  const typesValidators = mimes.map(
    (mime) =>
      new FileTypeValidator({
        fileType: mime,
      }),
  );
  return new ParseFilePipe({
    fileIsRequired: required,
    validators: [
      new MaxFileSizeValidator({
        maxSize,
        message: 'Fichier trop volumineux',
      }),
      ...typesValidators,
    ],
  });
}

export function ParseImageFile(
  maxSize = 1024 * 1000 * 5,
  required: boolean = true,
) {
  return ParseFile(['image/*'], maxSize, required);
}

export function ParsePDFFile(
  maxSize = 1024 * 1000 * 5,
  required: boolean = true,
) {
  return ParseFile(['application/pdf'], maxSize, required);
}
