import type { CSSProperties, ReactNode } from "react";

interface Body {
  name: string;
  /** Orbit diameter as % of the component width. */
  orbit: number;
  /** Planet diameter in container-width units (cqw). */
  size: number;
  /** Seconds per revolution (compressed, not to scale). */
  period: number;
  color: string;
  /** Starting angle in degrees so planets aren't lined up. */
  angle: number;
  moon?: boolean;
}

// Inner solar system + Jupiter. Distances and periods are artistic, not to scale.
const bodies: Body[] = [
  { name: "Mercury", orbit: 26, size: 1.7, period: 9, color: "#a8a29e", angle: 40 },
  { name: "Venus", orbit: 40, size: 2.7, period: 15, color: "#fbbf24", angle: 200 },
  { name: "Earth", orbit: 55, size: 3, period: 22, color: "#38bdf8", angle: 120, moon: true },
  { name: "Mars", orbit: 70, size: 2.3, period: 33, color: "#f87171", angle: 300 },
  {
    name: "Jupiter",
    orbit: 96,
    size: 6.2,
    period: 60,
    color: "linear-gradient(180deg,#e7c9a0 0 30%,#c08a5c 30% 52%,#e7c9a0 52% 70%,#a8714a 70%)",
    angle: 250
  }
];

function orbitStyle(size: number, period: number, angle: number): CSSProperties {
  return {
    "--size": `${size}%`,
    "--period": `${period}s`,
    // Negative delay starts the animation part-way round; --rot is the reduced-motion fallback.
    "--delay": `${-(angle / 360) * period}s`,
    "--rot": `${angle}deg`
  } as CSSProperties;
}

/**
 * CSS-only orrery (server component). Hover pauses the orbits; static under reduced motion.
 * Children render as a desktop-only caption.
 */
export function Orrery({ children }: { children?: ReactNode }) {
  return (
    <figure className="mx-auto w-full max-w-md lg:max-w-none">
      <div
        role="img"
        aria-label="Animated, not-to-scale model of the inner solar system and Jupiter orbiting the Sun"
        className="orrery relative aspect-square w-full"
      >
        <div className="sun" />
        {/* Asteroid belt between Mars and Jupiter */}
        <div
          className="orbit orbit-belt"
          style={orbitStyle(83, 120, 0)}
        />
        {bodies.map((b) => (
          <div key={b.name} className="orbit" style={orbitStyle(b.orbit, b.period, b.angle)}>
            <span
              className="planet"
              style={{ "--p": b.size, background: b.color } as CSSProperties}
            >
              {b.moon && (
                <span className="orbit" style={orbitStyle(280, 3, 0)}>
                  <span
                    className="planet"
                    style={{ "--p": 0.9, background: "#d4d4d8" } as CSSProperties}
                  />
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {children && (
        <figcaption className="mt-8 hidden lg:block">{children}</figcaption>
      )}
    </figure>
  );
}
