import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { LocationCounterService } from './location-counter.service';
import { CreateLocationCounterDto, LocationCounterFilter } from './dto/create-location-counter.dto';
import { UpdateLocationCounterDto } from './dto/update-location-counter.dto';

@Controller('location-counter')
export class LocationCounterController {
  constructor(
    private readonly locationCounterService: LocationCounterService,
  ) {}

  @Post()
  async createLocationCounter(@Body() body: CreateLocationCounterDto) {
    try {
      return this.locationCounterService.createLocationCounter(body);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  getAllLocationCounters(@Query() query: LocationCounterFilter) {
    try {
      return this.locationCounterService.getAllLocationCounters(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  getLocationCounterById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.locationCounterService.getLocationCounterById(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  updateLocationCounterById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateLocationCounterDto,
  ) {
    try {
      return this.locationCounterService.updateLocationCounterById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  deleteLocationCounterById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.locationCounterService.deleteLocationCounterById(id);
    } catch (error) {
      throw error;
    }
  }
}
