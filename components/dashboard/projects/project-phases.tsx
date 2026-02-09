"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreConstructionPhase from "./pre-construction-phase";
import ConstructionPhase from "./construction-phase";
import PostConstructionPhase from "./post-construction-phase";
import ProjectOverviewTab from "./project-overview-tab";
import type { Project } from "@/types/project";

type ProjectPhasesProps = {
  project: Project;
  onProjectUpdated?: (project: Project) => void;
};

type TabValue =
  | "project-overview"
  | "pre-construction"
  | "construction"
  | "post-construction";

export default function ProjectPhases({ project, onProjectUpdated }: ProjectPhasesProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("project-overview");
  const [preconstructionRefreshKey, setPreconstructionRefreshKey] = useState(0);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
  };

  const handleOverviewSaved = () => {
    setPreconstructionRefreshKey((prev) => prev + 1);
  };

  const handleContinueToPreConstruction = () => {
    setActiveTab("pre-construction");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted rounded-lg p-1">
          <TabsTrigger
            value="project-overview"
            className="data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm rounded-md transition-all duration-150"
          >
            Project Overview
          </TabsTrigger>
          <TabsTrigger
            value="pre-construction"
            className="data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm rounded-md transition-all duration-150"
          >
            Pre-Construction
          </TabsTrigger>
          <TabsTrigger
            value="construction"
            className="data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm rounded-md transition-all duration-150"
          >
            Construction
          </TabsTrigger>
          <TabsTrigger
            value="post-construction"
            className="data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-sm rounded-md transition-all duration-150"
          >
            Post-Construction
          </TabsTrigger>
        </TabsList>
        <TabsContent value="project-overview" className="mt-6">
          <ProjectOverviewTab
            project={project}
            onProjectUpdated={onProjectUpdated}
            onContinueToPreConstruction={handleContinueToPreConstruction}
            onSetupSaved={handleOverviewSaved}
          />
        </TabsContent>
        <TabsContent value="pre-construction" className="mt-6">
          <PreConstructionPhase
            project={project}
            onProjectUpdated={onProjectUpdated}
            step2ReadOnly
            refreshKey={preconstructionRefreshKey}
          />
        </TabsContent>
        <TabsContent value="construction" className="mt-6">
          <ConstructionPhase project={project} />
        </TabsContent>
        <TabsContent value="post-construction" className="mt-6">
          <PostConstructionPhase project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
