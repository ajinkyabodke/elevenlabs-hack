"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type JournalEntry } from "@/types";
import type { CustomTooltipProps } from "@tremor/react";
import { AreaChart, Metric, Text, Card as TremorCard } from "@tremor/react";
import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface TrendsChartsProps {
  entries: JournalEntry[];
}

export function TrendsCharts({ entries }: TrendsChartsProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  // Helper function to get entries within a date range
  const getEntriesInRange = (start: Date, end: Date) => {
    return entries.filter((entry) =>
      isWithinInterval(new Date(entry.createdAt), { start, end }),
    );
  };

  // Get entries for selected month
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const monthlyEntries = getEntriesInRange(monthStart, monthEnd);

  // Get entries for selected week
  const weekStart = startOfWeek(selectedWeek);
  const weekEnd = endOfWeek(selectedWeek);
  const weeklyEntries = getEntriesInRange(weekStart, weekEnd);

  // Calculate averages
  const calculateAverage = (entries: JournalEntry[]) => {
    if (entries.length === 0) return 0;
    return (
      entries.reduce((acc, entry) => acc + parseFloat(entry.moodScore), 0) /
      entries.length
    );
  };

  const weeklyAverage = calculateAverage(weeklyEntries);
  const monthlyAverage = calculateAverage(monthlyEntries);
  const overallAverage = calculateAverage(entries);

  // Prepare monthly data for chart
  const monthlyData = monthlyEntries
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((entry) => ({
      date: format(new Date(entry.createdAt), "MMM dd"),
      "Mood Score": parseFloat(entry.moodScore),
    }));

  // Prepare weekly data for chart
  const weeklyData = weeklyEntries
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((entry) => ({
      date: format(new Date(entry.createdAt), "EEE"),
      fullDate: format(new Date(entry.createdAt), "EEE, MMM dd"),
      "Mood Score": parseFloat(entry.moodScore),
    }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Overall Stats Card */}
        <TremorCard className="relative h-full rounded-xl p-4">
          <div className="flex h-full min-h-[120px] flex-col justify-between">
            <div>
              <Text className="text-sm">Overall Average</Text>
              <Metric className="mt-1">{overallAverage.toFixed(1)}</Metric>
            </div>
            <div>
              <Text className="text-sm text-muted-foreground">All time</Text>
              <Text className="text-sm text-muted-foreground">
                {entries.length} total entries
              </Text>
            </div>
          </div>
        </TremorCard>

        {/* Monthly Stats Card */}
        <TremorCard className="relative h-full rounded-xl p-4">
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex h-full min-h-[120px] flex-col justify-between">
            <div>
              <Text className="text-sm">Monthly Average</Text>
              <Metric className="mt-1">{monthlyAverage.toFixed(1)}</Metric>
            </div>
            <div>
              <Text className="text-sm text-muted-foreground">
                {format(monthStart, "MMMM yyyy")}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {monthlyEntries.length} entries this month
              </Text>
            </div>
          </div>
        </TremorCard>

        {/* Weekly Stats Card */}
        <TremorCard className="relative h-full rounded-xl p-4">
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex h-full min-h-[120px] flex-col justify-between">
            <div>
              <Text className="text-sm">Weekly Average</Text>
              <Metric className="mt-1">{weeklyAverage.toFixed(1)}</Metric>
            </div>
            <div>
              <Text className="text-sm text-muted-foreground">
                {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd")}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {weeklyEntries.length} entries this week
              </Text>
            </div>
          </div>
        </TremorCard>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Mood Trends</CardTitle>
            <CardDescription>
              {format(monthStart, "MMMM yyyy")} - Daily mood scores with trend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="mt-4 h-80"
              data={monthlyData}
              index="date"
              categories={["Mood Score"]}
              colors={["blue"]}
              yAxisWidth={65}
              showAnimation
              showLegend={false}
              showGridLines
              showTooltip
              curveType="natural"
              valueFormatter={(value: number) => `${value.toFixed(1)}`}
              customTooltip={(props: CustomTooltipProps) => {
                if (!props.payload?.[0]) return null;
                const value = props.payload[0].value as number;
                const date = (props.payload[0].payload as { date: string })
                  .date;

                return (
                  <div className="rounded-lg border bg-background p-2 shadow-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{date}</span>
                      <span className="text-lg font-bold">
                        Score: {value.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              }}
              noDataText="No data for this month"
              enableLegendSlider={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Mood Details</CardTitle>
            <CardDescription>
              {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd")} -
              Daily mood progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="mt-4 h-80"
              data={weeklyData}
              index="date"
              categories={["Mood Score"]}
              colors={["blue"]}
              yAxisWidth={65}
              showAnimation
              showLegend={false}
              showGridLines
              showTooltip
              curveType="natural"
              valueFormatter={(value: number) => `${value.toFixed(1)}`}
              customTooltip={(props: CustomTooltipProps) => {
                if (!props.payload?.[0]) return null;
                const value = props.payload[0].value as number;
                const fullDate = (
                  props.payload[0].payload as { fullDate: string }
                ).fullDate;

                return (
                  <div className="rounded-lg border bg-background p-2 shadow-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{fullDate}</span>
                      <span className="text-lg font-bold">
                        Score: {value.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              }}
              noDataText="No data for this week"
              enableLegendSlider={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
