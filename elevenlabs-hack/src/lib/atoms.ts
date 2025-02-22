import { atomWithStorage } from "jotai/utils";

const toolTypes = ["pmr", "behavioral", "grounding", "breathing"] as const;
type ToolType = (typeof toolTypes)[number] | null;

export const activeToolAtom = atomWithStorage<ToolType>("activeTool", null);
