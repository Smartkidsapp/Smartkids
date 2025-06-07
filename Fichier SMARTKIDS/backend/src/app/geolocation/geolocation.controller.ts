import { BadGatewayException, Controller, Get, Query } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { GetDirectionDto } from './dto/get-directions.dto';
import {
  SuccessResponse,
  SuccessResponseEnum,
} from 'src/core/httpResponse/SuccessReponse';
import { Language } from '@googlemaps/google-maps-services-js';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PublicAccess } from '../auth/decorators/public-access.decorator';

@ApiTags('Geolocation')
@Controller('/api/v1/geo')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @ApiQuery({ style: 'deepObject', name: 'from', required: true })
  @ApiQuery({ style: 'deepObject', name: 'to', required: true })
  @ApiQuery({ style: 'deepObject', name: 'waypoints', required: false })
  @Get('/directions')
  async getDirections(@Query() { from, to, waypoints }: GetDirectionDto) {
    try {
      const result = await this.geolocationService.getDirections(
        from,
        to,
        waypoints,
      );

      return new SuccessResponse(SuccessResponseEnum.OK, undefined, result);
    } catch (error) {
      console.error(error);
      throw new BadGatewayException('Failed to get directions');
    }
  }

  @PublicAccess()
  @Get('/place-search')
  async getPlace(
    @Query('query') query: string,
    @Query('lang') lang = Language.fr,
  ) {
    try {
      console.log('place-search', { query, lang });
      const result = await this.geolocationService.getPlace(query, lang);

      return new SuccessResponse(SuccessResponseEnum.OK, undefined, result);
    } catch (error) {
      console.error(error);
      throw new BadGatewayException('Failed to get directions');
    }
  }
}
