import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Save, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  unit: string;
  relatedTarget: { goal: string; metric: string };
  value: string;
  onChange: (value: string) => void;
  labelPrefix?: string;
  secondaryLabel?: string;
  secondaryValue?: string | null;
  onSave?: () => void;
  isSaving?: boolean;
  history?: any[];
  metricType?: "electricity" | "water";
  categoryTag?: string;
  categoryClassName?: string;
}

export function MetricCard({
  icon,
  title,
  unit,
  relatedTarget,
  value,
  onChange,
  labelPrefix = "Today's",
  secondaryLabel,
  secondaryValue,
  onSave,
  isSaving = false,
  history,
  metricType,
  categoryTag,
  categoryClassName,
}: MetricCardProps) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              {title}
            </CardTitle>
            {categoryTag ? (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 font-medium",
                  categoryClassName
                )}
              >
                {categoryTag}
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="p-1.5 rounded-md bg-muted">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-xs text-muted-foreground mb-4 px-2.5 py-2 bg-muted/50 rounded-md border border-border">
          <Target className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span>
            Target: <span className="font-medium text-foreground">{relatedTarget.goal}</span>
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor={title}>{`${labelPrefix} ${title} (${unit})`}</Label>
          <Input
            id={title}
            type="number"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={`Enter value in ${unit}`}
          />
        </div>
        {secondaryLabel ? (
          <div className="mt-4 rounded-md bg-muted/60 border border-border px-3 py-2 text-sm text-muted-foreground">
            {secondaryLabel}
            <span className="ml-1 font-semibold text-foreground">{secondaryValue ?? "--"}</span>
          </div>
        ) : null}
        {onSave && (
          <div className="flex justify-end pt-4">
            <Button onClick={onSave} disabled={isSaving} size="sm">
              <Save className="mr-2 h-3 w-3" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}

        {history && history.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Monthly History
            </h4>
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 font-medium text-muted-foreground">
                      Month
                    </th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">
                      Value ({unit})
                    </th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">
                      Last Updated
                    </th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((log, index) => (
                    <tr
                      key={index}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-3 py-2 font-medium">{log.log_month}</td>
                      <td className="px-3 py-2">
                        {metricType === "electricity"
                          ? log.elec_placeholder
                          : metricType === "water"
                          ? log.water_placeholder
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {log.submitted_on}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Dialog
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Metric Details</DialogTitle>
              <DialogDescription>
                Detailed view of the selected monthly entry.
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Month:
                    </span>
                    <p>{selectedLog.log_month}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Submitted On:
                    </span>
                    <p>{selectedLog.submitted_on}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Value ({unit}):
                    </span>
                    <p>
                      {metricType === "electricity"
                        ? selectedLog.elec_placeholder
                        : metricType === "water"
                        ? selectedLog.water_placeholder
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Emissions (kgCO₂e):
                    </span>
                    <p>
                      {metricType === "electricity"
                        ? selectedLog.electricity_usage_kwh
                        : metricType === "water"
                        ? selectedLog.water_consumption_cubic_m
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
