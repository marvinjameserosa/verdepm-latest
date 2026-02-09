import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, PlusCircle, Save, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  WasteFormEntry,
  WasteEntrySummary,
  WASTE_TYPE_OPTIONS,
  WASTE_TREATMENT_OPTIONS,
} from "@/types/construction";

interface WasteEmissionsCardProps {
  newEntry: WasteFormEntry;
  onEntryChange: (field: keyof WasteFormEntry, value: string) => void;
  onAddEntry: () => void;
  entries: WasteEntrySummary[];
  onRemoveEntry: (id: string) => void;
  totalAllocatedMassKg: number;
  totalInputMassKg: number;
  totalEmissionsKg: number;
  onSave?: () => void;
  isSaving?: boolean;
  history?: any[];
}

export function WasteEmissionsCard({
  newEntry,
  onEntryChange,
  onAddEntry,
  entries,
  onRemoveEntry,
  totalAllocatedMassKg,
  totalInputMassKg,
  totalEmissionsKg,
  onSave,
  isSaving = false,
  history,
}: WasteEmissionsCardProps) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const percentageTotalsByWasteType = entries.reduce<Record<string, number>>(
    (accumulator, entry) => {
      accumulator[entry.wasteType] =
        (accumulator[entry.wasteType] ?? 0) + entry.percentageValue;
      return accumulator;
    },
    {}
  );

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Waste Management
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-medium border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200"
            >
              Scope 3
            </Badge>
          </div>
          <CardDescription className="mt-1 text-xs">
            Break down monthly waste streams and treatment methods to compute emissions.
          </CardDescription>
        </div>
        <div className="p-1.5 rounded-md bg-muted">
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <Label htmlFor="waste-mass">Total Mass of Waste</Label>
            <div className="flex gap-2">
              <Input
                id="waste-mass"
                type="number"
                min="0"
                value={newEntry.mass}
                onChange={(event) => onEntryChange("mass", event.target.value)}
                placeholder="Enter quantity"
              />
              <Select
                value={newEntry.unit}
                onValueChange={(value) => onEntryChange("unit", value)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="ton">ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Waste Type</Label>
            <Select
              value={newEntry.wasteType}
              onValueChange={(value) => onEntryChange("wasteType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {WASTE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Treatment Method</Label>
            <Select
              value={newEntry.treatmentMethod}
              onValueChange={(value) => onEntryChange("treatmentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {WASTE_TREATMENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="waste-percentage">Treatment Percentage (%)</Label>
            <Input
              id="waste-percentage"
              type="number"
              min="0"
              max="100"
              value={newEntry.treatmentPercentage}
              onChange={(event) =>
                onEntryChange("treatmentPercentage", event.target.value)
              }
              placeholder="e.g. 25"
            />
          </div>
        </div>
        <Button type="button" onClick={onAddEntry} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Waste Entry
        </Button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-md bg-muted/60 border border-border px-3 py-2 text-muted-foreground">
            Total input mass:
            <span className="ml-1 font-semibold text-foreground">
              {totalInputMassKg > 0
                ? `${totalInputMassKg.toFixed(2)} kg`
                : "--"}
            </span>
          </div>
          <div className="rounded-md bg-muted/60 border border-border px-3 py-2 text-muted-foreground">
            Allocated mass (kg):
            <span className="ml-1 font-semibold text-foreground">
              {totalAllocatedMassKg > 0
                ? `${totalAllocatedMassKg.toFixed(2)} kg`
                : "--"}
            </span>
          </div>
          <div className="rounded-md bg-muted/60 border border-border px-3 py-2 text-muted-foreground">
            Total CO₂e emitted:
            <span className="ml-1 font-semibold text-foreground">
              {totalEmissionsKg > 0
                ? `${totalEmissionsKg.toFixed(2)} kg`
                : "--"}
            </span>
          </div>
        </div>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waste Type</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead className="text-right">Emission Factor</TableHead>
                <TableHead className="text-right">Mass</TableHead>
                <TableHead className="text-right">Treatment %</TableHead>
                <TableHead className="text-right">
                  Allocated Mass (kg)
                </TableHead>
                <TableHead className="text-right">CO₂e (kg)</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.wasteType}
                    </TableCell>
                    <TableCell className="capitalize">
                      {entry.treatmentMethod}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.emissionFactor.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(entry.mass).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {entry.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.percentageValue.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.allocatedMassKg.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.emissionKg.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveEntry(entry.id)}
                        aria-label="Remove waste entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No waste entries recorded this month.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {entries.length > 0 ? (
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">
              Ensure treatment allocations for each waste type total 100%:
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {Object.entries(percentageTotalsByWasteType).map(
                ([wasteType, total]) => (
                  <span
                    key={wasteType}
                    className={
                      Math.abs(total - 100) > 0.001
                        ? "text-red-600 dark:text-red-400"
                        : undefined
                    }
                  >
                    {wasteType}: <strong>{total.toFixed(2)}%</strong>
                  </span>
                )
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Allocate each waste type across treatment methods. Percentages per
            type must add up to 100% before submission.
          </p>
        )}
        {onSave && (
          <div className="flex justify-end pt-2">
            <Button onClick={onSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Waste Data"}
            </Button>
          </div>
        )}

        {history && history.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Monthly Waste History
            </h4>
            <div className="overflow-hidden rounded-md border border-border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-muted-foreground">
                      Month
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Total Waste (kg)
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Emissions (kgCO₂e)
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Last Updated
                    </TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((log, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {log.log_month}
                      </TableCell>
                      <TableCell>{log.waste_placeholder ?? "-"}</TableCell>
                      <TableCell>{log.waste_generated_kg ?? "-"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.submitted_on}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        <Dialog
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Waste Log Details</DialogTitle>
              <DialogDescription>
                Detailed view of the selected monthly waste entry.
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
                      Total Waste:
                    </span>
                    <p>{selectedLog.waste_placeholder ?? 0} kg</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Waste Emissions:
                    </span>
                    <p>{selectedLog.waste_generated_kg ?? 0} kgCO₂e</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Scope 3 (Waste + Water):
                    </span>
                    <p>{selectedLog.scope3 ?? 0} kgCO₂e</p>
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
