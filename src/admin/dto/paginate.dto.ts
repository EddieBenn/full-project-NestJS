import { ApiProperty } from "@nestjs/swagger";
import { CreateAdminDto } from "./create-admin.dto";


export class PaginationMetadataDto {
  @ApiProperty({ example: 100, description: 'The total number of admins' })
  totalRows: number;

  @ApiProperty({ example: 10, description: 'Number of admins per page' })
  perPage: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Indicates if there is a next page' })
  hasNextPage: boolean;
}

export class PaginationResponseDto {
  @ApiProperty({ type: [CreateAdminDto], description: 'Array of admin objects' })
  users: CreateAdminDto[];

  @ApiProperty({ type: PaginationMetadataDto, description: 'Pagination metadata' })
  pagination: PaginationMetadataDto;
}