"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import {
  type Project,
  type ProjectPriority,
  type ProjectStatus,
} from "@/types/project";
import LocationPicker from "@/components/ui/location-picker";
import { useAddProjectForm } from "@/hooks/useAddProjectForm";
import { ErrorDisplay } from "@/components/ui/error-display";
import { type AddProjectModalProps } from "@/types/components";
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "@/lib/project-options";

export function AddProjectModal({ onProjectCreated }: AddProjectModalProps) {
  const {
    open,
    formState,
    isSubmitting,
    errorMessage,
    isSubmitDisabled,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleOpenChange,
  } = useAddProjectForm(onProjectCreated);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-10 gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] bg-card border border-border shadow-lg p-0 flex flex-col overflow-hidden min-h-0">
        <form onSubmit={handleSubmit} className="flex h-full flex-col min-h-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="text-lg font-semibold text-card-foreground">
              New Project
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill in the details below to create a new construction project.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5">
            <div className="space-y-6">
              {errorMessage && (
                <ErrorDisplay title="Error" message={errorMessage} />
              )}

              {/* Core Details */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Project Details
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Greenwood Tower"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the project..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="clientName">Client / Customer</Label>
                  <Input
                    id="clientName"
                    value={formState.clientName}
                    onChange={handleInputChange}
                    placeholder="Enter client name"
                  />
                </div>
              </div>

              {/* Classification */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Classification
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formState.status}
                      onValueChange={(value: ProjectStatus) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formState.priority}
                      onValueChange={(value: ProjectPriority) =>
                        handleSelectChange("priority", value)
                      }
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formState.category || undefined}
                      onValueChange={(value: string) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
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

              {/* Schedule & Budget */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Schedule & Budget
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formState.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formState.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="budget">Budget (PHP)</Label>
                    <Input
                      id="budget"
                      type="number"
                      inputMode="decimal"
                      value={formState.budget}
                      onChange={handleInputChange}
                      placeholder="500000"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Site Location</Label>
                  <LocationPicker
                    value={formState.location || ""}
                    onChange={(value) => handleSelectChange("location", value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 px-6 py-4 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
