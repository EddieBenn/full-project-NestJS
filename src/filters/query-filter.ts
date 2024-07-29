import { HttpException, HttpStatus } from "@nestjs/common";
import { LocationCounterFilter } from "src/location-counter/dto/create-location-counter.dto";
import { Between, ILike } from "typeorm";

export const buildLocationCounterFilter = async (queryParams: LocationCounterFilter) => {
    const query = {};
    if (queryParams?.city) query['city'] = ILike(queryParams.city);
    if (queryParams?.user_type) query['user_type'] = queryParams.user_type.toLowerCase();
    
    if (queryParams?.start_date && queryParams?.end_date) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(queryParams?.start_date)) {
            throw new HttpException(`use date format yy-mm-dd`, HttpStatus.NOT_ACCEPTABLE);
        }
        query['created_at'] = Between(new Date(queryParams.start_date), new Date(queryParams.end_date));
    }
    return query;
};