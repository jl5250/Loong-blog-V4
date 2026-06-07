export type ScrollLevel = "level-0" | "level-1" | "level-2";

export interface ScrollPolicy {
  level: ScrollLevel;
  narrative: boolean;
  allowGlobalWheelCapture: boolean;
  allowLenisLifecycleControl: boolean;
}

export const DEFAULT_SCROLL_POLICY: ScrollPolicy = {
  level: "level-0",
  narrative: false,
  allowGlobalWheelCapture: false,
  allowLenisLifecycleControl: false,
};

export function isNarrativePolicy(policy: ScrollPolicy) {
  return policy.level === "level-2" && policy.narrative;
}
