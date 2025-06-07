import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import StarFill from "./icons/StarFill";

export default function StarWidget({
  rating,
}: {
  rating?: { avg: number; total: number };
}) {
  if (!rating) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-end">
          <span className="text-muted-foreground">
            {rating?.avg.toFixed(2) ?? 0}
          </span>
          <span className="text-yellow-600">
            <StarFill />
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {`${rating?.avg.toFixed(2) ?? "-"} sur ${rating?.total ?? "-"} avis`}{" "}
      </TooltipContent>
    </Tooltip>
  );
}
