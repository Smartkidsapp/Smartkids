import {
  DriverRequest,
  DriverRequestStatusEnum,
} from "@/types/driver-request.types";
import zod from "zod";

export const reviewRequestSchema = zod.object({
  comment: zod.string(),
  status: zod.enum([
    DriverRequestStatusEnum.VALIDATED,
    DriverRequestStatusEnum.REJECTED,
  ]),
  rejectReasons: zod.array(zod.string()).optional(),
});

export type ReviewRequestDto = zod.infer<typeof reviewRequestSchema>;

export type IDriverRequestFilters = Partial<
  Pick<DriverRequest, "reviewed" | "status" | "userId">
> & {
  query?: string;
};
