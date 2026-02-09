"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload } from "lucide-react";
import LocationPicker from "@/components/ui/location-picker";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useProjectSetupForm } from "@/hooks/useProjectSetupForm";
import type { Step1ProjectSetupProps } from "@/types/components";
import type { ProjectStatus, ProjectPriority } from "@/types/project";
import { useSession } from "@/components/auth/SessionProvider";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "@/lib/project-options";

import { verifyProjectFile } from "@/actions/preconstruction/storage";
import { useState } from "react";

export default function Step1ProjectSetup({
  onSubmit,
  onSave,
  initialValues,
  isSubmitting,
  insightsContent,
}: Step1ProjectSetupProps) {
  const [verifyingFile, setVerifyingFile] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isReplacingFile, setIsReplacingFile] = useState(false);

  const handleViewFile = async (path: string) => {
    setVerifyingFile(path);
    setFileError(null);
    try {
      const { exists, url, error } = await verifyProjectFile(path);
      if (exists && url) {
        window.open(url, "_blank");
      } else {
        setFileError(error || "File not found in storage.");
      }
    } catch (e) {
      console.error(e);
      setFileError("Failed to verify file.");
    } finally {
      setVerifyingFile(null);
    }
  };

  const {
    isLoading: isSessionLoading,
    error: sessionError,
    user,
  } = useSession();
  const {
    projectName,
    setProjectName,
    projectAddress,
    setProjectAddress,
    projectDescription,
    setProjectDescription,
    status,
    setStatus,
    priority,
    setPriority,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clientName,
    setClientName,
    category,
    setCategory,
    budget,
    setBudget,
    files,
    documentPaths,
    registerFile,
    error,
    handleSubmit,
    handleSave,
  } = useProjectSetupForm({
    onSubmit,
    onSave,
    initialValues,
    user,
  });

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sessionError) {
    return (
      <ErrorDisplay
        title={sessionError.title}
        message={sessionError.message}
        className="mt-4"
      />
    );
  }

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <ErrorDisplay
            title={error.title}
            message={error.message}
            className="mb-2"
          />
        )}

        {/* Project Information */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">Project Information</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Required fields</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g., Greenwood Tower"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectAddress">Project Address</Label>
              <LocationPicker
                value={projectAddress}
                onChange={setProjectAddress}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="projectDescription">
                Project Description
              </Label>
              <Textarea
                id="projectDescription"
                placeholder="Describe the project's vision and scope."
                className="min-h-[120px]"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Team & Timeline */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">Team & Timeline</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ownership, schedule, client</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client / Customer</Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Target End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget</Label>
              <Input
                id="budget"
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="e.g., 500000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to keep the current budget value.
              </p>
            </div>
          </div>
        </div>

        {/* Project Attributes */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">Project Attributes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Status, priority, category</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status">Current Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as ProjectStatus)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="z-[60] max-h-60">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as ProjectPriority)
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="z-[60] max-h-60">
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category || undefined}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-[60] max-h-60">
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Compliance Documents */}
        <div className="space-y-5">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">Compliance Documents</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Upload building permit for reference</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="buildingPermit">Building Permit</Label>
            {documentPaths["building-permit"] &&
            !isReplacingFile &&
            !files["building-permit"] ? (
              <div className="rounded-md border border-border bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-card rounded-md border border-border">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        Document on file
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {documentPaths["building-permit"]
                          ?.split("/")
                          .pop()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleViewFile(
                          documentPaths["building-permit"]!
                        )
                      }
                      disabled={
                        verifyingFile ===
                        documentPaths["building-permit"]
                      }
                    >
                      {verifyingFile ===
                      documentPaths["building-permit"] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : null}
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsReplacingFile(true)}
                    >
                      Replace
                    </Button>
                  </div>
                </div>
                {fileError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 px-1">
                    {fileError}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <label
                  htmlFor="buildingPermit"
                  className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-muted/80">
                      <Upload className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col gap-1 text-left">
                      <span className="leading-none">Choose File</span>
                      <span className="text-xs text-muted-foreground">
                        PDF only · Max 10 MB
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition group-hover:bg-muted/80">
                    Browse
                  </span>
                </label>
                <Input
                  id="buildingPermit"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(event) =>
                    registerFile(
                      "building-permit",
                      event.target.files?.[0] ?? null
                    )
                  }
                />
                {files["building-permit"] ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                      <span
                        className="truncate"
                        title={files["building-permit"]?.name}
                      >
                        {files["building-permit"]?.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-card px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground border border-border"
                      onClick={() =>
                        registerFile("building-permit", null)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <p>Accepted format: PDF.</p>
                    {documentPaths["building-permit"] && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setIsReplacingFile(false);
                          registerFile("building-permit", null);
                        }}
                      >
                        Cancel replacement
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Performance Insights */}
        {insightsContent ? (
          <div className="space-y-5">
            <div className="border-b border-border pb-2">
              <h3 className="text-sm font-semibold text-foreground">Performance Insights</h3>
              <p className="text-xs text-muted-foreground mt-0.5">AI-driven ESG analysis</p>
            </div>
            {insightsContent}
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p>You can revisit this step anytime -- details stay saved.</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleSave}
              className="w-full sm:w-auto"
            >
              Save progress
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
