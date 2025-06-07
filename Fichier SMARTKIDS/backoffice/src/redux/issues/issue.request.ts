import { Issue } from "@/types/issue.types";

export type IIssueFilters = Partial<
  Pick<Issue, "userId" | "subject" | "content">
> & {
  query?: string;
};
