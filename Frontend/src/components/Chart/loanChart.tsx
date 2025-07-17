"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", loans: 186 },
  { month: "February", loans: 305 },
  { month: "March", loans: 237 },
  { month: "April", loans: 173 },
  { month: "May", loans: 209 },
  { month: "June", loans: 234 },
];

const chartConfig = {
  loans: {
    label: "Book Loans",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const LoanChart = () => {
  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white">
          Book Loan Statistics
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="loans" fill="var(--color-loans)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-gray-900 dark:text-white">
          Book loans increased by 12.3% this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-600 dark:text-gray-400">
          Showing total book loans for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};
