"use client";

import { usePostConstructionData } from "@/hooks/use-post-construction-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Activity, Zap, Truck, Leaf } from "lucide-react";
import type { Project } from "@/types/project";
import type { LucideIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PostConstructionPhaseProps = {
  project: Project;
};

export default function PostConstructionPhase({
  project,
}: PostConstructionPhaseProps) {
  const { data, isLoading, error } = usePostConstructionData(project.id);

  if (isLoading) {
    return (
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Loading post-construction insights...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gathering construction logs and generating ESG report for{" "}
            {project.name}.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <span className="mt-0.5 shrink-0 h-1.5 w-1.5 rounded-full bg-destructive" />
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { targets, actuals, trends } = data;

  const formatNumber = (value: number, digits = 2) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(
      value
    );

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ComparisonCard
          title="Scope 1 Emissions"
          description="Direct emissions from owned/controlled sources."
          target={targets?.scope_one || null}
          actual={actuals.scope_one}
          unit="tCO2e"
          icon={Truck}
          formatNumber={formatNumber}
        />
        <ComparisonCard
          title="Scope 2 Emissions"
          description="Indirect emissions from purchased electricity."
          target={targets?.scope_two || null}
          actual={actuals.scope_two}
          unit="tCO2e"
          icon={Zap}
          formatNumber={formatNumber}
        />
        <ComparisonCard
          title="Scope 3 Emissions"
          description="All other indirect emissions (waste, water, etc.)."
          target={targets?.scope_three || null}
          actual={actuals.scope_three}
          unit="tCO2e"
          icon={Leaf}
          formatNumber={formatNumber}
        />
        <ComparisonCard
          title="Safety TRIR"
          description="Total Recordable Incident Rate."
          target={targets?.trir || null}
          actual={actuals.trir}
          unit=""
          icon={Activity}
          formatNumber={formatNumber}
        />
      </div>

      {/* Trend chart */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Emissions Trends
          </CardTitle>
          <CardDescription className="text-xs">
            Monthly breakdown of Scope 1, 2, and 3 emissions over the project
            lifecycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="date"
                  className="fill-muted-foreground"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="fill-muted-foreground"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}t`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    color: "var(--card-foreground)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,.05)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="scope_one"
                  name="Scope 1"
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="target_scope_one"
                  name="Target Scope 1"
                  stroke="var(--chart-5)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                  strokeOpacity={0.4}
                />
                <Line
                  type="monotone"
                  dataKey="scope_two"
                  name="Scope 2"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="target_scope_two"
                  name="Target Scope 2"
                  stroke="var(--chart-4)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                  strokeOpacity={0.4}
                />
                <Line
                  type="monotone"
                  dataKey="scope_three"
                  name="Scope 3"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="target_scope_three"
                  name="Target Scope 3"
                  stroke="var(--chart-1)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                  strokeOpacity={0.4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ComparisonCard – extracted as a named component for clarity        */
/* ------------------------------------------------------------------ */

function ComparisonCard({
  title,
  description,
  target,
  actual,
  unit,
  icon: Icon,
  inverse = false,
  formatNumber,
}: {
  title: string;
  description: string;
  target: number | null;
  actual: number;
  unit: string;
  icon: LucideIcon;
  inverse?: boolean;
  formatNumber: (v: number, d?: number) => string;
}) {
  const hasTarget = target !== null && target !== undefined && target > 0;
  const percentage = hasTarget ? (actual / target!) * 100 : 0;
  const isGood = inverse ? actual >= target! : actual <= target!;

  let statusColor = "text-muted-foreground";
  if (hasTarget) {
    if (isGood) {
      statusColor = "text-primary";
    } else {
      const ratio = actual / target!;
      statusColor =
        ratio > 1.1
          ? "text-destructive"
          : "text-amber-600 dark:text-amber-400";
    }
  }

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-[11px] mt-0.5">
            {description}
          </CardDescription>
        </div>
        <div className="p-1.5 rounded-md bg-muted shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Actual
              </p>
              <p className="text-xl font-bold text-foreground">
                {formatNumber(actual)}
                {unit ? (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {unit}
                  </span>
                ) : null}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Target
              </p>
              <p className="text-base font-semibold text-foreground">
                {hasTarget ? formatNumber(target!) : "--"}
                {unit ? (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {unit}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          {hasTarget ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className={statusColor}>
                  {percentage.toFixed(1)}% of target
                </span>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className="h-1.5"
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No target set
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

