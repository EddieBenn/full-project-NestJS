import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationCounterDto } from './create-location-counter.dto';

export class UpdateLocationCounterDto extends PartialType(
  CreateLocationCounterDto,
) {}
