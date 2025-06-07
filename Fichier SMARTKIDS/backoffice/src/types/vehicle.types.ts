import { DriverRequest } from '@/types/driver-request.types';
import { Media } from '@/types/media.types';

export interface Vehicle {
  id: string;
  createdAt: string;
  updatedAt: string;
  photos: Media<DriverRequest>[];
  vehicleCertificate: Media<DriverRequest>[];
  vehicleModel: string | null;
  date: string | null;
  plateNumber: string | null;
}
