import { ApiResponse } from '../../../store/apiSlice';
import { User } from '../../../types/user.types';
import { z } from 'zod';

export interface UserProfileResponse extends ApiResponse<User> {}

export const UpdateProfileSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email(),
  name: z.string(),
});
export type UpdateProfileDto = Zod.infer<typeof UpdateProfileSchema>;

export interface UpdateProfilePictureDto {
  uri: string;
  name: string;
  type: string;
}

export const UpdatePasswordSchema = z.object({
  newPassword: z.string(),
  currentPassword: z.string(),
});

export type UpdatePasswordDto = Zod.infer<typeof UpdatePasswordSchema>;

export const UpdateLanguagesSchema = z.object({
  languages: z.array(z.string()),
});
