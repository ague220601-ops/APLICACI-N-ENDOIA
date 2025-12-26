import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users } from "lucide-react";
import ClinicoView from "@/components/ClinicoView";
import TutorView from "@/components/TutorView";

export default function Home() {
  const [activeView, setActiveView] = useState<"clinico" | "tutor">("clinico");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <img src="/endoia-logo.svg" alt="ENDOIA" className="w-10 h-10" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold" data-testid="text-app-title">
                  ENDOIA
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  AAE–ESE 2025 Classification
                </p>
              </div>
            </div>
            
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "clinico" | "tutor")} className="w-auto">
              <TabsList data-testid="tabs-view-switcher">
                <TabsTrigger value="clinico" data-testid="tab-clinico" className="gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Clínico</span>
                </TabsTrigger>
                <TabsTrigger value="tutor" data-testid="tab-tutor" className="gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Tutor</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === "clinico" ? <ClinicoView /> : <TutorView />}
      </main>
    </div>
  );
}
