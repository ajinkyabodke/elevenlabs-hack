import { atomWithStorage } from "jotai/utils";

const sidebarCollapsedKey = "sidebarCollapsed";

export const sidebarCollapsedAtom = atomWithStorage<boolean>(
  sidebarCollapsedKey,
  false,
);
