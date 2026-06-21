"use client";

import { useId } from "react";

import {
  ZYTE_LOGO_PATHS,
  ZYTE_LOGO_VIEWBOX,
} from "@/lib/zyte-logo-svg";

type ZyteLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  /**
   * Optional gradient fill. When set, the wordmark is rendered with a
   * horizontal linear gradient from `from` → `to`. When omitted, the logo
   * uses `currentColor` (default behavior).
   */
  gradient?: { from: string; to: string };
};

export function ZyteLogo({
  className,
  width = 64,
  height = 28,
  gradient,
}: ZyteLogoProps) {
  const reactId = useId();
  const gradientId = `zyte-logo-gradient-${reactId}`;
  const fill = gradient ? `url(#${gradientId})` : "currentColor";

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={ZYTE_LOGO_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {gradient ? (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor={gradient.from} />
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>
        </defs>
      ) : null}
      {ZYTE_LOGO_PATHS.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill={fill}
          fillRule={path.evenOdd ? "evenodd" : undefined}
          clipRule={path.evenOdd ? "evenodd" : undefined}
        />
      ))}
    </svg>
  );
}
