/**
 * Single source of truth for the Zyte wordmark geometry. Both the React
 * `ZyteLogo` component and the brand download buttons (SVG/PNG export) read
 * from here so the rendered logo and the downloadable files never drift.
 */
export const ZYTE_LOGO_WIDTH = 972;
export const ZYTE_LOGO_HEIGHT = 420;
export const ZYTE_LOGO_VIEWBOX = `0 0 ${ZYTE_LOGO_WIDTH} ${ZYTE_LOGO_HEIGHT}`;
export const ZYTE_LOGO_RATIO = ZYTE_LOGO_HEIGHT / ZYTE_LOGO_WIDTH;

export type ZyteLogoPath = {
  d: string;
  /** Letters with counters (the "e") need even-odd fill to punch holes. */
  evenOdd?: boolean;
};

export const ZYTE_LOGO_PATHS: ZyteLogoPath[] = [
  {
    d: "M572.476 0V69.468H523.199V125.685H572.476V231.21C572.476 296.961 610.63 331.968 667.882 331.968C677.41 331.968 690.673 330.897 699.677 328.776V274.155C693.842 275.751 686.959 276.276 680.6 276.276C651.973 276.276 631.848 263.025 631.848 230.139V125.685H699.677V69.468H631.848V0H572.476Z",
  },
  {
    evenOdd: true,
    d: "M845.345 64.155C915.294 64.155 972 117.726 972 193.557C972 200.445 971.454 213.717 970.405 218.484H771.661C779.09 256.683 805.575 280.539 847.444 280.539C879.26 280.539 904.171 265.692 909.459 243.411H968.81C959.282 298.032 909.984 334.089 846.394 334.089C770.611 334.089 711.786 273.105 711.786 197.799C711.786 122.493 770.611 64.155 845.345 64.155ZM842.155 117.726C807.17 117.726 781.735 136.29 773.256 168.105H907.864C902.576 138.411 877.14 117.726 842.155 117.726Z",
  },
  {
    d: "M308.127 69.468L377.551 246.057L446.975 69.468H510.565L364.309 420H300.698L347.351 315L244.537 69.468H308.127Z",
  },
  {
    d: "M159.058 126.21H0V69.468H231.589V126.21L72.0896 272.055H231.589V328.797H0V272.055L159.058 126.21Z",
  },
];

export type ZyteLogoFill =
  | { type: "solid"; color: string }
  | { type: "gradient"; from: string; to: string };

/**
 * Serialise the wordmark to a standalone, self-contained SVG string suitable
 * for download or for rasterising to PNG via a canvas.
 */
export function buildZyteLogoSvgString(fill: ZyteLogoFill): string {
  const gradientId = "zyteLogoGradient";
  const fillValue = fill.type === "gradient" ? `url(#${gradientId})` : fill.color;

  const defs =
    fill.type === "gradient"
      ? `<defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="0">` +
        `<stop offset="0%" stop-color="${fill.from}"/>` +
        `<stop offset="100%" stop-color="${fill.to}"/>` +
        `</linearGradient></defs>`
      : "";

  const paths = ZYTE_LOGO_PATHS.map((path) => {
    const rules = path.evenOdd ? ` fill-rule="evenodd" clip-rule="evenodd"` : "";
    return `<path d="${path.d}"${rules} fill="${fillValue}"/>`;
  }).join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ZYTE_LOGO_VIEWBOX}" ` +
    `width="${ZYTE_LOGO_WIDTH}" height="${ZYTE_LOGO_HEIGHT}" fill="none">${defs}${paths}</svg>`
  );
}
