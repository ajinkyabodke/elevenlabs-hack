import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { activeToolAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { BehavioralQuest } from "./tools/BehavioralQuest";
import { BreathingExercise } from "./tools/BreathingExercise";
import { GroundingExplorer } from "./tools/GroundingExplorer";
import { PMRJourney } from "./tools/PMRJourney";

const TOOL_CONFIG = {
  pmr: {
    title: "Progressive Muscle Relaxation",
    description: "A guided journey to relax your entire body",
    component: PMRJourney,
  },
  breathing: {
    title: "Breathing Exercise",
    description: "Guided breathing to help you calm down",
    component: BreathingExercise,
  },
  grounding: {
    title: "Grounding Exercise",
    description: "Stay present with this grounding technique",
    component: GroundingExplorer,
  },
  behavioral: {
    title: "Behavioral Activation",
    description: "Activities to improve your mood",
    component: BehavioralQuest,
  },
} as const;

export function ToolDialog() {
  const [activeTool, setActiveTool] = useAtom(activeToolAtom);

  if (!activeTool) return null;

  const config = TOOL_CONFIG[activeTool];
  const ToolComponent = config.component;

  return (
    <Dialog open={!!activeTool} onOpenChange={() => setActiveTool(null)}>
      <DialogContent className="max-h-[100vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{config.title}</DialogTitle>
        </DialogHeader>
        <div>
          <ToolComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
