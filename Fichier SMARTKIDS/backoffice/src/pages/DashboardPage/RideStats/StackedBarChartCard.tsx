import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ComponentProps } from "react";
import { formatPrice } from "@/lib/utils";

export function StackedBarChartCard<
  TDataFirstKey extends string,
  TDataSecondKey extends string,
  TDataVerticalKey extends string,
  TData extends {
    [K in TDataFirstKey | TDataSecondKey | TDataVerticalKey]: string | number;
  }[]
>({
  data,
  firstKey,
  secondKey,
  verticalKey,
  title,
  className,
}: {
  data: TData;
  firstKey: TDataFirstKey;
  secondKey: TDataSecondKey;
  verticalKey: TDataVerticalKey;
  title: string;
  className?: ComponentProps<typeof Card>["className"];
}) {
  const chartConfig = {
    [firstKey]: {
      label: firstKey,
      color: "rgba(8, 33, 45, 1)",
    },
    [secondKey]: {
      label: secondKey,
      color: "rgba(253, 123, 45, 1)",
    },
  } satisfies ChartConfig;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={verticalKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel={false} />}
              formatter={(value, name) => {
                if (name === "prix") {
                  return formatPrice(value as number);
                }

                return value;
              }}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey={verticalKey} />}
            />
            <Bar
              dataKey={firstKey}
              stackId="a"
              fill={`var(--color-${firstKey})`}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey={secondKey}
              stackId="a"
              fill={`var(--color-${secondKey})`}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
