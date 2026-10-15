import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs";

export default function Particle() {
  return (
    <Tabs className="items-center" defaultValue="tab-1">
      <div className="border-b">
        <TabsList variant="underline">
          <TabsTab
            className="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]"
            value="tab-1"
          >
            <HouseIcon aria-hidden="true" className="opacity-64" />
            Overview
          </TabsTab>
          <TabsTab
            className="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]"
            value="tab-2"
          >
            <PanelsTopLeftIcon aria-hidden="true" className="opacity-64" />
            Projects
          </TabsTab>
          <TabsTab
            className="h-auto! flex-col gap-1.5 py-[calc(--spacing(2.5)-1px)]"
            value="tab-3"
          >
            <BoxIcon aria-hidden="true" className="opacity-64" />
            Packages
          </TabsTab>
        </TabsList>
      </div>
      <TabsPanel value="tab-1">
        <p className="p-4 text-center text-muted-foreground text-xs">
          Overview content
        </p>
      </TabsPanel>
      <TabsPanel value="tab-2">
        <p className="p-4 text-center text-muted-foreground text-xs">
          Projects content
        </p>
      </TabsPanel>
      <TabsPanel value="tab-3">
        <p className="p-4 text-center text-muted-foreground text-xs">
          Packages content
        </p>
      </TabsPanel>
    </Tabs>
  );
}
