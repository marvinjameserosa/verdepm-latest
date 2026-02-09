"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { type Material } from "./types";
import { type ProjectTargets } from "@/types/preconstruction";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


type Props = {
  onBack: () => void;
  onSubmitApproval?: () => Promise<void> | void;
  isSubmitting?: boolean;
  materials: Material[];
  targets: ProjectTargets | null;
  projectId?: string | null;
};

const numberFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export default function Step4ReviewPlans({
  onBack,
  onSubmitApproval,
  isSubmitting,
  materials,
  targets,
  projectId,
}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const formatCost = (value: string) => {
    if (!value) {
      return "-";
    }
    const numericValue =Number(value);
    if (Number.isNaN(numericValue)) {
      return value;
    }
    return numberFormatter.format(numericValue);
  };

  const ReviewItem = ({
    title,
    children,
    status = "complete",
  }: {
    title: string;
    children: React.ReactNode;
    status?: "complete" | "empty";
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {status === "complete" ? (
          <CheckCircle2 className="h-4 w-4 text-foreground" />
        ) : (
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="text-sm border border-border rounded-md p-3 bg-muted/30">{children}</div>
    </div>
  );

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* ESG Targets Review */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">ESG Targets Summary</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Review targets before submission</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ReviewItem
              title="Scope 1"
              status={targets?.scopeOne ? "complete" : "empty"}
            >
              {targets?.scopeOne ? (
                <div>
                  <span className="font-semibold text-lg text-foreground">
                    {targets.scopeOne}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">tCO2e</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Direct emissions from logistics & equipment
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-xs">No target set</p>
              )}
            </ReviewItem>

            <ReviewItem
              title="Scope 2"
              status={targets?.scopeTwo ? "complete" : "empty"}
            >
              {targets?.scopeTwo ? (
                <div>
                  <span className="font-semibold text-lg text-foreground">
                    {targets.scopeTwo}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">tCO2e</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Indirect emissions from electricity
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-xs">No target set</p>
              )}
            </ReviewItem>

            <ReviewItem
              title="Scope 3"
              status={targets?.scopeThree ? "complete" : "empty"}
            >
              {targets?.scopeThree ? (
                <div>
                  <span className="font-semibold text-lg text-foreground">
                    {targets.scopeThree}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">tCO2e</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Waste and water indirect emissions
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-xs">No target set</p>
              )}
            </ReviewItem>

            <ReviewItem
              title="TRIR"
              status={targets?.trir ? "complete" : "empty"}
            >
              {targets?.trir ? (
                <div>
                  <span className="font-semibold text-lg text-foreground">
                    {targets.trir}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Incidents per 200,000 hours
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-xs">No target set</p>
              )}
            </ReviewItem>
          </div>
        </div>

        {/* Material Sourcing Plan */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">Material Sourcing Plan</h3>
            <p className="text-xs text-muted-foreground mt-0.5">All sourced materials and supplier details</p>
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Details</TableHead>
                  <TableHead>Sustainability & Compliance</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Estimated Cost per Unit</TableHead>
                  <TableHead>Delivery Status</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground h-24"
                    >
                      No materials added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((mat) => (
                    <TableRow key={mat.id}>
                      <TableCell>
                        <div className="font-medium">{mat.name}</div>
                        <div className="text-xs text-muted-foreground mb-0.5">
                          {mat.category}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {mat.credentials && (
                            <div className="flex flex-wrap gap-1">
                              {mat.credentials
                                .split(";")
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .map((c) => (
                                  <Badge
                                    key={c}
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-5 font-normal"
                                  >
                                    {c}
                                  </Badge>
                                ))}
                            </div>
                          )}
                          {mat.specSheetUrl && (
                            <a
                              href={mat.specSheetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View Spec Sheet
                            </a>
                          )}
                          {!mat.credentials && !mat.specSheetUrl && (
                            <span className="text-xs text-muted-foreground italic">
                              None
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{mat.supplier}</div>
                        {mat.warehouse && (
                          <div className="text-xs text-muted-foreground">
                            {mat.warehouse}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCost(mat.cost)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per {mat.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {mat.deliveryStatus ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            mat.status === "Vetted"
                              ? "default"
                              : mat.status === "Denied"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {mat.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-muted-foreground">
            Need feedback? Share this summary before you submit.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Previous
            </Button>
            <Button
              type="button"
              onClick={() => {
                setApprovalError(null);
                setIsConfirmOpen(true);
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setApprovalError(null);
          }
          setIsConfirmOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Submit for approval?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              This will notify approvers that the pre-construction plan is ready
              for review. Make sure targets, materials, and compliance documents
              are complete.
            </p>
            {approvalError ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-2 text-red-700">
                {approvalError}
              </p>
            ) : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!onSubmitApproval) {
                  setIsConfirmOpen(false);
                  return;
                }

                setApprovalError(null);
                try {
                  await onSubmitApproval();
                  setIsConfirmOpen(false);
                  setIsSuccessOpen(true);
                } catch (error) {
                  console.error("Failed to submit for approval", error);
                  setApprovalError(
                    error instanceof Error
                      ? error.message
                      : "Unable to submit for approval."
                  );
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>
              Pre-construction plan submitted
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Approvers have been notified. You can continue refining details
            while the review is underway.
          </p>
          <DialogFooter>
            <Button onClick={() => setIsSuccessOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
