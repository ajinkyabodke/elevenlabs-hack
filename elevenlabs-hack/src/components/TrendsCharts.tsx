"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type JournalEntry } from "@/types";
import {
  AreaChart,
  BarChart,
  DonutChart,
  Flex,
  Grid,
  Metric,
  Text,
  Card as TremorCard,
} from "@tremor/react";
import { endOfWeek, format, isWithinInterval, startOfWeek } from "date-fns";

interface TrendsChartsProps {
  entries: JournalEntry[];
}

export function TrendsCharts({ entries }: TrendsChartsProps) {
  // Prepare data for charts
  const moodData = entries
    .slice()
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.createdAt), "MMM dd"),
      "Mood Score": parseFloat(entry.moodScore),
    }));

  // Calculate weekly averages
  const weeklyAverages = entries.reduce(
    (acc, entry) => {
      const date = new Date(entry.createdAt);
      const weekStart = format(date, "MMM dd");
      if (!acc[weekStart]) {
        acc[weekStart] = {
          total: 0,
          count: 0,
        };
      }
      acc[weekStart].total += parseFloat(entry.moodScore);
      acc[weekStart].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const weeklyData = Object.entries(weeklyAverages).map(([date, data]) => ({
    date,
    "Weekly Average": Number((data.total / data.count).toFixed(2)),
  }));

  // Calculate mood distribution
  const moodDistribution = entries.reduce(
    (acc, entry) => {
      const score = parseFloat(entry.moodScore);
      if (score >= 75) acc.Excellent++;
      else if (score >= 50) acc.Good++;
      else if (score >= 25) acc.Fair++;
      else acc.Poor++;
      return acc;
    },
    { Excellent: 0, Good: 0, Fair: 0, Poor: 0 },
  );

  const moodDistributionData = Object.entries(moodDistribution).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // Calculate current week stats
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const currentWeekEntries = entries.filter((entry) =>
    isWithinInterval(new Date(entry.createdAt), {
      start: weekStart,
      end: weekEnd,
    }),
  );

  const currentWeekAverage =
    currentWeekEntries.reduce(
      (acc, entry) => acc + parseFloat(entry.moodScore),
      0,
    ) / (currentWeekEntries.length || 1);

  return (
    <div className="space-y-8">
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <TremorCard>
          <Text>Current Week Average</Text>
          <Metric>{currentWeekAverage.toFixed(1)}</Metric>
          <Flex className="mt-4">
            <Text>{currentWeekEntries.length} entries this week</Text>
          </Flex>
        </TremorCard>
        <TremorCard>
          <Text>Total Entries</Text>
          <Metric>{entries.length}</Metric>
          <Flex className="mt-4">
            <Text>All time</Text>
          </Flex>
        </TremorCard>
        <TremorCard>
          <Text>Average Mood</Text>
          <Metric>
            {(
              entries.reduce(
                (acc, entry) => acc + parseFloat(entry.moodScore),
                0,
              ) / entries.length
            ).toFixed(1)}
          </Metric>
          <Flex className="mt-4">
            <Text>All time</Text>
          </Flex>
        </TremorCard>
      </Grid>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Mood Scores</CardTitle>
            <CardDescription>Your emotional journey day by day</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="mt-4 h-72"
              data={moodData}
              index="date"
              categories={["Mood Score"]}
              colors={["blue"]}
              yAxisWidth={40}
              showAnimation
              showLegend={false}
              showGridLines
              showTooltip
              curveType="natural"
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Averages</CardTitle>
              <CardDescription>
                Your average mood scores by week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                className="mt-4 h-72"
                data={weeklyData}
                index="date"
                categories={["Weekly Average"]}
                colors={["blue"]}
                yAxisWidth={40}
                showAnimation
                showLegend={false}
                showGridLines
                showTooltip
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>Breakdown of your mood scores</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart
                className="mt-4 h-72"
                data={moodDistributionData}
                category="value"
                index="name"
                colors={["emerald", "blue", "amber", "rose"]}
                showAnimation
                showTooltip
                valueFormatter={(v: number) => `${v} entries`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
