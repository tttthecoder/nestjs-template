import { ApiProperty } from '@nestjs/swagger';

/**
 * A Data Transfer Object representing a successful response.
 */
export class SuccessResponseDto {
  @ApiProperty({
    example: true,
    title: 'Operation Success Status',
    type: 'boolean',
    description: 'This property will be true if the operation was successful, otherwise false.',
  })
  result: boolean;
}
