export const FORBIDDEN_SCROLL_PATTERNS = [
  'window.addEventListener("wheel", ..., { capture: true }) on ordinary pages',
  "component-owned lenis.stop()/lenis.start() control",
  "consuming wheel input after local container can no longer scroll",
  "using GSAP tweening to replace ordinary page scroll ownership",
] as const;
