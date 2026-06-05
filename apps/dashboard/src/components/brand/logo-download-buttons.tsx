"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ZYTE_LOGO_RATIO,
  buildZyteLogoSvgString,
  type ZyteLogoFill,
} from "@/lib/zyte-logo-svg";

type LogoDownloadButtonsProps = {
  /** File-name stem, e.g. "ink" → zyte-logo-ink.svg / .png. */
  name: string;
  fill: ZyteLogoFill;
  /** Target PNG width in px (height is derived from the logo ratio). */
  pngWidth?: number;
};

function triggerDownload(href: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

async function downloadPng(svg: string, filename: string, width: number) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to load logo SVG"));
      image.src = url;
    });

    const height = Math.round(width * ZYTE_LOGO_RATIO);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    // Transparent background — brand PNGs ship without a baked-in fill.
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    await new Promise<void>((resolve) => {
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const pngUrl = URL.createObjectURL(pngBlob);
          triggerDownload(pngUrl, filename);
          URL.revokeObjectURL(pngUrl);
        }
        resolve();
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function LogoDownloadButtons({
  name,
  fill,
  pngWidth = 1600,
}: LogoDownloadButtonsProps) {
  const [busy, setBusy] = React.useState(false);
  const svg = React.useMemo(() => buildZyteLogoSvgString(fill), [fill]);

  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={() => downloadSvg(svg, `zyte-logo-${name}.svg`)}
      >
        <Download />
        SVG
      </Button>
      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await downloadPng(svg, `zyte-logo-${name}.png`, pngWidth);
          } finally {
            setBusy(false);
          }
        }}
      >
        <Download />
        PNG
      </Button>
    </div>
  );
}
