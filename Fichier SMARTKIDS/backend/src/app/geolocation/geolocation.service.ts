import { Inject, Injectable } from '@nestjs/common';
import {
  Client as GoogleMapClient,
  Language,
  LatLngLiteralVerbose,
  PlaceData,
} from '@googlemaps/google-maps-services-js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GeolocationService {
  private googleMapClient = new GoogleMapClient();

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getDirections(
    from: LatLngLiteralVerbose,
    to: LatLngLiteralVerbose,
    wayPoints?: LatLngLiteralVerbose[],
  ): Promise<{
    coords: LatLngLiteralVerbose[];
    duration: number;
    distance: number;
  }> {
    const cacheKey = this.getDirectionsCacheKey(from, to, wayPoints);
    const cachedResult = (await this.cacheManager.get(cacheKey)) as
      | {
          coords: LatLngLiteralVerbose[];
          duration: number;
          distance: number;
        }
      | undefined;

    if (cachedResult) {
      return cachedResult;
    }

    const response = await this.googleMapClient.directions({
      params: {
        origin: from,
        destination: to,
        waypoints: wayPoints,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to get directions');
    }

    const result = response.data.routes.reduce(
      (acc, route) => {
        const steps = route.legs[0].steps;
        const coordinates: LatLngLiteralVerbose[] = acc.coords;
        let totalDuration = acc.duration;
        let totalDistance = acc.distance;

        steps.forEach((step) => {
          const { start_location, end_location, duration, distance } = step;

          const isStartNotIncluded = !coordinates.find(
            (coord) =>
              coord.latitude === start_location.lat &&
              coord.longitude === start_location.lng,
          );

          const isEndNotIncluded = !coordinates.find(
            (coord) =>
              coord.latitude === end_location.lat &&
              coord.longitude === end_location.lng,
          );

          if (isStartNotIncluded) {
            coordinates.push({
              latitude:
                typeof start_location.lat === 'string'
                  ? parseFloat(start_location.lat)
                  : start_location.lat,
              longitude:
                typeof start_location.lng === 'string'
                  ? parseFloat(start_location.lng)
                  : start_location.lng,
            });
          }

          if (isEndNotIncluded) {
            coordinates.push({
              latitude:
                typeof end_location.lat === 'string'
                  ? parseFloat(end_location.lat)
                  : end_location.lat,
              longitude:
                typeof end_location.lng === 'string'
                  ? parseFloat(end_location.lng)
                  : end_location.lng,
            });
          }

          if (duration) {
            totalDuration += duration.value;
          }

          if (distance) {
            totalDistance += distance.value;
          }
        });

        return {
          coords: coordinates,
          duration: totalDuration,
          distance: totalDistance,
        };
      },
      {
        coords: [],
        duration: 0,
        distance: 0,
      },
    );

    result.coords = [
      {
        latitude:
          typeof from.latitude === 'string'
            ? parseFloat(from.latitude)
            : from.latitude,
        longitude:
          typeof from.longitude === 'string'
            ? parseFloat(from.longitude)
            : from.longitude,
      },
      ...result.coords,
      {
        latitude:
          typeof to.latitude === 'string'
            ? parseFloat(to.latitude)
            : to.latitude,
        longitude:
          typeof to.longitude === 'string'
            ? parseFloat(to.longitude)
            : to.longitude,
      },
    ];

    // Cache for 24 hours
    this.cacheManager.set(cacheKey, result, 1000 * 60 * 60 * 24);

    return result;
  }

  private getDirectionsCacheKey(
    from: LatLngLiteralVerbose,
    to: LatLngLiteralVerbose,
    wayPoints?: LatLngLiteralVerbose[],
  ) {
    const wayPointsKey = wayPoints.reduce((acc, wayPoint) => {
      return acc
        ? acc + '|' + wayPoint.latitude + ',' + wayPoint.longitude
        : wayPoint.latitude + ',' + wayPoint.longitude;
    }, '');

    return `directions::${from.latitude},${from.longitude}|${to.latitude},${to.longitude}|${wayPointsKey}`;
  }

  async getPlace(search: string, language: Language = Language.fr) {
    const cacheKey = 'places::' + search.trim().toLowerCase();
    const res = await this.cacheManager.get<Partial<PlaceData>[]>(cacheKey);
    if (res) {
      return res;
    }

    const response = await this.googleMapClient.textSearch({
      params: {
        language,
        key: process.env.GOOGLE_MAPS_API_KEY,
        query: search,
      },
    });

    const results = response.data.results.map(
      ({ formatted_address, geometry, name }) => ({
        name,
        formatted_address: formatted_address,
        lat:
          typeof geometry.location.lat === 'string'
            ? parseFloat(geometry.location.lat)
            : geometry.location.lat,
        lng:
          typeof geometry.location.lng === 'string'
            ? parseFloat(geometry.location.lng)
            : geometry.location.lng,
      }),
    );

    // Cache for 24 hours
    this.cacheManager.set(cacheKey, results, 1000 * 60 * 60 * 24);

    return results;
  }

  async geocodeAddress(
    lat: number,
    lng: number,
    language: Language = Language.fr,
  ) {
    const cacheKey = `geocode::${lat},${lng},${language}`;

    const result = await this.googleMapClient.reverseGeocode({
      params: {
        latlng: {
          lat,
          lng,
        },
        key: process.env.GOOGLE_MAPS_API_KEY,
        language,
      },
    });

    result.data.results[0].formatted_address;
  }
}
