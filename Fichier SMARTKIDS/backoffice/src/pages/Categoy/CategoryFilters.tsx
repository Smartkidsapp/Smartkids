import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICategoryFilters } from "@/redux/categories/categories.request";
import { PlusCircle, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryFilters({
  filters,
  setFilters,
}: {
  filters: ICategoryFilters;
  setFilters: Dispatch<SetStateAction<ICategoryFilters>>;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
      <div className="relative md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={filters.query}
          onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
          placeholder="Nom(s), description..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="h-10 gap-1"
          onClick={() => navigate("/categories/ajouter")}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Ajouter
          </span>
        </Button>
      </div>
    </div>
  );
}
