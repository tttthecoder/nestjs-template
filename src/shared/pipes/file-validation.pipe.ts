import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  /**
   * Initializes a new instance of FileValidationPipe.
   * @param fieldName - The name of the file field used in dto.
   * @param allowedExtensions - An array of allowed MIME types for the file.
   * @param allowedSize - The maximum allowed file size in bytes.
   */
  constructor(
    private readonly fieldName: string,
    private readonly allowedExtensions: string[],
    private readonly allowedSize: number,
  ) {}

  async transform(file: Express.Multer.File) {
    // Return early if no file is provided
    if (!file) return;

    const { mimetype, size, originalname } = file;
    const validationErrors: ValidationError[] = [];

    // Validate the file type
    if (!this.allowedExtensions.includes(mimetype)) {
      validationErrors.push({
        property: this.fieldName,
        constraints: {
          invalidFileType: `${originalname} is invalid. File type must be ${this.allowedExtensions.join(', ')}`,
        },
      });
    }

    // Validate the file size
    if (size > this.allowedSize) {
      validationErrors.push({
        property: this.fieldName,
        constraints: {
          invalidFileSize: `${originalname} must be less than or equal to ${this.allowedSize}MB`,
        },
      });
    }

    // If there are validation errors, throw a BadRequestException
    if (validationErrors.length > 0) {
      throw new BadRequestException(
        validationErrors.map((error) => ({ field: error.property, errors: Object.values(error.constraints ?? {}) })),
      );
    }

    // Return the validated file object
    return file;
  }
}
