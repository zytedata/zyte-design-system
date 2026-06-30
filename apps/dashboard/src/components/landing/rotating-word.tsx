"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_WORDS = ["system", "foundations", "operations", "cooperation"];
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#%&@~";

type Cell = { char: string; scrambling: boolean };

function cellsFor(word: string): Cell[] {
  return word.split("").map((char) => ({ char, scrambling: false }));
}

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export type RotatingWordProps = {
  /** Words to cycle through; the first is rendered on the server. */
  words?: string[];
  /** Milliseconds each word holds before scrambling to the next. */
  intervalMs?: number;
  className?: string;
};

/**
 * Cycles through a list of words, decoding each one with a per-letter scramble
 * (random letters resolving left-to-right into the target). Used in the landing
 * hero headline. Respects `prefers-reduced-motion` (swaps words instantly).
 */
export function RotatingWord({
  words = DEFAULT_WORDS,
  intervalMs = 2600,
  className,
}: RotatingWordProps) {
  const [cells, setCells] = useState<Cell[]>(() => cellsFor(words[0]));
  const [current, setCurrent] = useState(words[0]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let index = 0;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // motion.dev-style scramble: reveal the word left-to-right over a fixed
    // duration while every not-yet-revealed letter keeps flickering through
    // random characters each frame.
    function scramble(to: string) {
      const length = to.length;
      const durationMs = 700;
      let startTime: number | null = null;

      const tick = (now: number) => {
        if (cancelled) return;
        if (startTime === null) startTime = now;
        const t = Math.min((now - startTime) / durationMs, 1);
        // Linear reveal → a steady left-to-right sweep (no easing, so it never
        // looks like it starts mid-word).
        const revealed = Math.floor(t * length);

        const next: Cell[] = [];
        for (let i = 0; i < length; i += 1) {
          if (i < revealed) next.push({ char: to[i], scrambling: false });
          else next.push({ char: randomChar(), scrambling: true });
        }
        setCells(next);

        if (t >= 1) {
          setCells(cellsFor(to));
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    }

    const id = setInterval(() => {
      index = (index + 1) % words.length;
      const to = words[index];
      setCurrent(to);
      if (reduceMotion) {
        setCells(cellsFor(to));
      } else {
        scramble(to);
      }
    }, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [words, intervalMs]);

  return (
    <span className={cn("inline-block", className)}>
      {/* Settled word for assistive tech; the animated cells are decorative. */}
      <span className="sr-only">{current}</span>
      <span aria-hidden="true">
        {cells.map((cell, i) => (
          <span
            key={i}
            className={cn(
              cell.scrambling && "opacity-50",
              // First letter is always capitalized (same font, size and weight).
              i === 0 && "uppercase",
            )}
          >
            {cell.char}
          </span>
        ))}
      </span>
    </span>
  );
}
