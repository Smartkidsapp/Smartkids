import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loader() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardFooter>
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>
            <Skeleton className="h-1 w-1/3" />
          </CardDescription>
          <CardTitle className="text-4xl">
            <Skeleton className="h-4 w-1/3" />
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>
            <Skeleton className="h-1 w-1/3" />
          </CardDescription>
          <CardTitle className="text-4xl">
            <Skeleton className="h-4 w-1/3" />
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
