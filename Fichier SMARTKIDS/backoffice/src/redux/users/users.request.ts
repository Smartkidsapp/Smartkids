import { z } from "zod";
import { User } from "@/types/user.types";
import { ApiResponse } from "@/redux/apiSlice";
import { AddressTypeEnum } from "@/types/user-address.types";

export interface UserProfileResponse extends ApiResponse<User> {}

export const UpdateProfileSchema = z.object({
  password: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().regex(/^0\d \d{2} \d{2} \d{2} \d{2}$/, {
    message: "Format requis: 0x xx xx xx xx",
  }),
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

export type UpdateLanguagesDto = Zod.infer<typeof UpdateLanguagesSchema>;

export type UpdateAddressDto = {
  address: string;
  type: AddressTypeEnum;
};

export type IUserFilters = Partial<
  Pick<User, "role" | "email" | "name" | "activeRole">
> & {
  query?: string;
};
