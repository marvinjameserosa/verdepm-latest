"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectPhases from "./project-phases";
import type { Project } from "@/types/project";
import {
  mapProjectFromSupabase,
  projectStatusLabels,
  projectPriorityLabels,
} from "./project-helpers";
import { supabase } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ProjectPageContentProps = {
  initialProject: Project;
};

export default function ProjectPageContent({
  initialProject,
}: ProjectPageContentProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const router = useRouter();

  useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  useEffect(() => {
    const channel = supabase
      .channel(`projects:detail:${initialProject.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "projects",
          filter: `id=eq.${initialProject.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          if (!payload.new) {
            return;
          }

          try {
            const mapped = mapProjectFromSupabase(payload.new);
            setProject(mapped);
          } catch (error) {
            console.error("Failed to map project update", error, payload.new);
            setProject((prev) => ({
              ...prev,
              name: (payload.new as Record<string, unknown>).name as string,
              slug: (payload.new as Record<string, unknown>).slug as string,
              description:
                ((payload.new as Record<string, unknown>).description as
                  | string
                  | null
                  | undefined) ??
                prev.description ??
                null,
              location:
                ((payload.new as Record<string, unknown>).location as
                  | string
                  | null
                  | undefined) ??
                prev.location ??
                null,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialProject.id]);

  useEffect(() => {
    if (project.slug !== initialProject.slug) {
      router.replace(`/dashboard/projects/${project.slug}`);
    }
  }, [initialProject.slug, project.slug, router]);

  const handleProjectUpdated = useCallback((nextProject: Project) => {
    setProject(nextProject);
  }, []);

  const formatDate = (value?: string | null) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusDot: Record<string, string> = {
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

  return (
    <div className="relative z-10">
      <div className="flex flex-col gap-6 p-6">
        <main className="space-y-6">
          {/* Back link */}
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Projects
          </Link>

          {/* Project header */}
          <div className="border-b border-border pb-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
                  {project.name}
                </h1>
                {project.description ? (
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1"
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${statusDot[project.status]}`}
                  />
                  {projectStatusLabels[project.status]}
                </Badge>
                <span
                  className={`text-xs font-medium uppercase tracking-wide ${priorityStyle[project.priority]}`}
                >
                  {projectPriorityLabels[project.priority]}
                </span>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              {project.clientName ? (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {project.clientName}
                </span>
              ) : null}
              {project.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location}
                </span>
              ) : null}
              {(project.startDate || project.endDate) ? (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(project.startDate) ?? "TBD"}
                  {project.endDate ? ` - ${formatDate(project.endDate)}` : ""}
                </span>
              ) : null}
            </div>
          </div>

          <ProjectPhases
            project={project}
            onProjectUpdated={handleProjectUpdated}
          />
        </main>
      </div>
    </div>
  );
}
