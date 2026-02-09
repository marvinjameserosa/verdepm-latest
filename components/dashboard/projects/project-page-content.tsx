"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectPhases from "./project-phases";
import type { Project } from "@/types/project";
import { mapProjectFromSupabase } from "./project-helpers";
import { supabase } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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

  return (
    <div className="relative z-10">
      <div className="flex flex-col gap-6 p-6">
        <main className="space-y-6">
          <div className="border-b border-border pb-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                {project.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {project.description || "No description provided yet."}
              </p>
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
