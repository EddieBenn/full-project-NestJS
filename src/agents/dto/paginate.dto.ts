import { ApiProperty } from "@nestjs/swagger";
import { CreateAgentDto } from "./create-agent.dto";


export class PaginationMetadataDto {
  @ApiProperty({ example: 100, description: 'The total number of agents' })
  totalRows: number;

  @ApiProperty({ example: 10, description: 'Number of agents per page' })
  perPage: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Indicates if there is a next page' })
  hasNextPage: boolean;
}

export class PaginationResponseDto {
  @ApiProperty({ type: [CreateAgentDto], description: 'Array of agent objects' })
  users: CreateAgentDto[];

  @ApiProperty({ type: PaginationMetadataDto, description: 'Pagination metadata' })
  pagination: PaginationMetadataDto;
}