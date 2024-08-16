import { ApiProperty } from "@nestjs/swagger";
import { CreateLocationCounterDto } from "./create-location-counter.dto";


export class PaginationMetadataDto {
  @ApiProperty({ example: 100, description: 'The total number of location counters' })
  totalRows: number;

  @ApiProperty({ example: 10, description: 'Number of location counters per page' })
  perPage: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Indicates if there is a next page' })
  hasNextPage: boolean;
}

export class PaginationResponseDto {
  @ApiProperty({ type: [CreateLocationCounterDto], description: 'Array of location counter objects' })
  users: CreateLocationCounterDto[];

  @ApiProperty({ type: PaginationMetadataDto, description: 'Pagination metadata' })
  pagination: PaginationMetadataDto;
}