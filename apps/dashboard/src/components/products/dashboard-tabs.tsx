"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DashboardTabsProps = {
  /** Server-rendered "Getting started" onboarding panel. */
  gettingStarted: React.ReactNode;
  /** Server-rendered "Overview" dashboard panel. */
  overview: React.ReactNode;
};

/**
 * In-page tab shell for the product dashboard. The panels are server-rendered
 * upstream and passed in as nodes, so this client boundary only owns the
 * tab-selection state — the data fetching stays on the server page.
 */
export function DashboardTabs({ gettingStarted, overview }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="getting-started" className="mt-8">
      <TabsList variant="line">
        <TabsTrigger value="getting-started">Getting started</TabsTrigger>
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>
      <TabsContent value="getting-started" className="mt-8">
        {gettingStarted}
      </TabsContent>
      <TabsContent value="overview" className="mt-8">
        {overview}
      </TabsContent>
    </Tabs>
  );
}
