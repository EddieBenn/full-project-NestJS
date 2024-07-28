import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateLocationCounterDto,
  LocationCounterFilter,
  UserTypeEnum,
} from './dto/create-location-counter.dto';
import { UpdateLocationCounterDto } from './dto/update-location-counter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationCounter } from './entities/location-counter.entity';
import { ILike, Repository } from 'typeorm';
import { buildLocationCounterFilter } from 'src/filters/query-filter';

@Injectable()
export class LocationCounterService {
  constructor(
    @InjectRepository(LocationCounter)
    private readonly locationCounterRepository: Repository<LocationCounter>,
  ) {}

  async createLocationCounter(
    data: CreateLocationCounterDto,
  ): Promise<CreateLocationCounterDto> {
    return this.locationCounterRepository.save(data);
  }

  async getAllLocationCounters(queryParams: LocationCounterFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1 
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const skip = queryParams?.page ? (Number(queryParams.page) - 1) * size : 0;
    const query = await buildLocationCounterFilter(queryParams);
    const [locationCounters, count] =
      await this.locationCounterRepository.findAndCount({
        where: query,
        skip,
        take: size,
        order: { created_at: 'DESC' },
      });

    const totalPages = Math.ceil(count / size);
    return {
      locationCounters,
      pagination: {
        totalRows: count,
        perPage: size,
        currentPage: page,
        totalPages: Math.ceil(count / size),
        hasNextPage: page < totalPages,
      },
    };
  }

  async getLocationCounterById(id: string): Promise<CreateLocationCounterDto> {
    const locationCounter = await this.locationCounterRepository.findOne({
      where: { id },
    });
    if (!locationCounter?.id) {
      throw new HttpException(
        `location counter with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return locationCounter;
  }

  async updateLocationCounterById(id: string, data: UpdateLocationCounterDto) {
    return this.locationCounterRepository.update(id, data);
  }

  async deleteLocationCounterById(id: string) {
    return this.locationCounterRepository.delete(id);
  }

  async generateAppleID(
    city: string,
    user_type: UserTypeEnum
  ) {
    try {
      const generatedAppleId = await this.generateAppleIdByCity(
        city,
        user_type,
      );
      if (generatedAppleId?.appleId && generatedAppleId.cityCode) {
        await this.locationCounterRepository.increment(
          { city_code: generatedAppleId?.cityCode, user_type },
          'count',
          1,
        );
      }
      return generatedAppleId?.appleId;
    } catch (error) {
      throw new HttpException(
        error?.message || 'an error occurred while creating  appleId',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  async generateAppleIdByCity(city: string, user_type: UserTypeEnum) {
    const record = await this.locationCounterRepository.findOne({
      where: { city: ILike(city), user_type },
    });
    if (!record?.id) {
      throw new HttpException(
        `city ${city} and user type ${user_type} not found in location list`,
        HttpStatus.NOT_FOUND,
      );
    }
    const cityCode = record.city_code;
    const newCount = record.count + 1;

    if (user_type === UserTypeEnum.PROSPECT) {
      const appleId = `APP-${cityCode}-${newCount}`;
      return { appleId, cityCode };
    } else if (user_type === UserTypeEnum.AGENT) {
      const appleId = `APP-AG-${cityCode}-${newCount}`;
      return { appleId, cityCode };
    }
  }
}
