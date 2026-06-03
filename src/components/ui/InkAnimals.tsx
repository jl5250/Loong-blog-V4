/**
 * Ink-wash bamboo SVG — footer decoration
 * Renders only the SVG. Positioning handled by parent.
 */
export function InkAnimals() {
  return (
    <svg viewBox="0 0 600 150" fill="none" className="w-[600px] max-md:w-[280px] h-auto" style={{ color: "var(--text-body)" }}>
      {/* Bamboo left */}
      <path d="M140 145 L148 20 L152 45 L156 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.13" />
      <path d="M132 35 Q148 26 162 37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.1" />
      <path d="M136 70 Q150 62 164 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.1" />
      <path d="M134 105 Q148 96 160 107" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.08" />
      {/* Bamboo center */}
      <path d="M300 145 L306 30 L310 56 L314 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.15" />
      <path d="M292 48 Q306 38 322 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.12" />
      <path d="M294 82 Q308 72 324 84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.1" />
      <path d="M296 118 Q310 110 322 120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.09" />
      {/* Bamboo right */}
      <path d="M460 145 L466 40 L470 64 L474 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.12" />
      <path d="M454 52 Q466 44 478 54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.09" />
      <path d="M456 90 Q468 82 478 92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.08" />
      {/* Sprouts */}
      <path d="M530 145 L533 118 L536 135 L539 112" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.07" />
      <path d="M80 145 L84 125 L88 140 L92 118" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.07" />
      {/* Crescent moon */}
      <path d="M540 38 Q555 25 565 38 Q555 30 540 38Z" fill="currentColor" opacity="0.08" />
    </svg>
  );
}
