import { Media } from "./media.types";
import { Ride } from "./ride";
import { User } from "./user.types";

export interface Issue {
  id: string;
  createdAt: string;
  updatedAt: string;
  subject: string;
  content: string;
  userId: string;
  file?: string;
  ride?: Ride | null;
  user: User;
  media: Media<Issue>;
}
