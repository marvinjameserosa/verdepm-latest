import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import {
  projectPriorityLabels,
  projectStatusLabels,
} from "./project-helpers";
import { DeleteProjectButton } from "./delete-project-button";

type ProjectCardProps = {
  project: Project;
  onRefresh?: () => Promise<void>;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTimeline = (project: Project) => {
  if (!project.startDate && !project.endDate) {
    return "No timeline set";
  }

  const startDisplay = formatDate(project.startDate) ?? "TBD";
  const endDisplay = project.endDate
    ? formatDate(project.endDate) ?? "TBD"
    : null;

  return endDisplay ? `${startDisplay} - ${endDisplay}` : startDisplay;
};

const formatBudget = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return "No budget";
  }

  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  return `PHP ${numericValue.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
};

const statusDotColor: Record<string, string> = {
  planning: "bg-gray-400",
  "in-progress": "bg-primary",
  "on-hold": "bg-amber-500",
  completed: "bg-blue-500",
};

const priorityStyle: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-red-600 dark:text-red-400",
};

export function ProjectCard({ project, onRefresh }: ProjectCardProps) {
  return (
    <div className="group relative h-full">
      <Link
        href={`/dashboard/projects/${project.slug}`}
        className="block h-full"
      >
        <Card className="h-full bg-card border border-border overflow-hidden transition-shadow duration-200 hover:shadow-lg">
          {/* Cover Photo */}
          <div className="relative h-36 w-full overflow-hidden bg-muted">
            <Image
              src="/images/project-cover-default.jpg"
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Status badge on photo */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="bg-card/90 text-card-foreground backdrop-blur-sm border-0 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5"
              >
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    statusDotColor[project.status]
                  )}
                />
                {projectStatusLabels[project.status]}
              </Badge>
            </div>

            {/* Arrow icon */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-7 w-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center">
                <ArrowUpRight className="h-3.5 w-3.5 text-card-foreground" />
              </div>
            </div>
          </div>

          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="text-base font-semibold text-card-foreground truncate">
                  {project.name}
                </CardTitle>
                {project.clientName ? (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {project.clientName}
                  </p>
                ) : null}
              </div>
              {project.priority ? (
                <span
                  className={cn(
                    "text-[11px] font-medium uppercase tracking-wide shrink-0 pt-0.5",
                    priorityStyle[project.priority]
                  )}
                >
                  {projectPriorityLabels[project.priority]}
                </span>
              ) : null}
            </div>
            {project.description ? (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            ) : null}
          </CardHeader>

          <CardContent className="px-5 pb-4 pt-0">
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{formatTimeline(project)}</span>
              </div>
              {project.location ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>
              ) : null}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{formatBudget(project.budget)}</span>
              </div>
            </div>

            {/* Category tag */}
            {project.category ? (
              <div className="mt-3">
                <span className="inline-block text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {project.category}
                </span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </Link>
      <DeleteProjectButton
        projectId={project.id}
        projectName={project.name}
        onDelete={onRefresh}
      />
    </div>
  );
}
