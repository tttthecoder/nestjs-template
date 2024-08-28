import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({
    example: 1,
    description: 'The current page number being returned.',
  })
  currentPage: number;
  @ApiProperty({
    example: 0,
    description: 'The number of records that were skipped to get to the current page.',
  })
  skippedRecords: number;
  @ApiProperty({
    example: 10,
    description: 'The total number of pages available based on the total records and the size of each page.',
  })
  totalPages: number;
  @ApiProperty({
    example: true,
    description: 'Indicates whether there is a next page available.',
  })
  hasNext: boolean;
  @ApiProperty({
    description: 'The array of records for the current page.',
  })
  content: T[];
  @ApiProperty({
    example: 10,
    description: 'The number of records in the current payload.',
  })
  payloadSize: number;
  @ApiProperty({
    example: 100,
    description: 'The total number of records available.',
  })
  totalRecords: number;
}
