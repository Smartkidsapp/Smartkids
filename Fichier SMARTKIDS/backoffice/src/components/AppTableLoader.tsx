import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";

export default function AppTableLoader({
  columnNumber,
}: {
  columnNumber: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 min-w-[150px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(columnNumber)].map((_, idx) => (
                <TableHead className="w-[100px]" key={idx}>
                  <Skeleton className="h-4 min-w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(columnNumber)].map((_, idx) => (
                  <TableCell className="font-semibold" key={idx}>
                    <Skeleton className="h-4 min-w-[100px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
