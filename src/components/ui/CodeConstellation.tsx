import type { CSSProperties, ReactNode } from "react";

interface Star {
  x: number;
  y: number;
  /** Radius of the star; the hub (index 0) is the largest. */
  r: number;
  /** Where the label sits relative to the star. */
  label: "above" | "below";
}

// Fixed layout inside a 400x380 viewBox. Index 0 is the hub every other star links to.
const STARS: Star[] = [
  { x: 200, y: 185, r: 7, label: "below" },
  { x: 95, y: 105, r: 4.5, label: "above" },
  { x: 230, y: 60, r: 4.5, label: "above" },
  { x: 315, y: 140, r: 4.5, label: "above" },
  { x: 305, y: 255, r: 4.5, label: "below" },
  { x: 205, y: 330, r: 4.5, label: "below" },
  { x: 90, y: 265, r: 4.5, label: "below" },
  { x: 45, y: 185, r: 4.5, label: "above" }
];

// Hub spokes plus an outer ring: reads like a dependency graph and like a constellation.
const EDGES: Array<[number, number]> = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 1]
];

// Unlabelled background stars, purely for atmosphere.
const DUST: Array<[number, number]> = [
  [30, 40], [150, 25], [350, 50], [380, 210], [355, 330], [120, 355], [20, 320], [270, 200], [140, 205], [175, 120]
];

export const CONSTELLATION_SIZE = STARS.length;

/**
 * Decorative star chart: each star is a technology, linked like a dependency graph.
 * Pure SVG; animation is CSS-only and off under prefers-reduced-motion.
 * Children render as a desktop-only caption.
 */
export function CodeConstellation({ stars, children }: { stars: string[]; children?: ReactNode }) {
  const names = stars.slice(0, STARS.length);
  const positioned = names.map((name, i) => ({ name, ...STARS[i] }));

  return (
    <figure className="mx-auto w-full max-w-md lg:max-w-none">
      <svg
        viewBox="0 0 400 380"
        role="img"
        aria-label={`Constellation of core technologies: ${names.join(", ")}`}
        className="constellation w-full"
      >
        {DUST.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1.2}
            className="cstar fill-star"
            style={{ "--d": `${(i * 0.7) % 4}s` } as CSSProperties}
          />
        ))}

        {EDGES.filter(([a, b]) => a < names.length && b < names.length).map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={STARS[a].x}
            y1={STARS[a].y}
            x2={STARS[b].x}
            y2={STARS[b].y}
            className="cedge"
          />
        ))}

        {positioned.map((s, i) => (
          <g key={s.name} className="cnode">
            <circle cx={s.x} cy={s.y} r={s.r * 3.2} className="fill-brand/15" />
            <circle
              cx={s.x}
              cy={s.y}
              r={s.r}
              className="cstar fill-star"
              style={{ "--d": `${i * 0.5}s` } as CSSProperties}
            />
            <text
              x={s.x}
              y={s.label === "above" ? s.y - s.r - 10 : s.y + s.r + 18}
              textAnchor="middle"
              className="fill-fg-muted font-mono text-[13px]"
            >
              {s.name}
            </text>
          </g>
        ))}
      </svg>

      {children && <figcaption className="mt-8 hidden lg:block">{children}</figcaption>}
    </figure>
  );
}
