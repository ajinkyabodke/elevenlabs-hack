import { atom } from "jotai";

const toolTypes = ["pmr", "behavioral", "grounding", "breathing"] as const;
export type ToolType = (typeof toolTypes)[number] | null;

export const activeToolAtom = atom<ToolType | null>(null);
