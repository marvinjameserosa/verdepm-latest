"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProjectTargets = {
  id?: string | null;
  scopeOne: string;
  scopeTwo: string;
  scopeThree: string;
  trir: string;
};

type Props = {
  onNext: () => void;
  onBack: () => void;
  projectId?: string | null;
  targets: ProjectTargets | null;
  onSaveTargets: (values: ProjectTargets) => Promise<void>;
  isSaving?: boolean;
  onError?: (message: string) => void;
  onResetFeedback?: () => void;
};

export default function Step2TargetSetting({
  onNext,
  onBack,
  projectId,
  targets,
  onSaveTargets,
  isSaving,
  onError,
  onResetFeedback,
}: Props) {
  const [formState, setFormState] = useState<ProjectTargets>({
    id: targets?.id ?? null,
    scopeOne: targets?.scopeOne ?? "",
    scopeTwo: targets?.scopeTwo ?? "",
    scopeThree: targets?.scopeThree ?? "",
    trir: targets?.trir ?? "",
  });
  const inputRefs = useRef<Record<keyof ProjectTargets, HTMLInputElement | null>>({
    id: null,
    scopeOne: null,
    scopeTwo: null,
    scopeThree: null,
    trir: null,
  });
  const [activeField, setActiveField] = useState<keyof ProjectTargets | null>(null);

  useEffect(() => {
    if (targets) {
      setFormState({
        id: targets.id ?? null,
        scopeOne: targets.scopeOne ?? "",
        scopeTwo: targets.scopeTwo ?? "",
        scopeThree: targets.scopeThree ?? "",
        trir: targets.trir ?? "",
      });
    }
  }, [targets]);

  useEffect(() => {
    if (!activeField || activeField === "id") {
      return;
    }
    const element = inputRefs.current[activeField];
    if (element && document.activeElement !== element) {
      element.focus({ preventScroll: true });
      const length = element.value.length;
      element.setSelectionRange(length, length);
    }
  }, [
    activeField,
    formState.scopeOne,
    formState.scopeTwo,
    formState.scopeThree,
    formState.trir,
  ]);

  const ensureProjectAvailable = () => {
    if (!projectId) {
      onError?.("Save the project setup before defining ESG targets.");
      return false;
    }
    return true;
  };

  const isValidNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) && numeric >= 0;
  };

  const handleSave = async () => {
    onResetFeedback?.();
    if (!ensureProjectAvailable()) {
      return;
    }

    // Validate all fields
    if (
      !formState.scopeOne.trim() ||
      !formState.scopeTwo.trim() ||
      !formState.scopeThree.trim() ||
      !formState.trir.trim()
    ) {
      onError?.("Please fill in all target values before saving.");
      return;
    }

    if (!isValidNumber(formState.scopeOne)) {
      onError?.("Scope 1 target must be a valid number.");
      return;
    }

    if (!isValidNumber(formState.scopeTwo)) {
      onError?.("Scope 2 target must be a valid number.");
      return;
    }

    if (!isValidNumber(formState.scopeThree)) {
      onError?.("Scope 3 target must be a valid number.");
      return;
    }

    if (!isValidNumber(formState.trir)) {
      onError?.("TRIR target must be a valid number.");
      return;
    }

    await onSaveTargets({
      id: formState.id,
      scopeOne: formState.scopeOne.trim(),
      scopeTwo: formState.scopeTwo.trim(),
      scopeThree: formState.scopeThree.trim(),
      trir: formState.trir.trim(),
    });
  };

  const TargetField = ({
    title,
    description,
    explanation,
    unit,
    value,
    onChange,
    placeholder,
    inputRef,
    onFieldFocus,
    onFieldBlur,
  }: {
    title: string;
    description: string;
    explanation: string;
    unit: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    inputRef?: (node: HTMLInputElement | null) => void;
    onFieldFocus?: () => void;
    onFieldBlur?: () => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label className="text-sm font-medium text-foreground">{title}</Label>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full p-1 hover:bg-muted cursor-help">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">{explanation}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(event) => {
          event.target.select();
          onFieldFocus?.();
        }}
        onBlur={() => {
          onFieldBlur?.();
        }}
        ref={inputRef}
      />
      <p className="text-[11px] text-muted-foreground">Unit: {unit}</p>
    </div>
  );

  const hasAnyTarget =
    formState.scopeOne.trim() ||
    formState.scopeTwo.trim() ||
    formState.scopeThree.trim() ||
    formState.trir.trim();

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* Emissions Targets */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">CO2 Emission Targets</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set targets for the project lifecycle. All values in tCO2e.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <TargetField
              title="Scope 1"
              description="Direct emissions from logistics and equipment"
              explanation="Scope 1 includes direct greenhouse gas emissions from sources owned or controlled by the organization, such as fuel combustion from construction vehicles and equipment."
              unit="tCO2e"
              placeholder="e.g., 150"
              value={formState.scopeOne}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, scopeOne: val }))
              }
              inputRef={(node) => {
                inputRefs.current.scopeOne = node;
              }}
              onFieldFocus={() => setActiveField("scopeOne")}
              onFieldBlur={() => setActiveField(null)}
            />

            <TargetField
              title="Scope 2"
              description="Indirect emissions from electricity usage"
              explanation="Scope 2 covers indirect greenhouse gas emissions from the consumption of purchased electricity, heat, or steam used in construction activities."
              unit="tCO2e"
              placeholder="e.g., 75"
              value={formState.scopeTwo}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, scopeTwo: val }))
              }
              inputRef={(node) => {
                inputRefs.current.scopeTwo = node;
              }}
              onFieldFocus={() => setActiveField("scopeTwo")}
              onFieldBlur={() => setActiveField(null)}
            />

            <TargetField
              title="Scope 3"
              description="Waste and water indirect emissions"
              explanation="Scope 3 encompasses all other indirect emissions in the value chain, including waste disposal and water consumption related to construction operations."
              unit="tCO2e"
              placeholder="e.g., 50"
              value={formState.scopeThree}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, scopeThree: val }))
              }
              inputRef={(node) => {
                inputRefs.current.scopeThree = node;
              }}
              onFieldFocus={() => setActiveField("scopeThree")}
              onFieldBlur={() => setActiveField(null)}
            />
          </div>
        </div>

        {/* Safety Target */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">Safety Target</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Workplace incident tracking metric</p>
          </div>
          <div className="max-w-sm">
            <TargetField
              title="TRIR"
              description="Total Recordable Incident Rate"
              explanation="TRIR measures the number of recordable workplace injuries and illnesses per 200,000 hours worked. A lower TRIR indicates better safety performance on the construction site."
              unit="incidents per 200,000 hours"
              placeholder="e.g., 2.5"
              value={formState.trir}
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, trir: val }))
              }
              inputRef={(node) => {
                inputRefs.current.trir = node;
              }}
              onFieldFocus={() => setActiveField("trir")}
              onFieldBlur={() => setActiveField(null)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-muted-foreground">
            {hasAnyTarget
              ? "Save your targets before moving forward."
              : "Define at least one target to continue."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!projectId || isSaving}
            >
              {isSaving ? "Saving..." : "Save Targets"}
            </Button>
            <Button onClick={onNext}>Next</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
