figma.showUI(__html__, { width: 400, height: 560, title: 'Design System Variables' });

// ─── DATA ───────────────────────────────────────────────────────────────────

const COLORS = {
  primary: {50:'#fdf2f6',100:'#f7ccdf',200:'#e9669f',300:'#ff7ab4',400:'#e2337e',500:'#db005f',600:'#b5004f',700:'#7b0036',800:'#7a0035',900:'#3f0d23',950:'#260815'},
  accentPrimary: {50:'#f4f5fa',100:'#eeeff3',200:'#dde0f3',300:'#c8dfe7',500:'#8b95ee',600:'#3f4fed',700:'#181e5a',800:'#131746',900:'#0d0e2c'},
  accentSecondary: {100:'#f9dad9',200:'#f9c2c0',300:'#f97d78',500:'#f9433b',600:'#de271f',700:'#bd2c26',800:'#801813'},
  accentSecondaryPurple: {50:'#f5defa',100:'#e2afee',200:'#dc64f7',500:'#b02cce',600:'#68137a',700:'#460d52',800:'#360a40'},
  slate:   {50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a',950:'#020617'},
  gray:    {50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827',950:'#030712'},
  zinc:    {50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b',950:'#09090b'},
  neutral: {50:'#fafafa',100:'#f5f5f5',200:'#e5e5e5',300:'#d4d4d4',400:'#a3a3a3',500:'#737373',600:'#525252',700:'#404040',800:'#262626',900:'#171717',950:'#0a0a0a'},
  stone:   {50:'#fafaf9',100:'#f5f5f4',200:'#e7e5e4',300:'#d6d3d1',400:'#a8a29e',500:'#78716c',600:'#57534e',700:'#44403c',800:'#292524',900:'#1c1917',950:'#0c0a09'},
  red:     {50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d',950:'#450a0a'},
  orange:  {50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12',950:'#431407'},
  amber:   {50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f',950:'#451a03'},
  yellow:  {50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12',950:'#422006'},
  lime:    {50:'#f7fee7',100:'#ecfccb',200:'#d9f99d',300:'#bef264',400:'#a3e635',500:'#84cc16',600:'#65a30d',700:'#4d7c0f',800:'#3f6212',900:'#365314',950:'#1a2e05'},
  green:   {50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d',950:'#052e16'},
  emerald: {50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22'},
  teal:    {50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a',950:'#042f2e'},
  cyan:    {50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63',950:'#083344'},
  sky:     {50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e',950:'#082f49'},
  blue:    {50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a',950:'#172554'},
  indigo:  {50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81',950:'#1e1b4b'},
  violet:  {50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95',950:'#2e1065'},
  purple:  {50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87',950:'#3b0764'},
  fuchsia: {50:'#fdf4ff',100:'#fae8ff',200:'#f5d0fe',300:'#f0abfc',400:'#e879f9',500:'#d946ef',600:'#c026d3',700:'#a21caf',800:'#86198f',900:'#701a75',950:'#4a044e'},
  pink:    {50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843',950:'#500724'},
  rose:    {50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337',950:'#4c0519'},
};

const SHADES = [50,100,200,300,400,500,600,700,800,900,950];
const TAILWIND_SPEC = {
  Layout: [
    'aspect-ratio', 'columns', 'break-after', 'break-before', 'break-inside',
    'box-decoration-break', 'box-sizing', 'display', 'float', 'clear', 'isolation',
    'object-fit', 'object-position', 'overflow', 'overscroll-behavior', 'position',
    'inset', 'visibility', 'z-index',
  ],
  'Flexbox & Grid': [
    'flex-basis', 'flex-direction', 'flex-wrap', 'flex', 'flex-grow', 'flex-shrink', 'order',
    'grid-template-columns', 'grid-column', 'grid-template-rows', 'grid-row', 'grid-auto-flow', 'grid-auto-columns', 'grid-auto-rows',
    'gap',
    'justify-content', 'justify-items', 'justify-self',
    'align-content', 'align-items', 'align-self',
    'place-content', 'place-items', 'place-self',
  ],
  Spacing: ['padding', 'margin'],
  Sizing: [
    'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
    'inline-size', 'min-inline-size', 'max-inline-size',
    'block-size', 'min-block-size', 'max-block-size',
  ],
  Typography: [
    'font-family', 'font-size', 'font-smoothing', 'font-style', 'font-weight', 'font-stretch',
    'font-variant-numeric', 'font-feature-settings', 'letter-spacing', 'line-clamp', 'line-height',
    'list-style-image', 'list-style-position', 'list-style-type',
    'text-align', 'color',
    'text-decoration-line', 'text-decoration-color', 'text-decoration-style', 'text-decoration-thickness',
    'text-underline-offset', 'text-transform', 'text-overflow', 'text-wrap', 'text-indent',
    'vertical-align', 'white-space', 'word-break', 'overflow-wrap', 'hyphens', 'content',
  ],
  Backgrounds: [
    'background-attachment', 'background-clip', 'background-color', 'background-image',
    'background-origin', 'background-position', 'background-repeat', 'background-size',
  ],
  Borders: [
    'border-radius', 'border-width', 'border-color', 'border-style',
    'outline-width', 'outline-color', 'outline-style', 'outline-offset',
  ],
  Effects: [
    'box-shadow', 'text-shadow', 'opacity', 'mix-blend-mode', 'background-blend-mode',
    'mask-clip', 'mask-composite', 'mask-image', 'mask-mode', 'mask-origin',
    'mask-position', 'mask-repeat', 'mask-size', 'mask-type',
  ],
  Filters: [
    'filter', 'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale',
    'hue-rotate', 'invert', 'saturate', 'sepia',
    'backdrop-filter', 'backdrop-blur', 'backdrop-brightness', 'backdrop-contrast',
    'backdrop-grayscale', 'backdrop-hue-rotate', 'backdrop-invert', 'backdrop-opacity',
    'backdrop-saturate', 'backdrop-sepia',
  ],
  Tables: ['border-collapse', 'border-spacing', 'table-layout', 'caption-side'],
  'Transitions & Animation': [
    'transition-property', 'transition-behavior', 'transition-duration',
    'transition-timing-function', 'transition-delay', 'animation',
  ],
  Transforms: [
    'backface-visibility', 'perspective', 'perspective-origin', 'rotate', 'scale', 'skew',
    'transform', 'transform-origin', 'transform-style', 'translate',
  ],
  Interactivity: [
    'accent-color', 'appearance', 'caret-color', 'color-scheme', 'cursor', 'field-sizing',
    'pointer-events', 'resize', 'scroll-behavior', 'scroll-margin', 'scroll-padding',
    'scroll-snap-align', 'scroll-snap-stop', 'scroll-snap-type', 'touch-action',
    'user-select', 'will-change',
  ],
  SVG: ['fill', 'stroke', 'stroke-width'],
};
const TAILWIND_OFFICIAL_NUMERIC = {
  spacing: { '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384, px:1 },
  borderRadius: { none:0, sm:2, DEFAULT:4, md:6, lg:8, xl:12, '2xl':16, '3xl':24, full:9999 },
  borderWidth: { '0':0, DEFAULT:1, '2':2, '4':4, '8':8 },
  fontSize: { xs:12, sm:14, base:16, lg:18, xl:20, '2xl':24, '3xl':30, '4xl':36, '5xl':48, '6xl':60, '7xl':72, '8xl':96, '9xl':128 },
  lineHeight: { '3':12, '4':16, '5':20, '6':24, '7':28, '8':32, '9':36, '10':40 },
  maxWidth: { '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384, px:1, xs:320, sm:384, md:448, lg:512, xl:576, '2xl':672, '3xl':768, '4xl':896, '5xl':1024, '6xl':1152, '7xl':1280, 'screen-sm':640, 'screen-md':768, 'screen-lg':1024, 'screen-xl':1280, 'screen-2xl':1536 },
  minWidth: { '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384, px:1 },
  width: { '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384, px:1 },
  minHeight: { '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384, px:1 },
  maxHeight: { '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384, px:1 },
  height: { '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384, px:1 },
  outlineOffset: { '0':0, '1':1, '2':2, '4':4, '8':8 },
  letterSpacing: { tighter:-0.05, tight:-0.025, normal:0, wide:0.025, wider:0.05, widest:0.1 },
};
const PROPERTY_SCALE_MAP = {
  'flex-basis': 'spacing',
  gap: 'spacing',
  padding: 'spacing',
  margin: 'spacing',
  width: 'width',
  'min-width': 'minWidth',
  'max-width': 'maxWidth',
  height: 'height',
  'min-height': 'minHeight',
  'max-height': 'maxHeight',
  'inline-size': 'width',
  'min-inline-size': 'minWidth',
  'max-inline-size': 'maxWidth',
  'block-size': 'height',
  'min-block-size': 'minHeight',
  'max-block-size': 'maxHeight',
  'font-size': 'fontSize',
  'line-height': 'lineHeight',
  'letter-spacing': 'letterSpacing',
  'border-radius': 'borderRadius',
  'border-width': 'borderWidth',
  'outline-width': 'borderWidth',
  'outline-offset': 'outlineOffset',
  'z-index': 'spacing',
};
const PROPERTY_CLASS_PREFIX_MAP = {
  'flex-basis': 'basis',
  gap: 'gap',
  padding: 'p',
  margin: 'm',
  width: 'w',
  'min-width': 'min-w',
  'max-width': 'max-w',
  height: 'h',
  'min-height': 'min-h',
  'max-height': 'max-h',
  'inline-size': 'w',
  'min-inline-size': 'min-w',
  'max-inline-size': 'max-w',
  'block-size': 'h',
  'min-block-size': 'min-h',
  'max-block-size': 'max-h',
  'font-size': 'text',
  'line-height': 'leading',
  'letter-spacing': 'tracking',
  'border-radius': 'rounded',
  'border-width': 'border',
  'outline-width': 'outline',
  'outline-offset': 'outline-offset',
  'z-index': 'z',
};
const PROPERTY_ENUM_VALUES = {
  display: ['block', 'inline-block', 'inline', 'flex', 'grid', 'hidden'],
  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  overflow: ['visible', 'hidden', 'clip', 'scroll', 'auto'],
  'object-fit': ['contain', 'cover', 'fill', 'none', 'scale-down'],
  'font-style': ['normal', 'italic'],
  'font-smoothing': ['auto', 'antialiased', 'subpixel-antialiased'],
  'text-align': ['left', 'center', 'right', 'justify', 'start', 'end'],
  'text-transform': ['uppercase', 'lowercase', 'capitalize', 'none'],
  'white-space': ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'],
  'word-break': ['normal', 'break-all', 'keep-all', 'break-word'],
  visibility: ['visible', 'invisible', 'collapse'],
  isolation: ['auto', 'isolate'],
  float: ['left', 'right', 'none', 'inline-start', 'inline-end'],
  clear: ['left', 'right', 'both', 'none', 'inline-start', 'inline-end'],
  'justify-content': ['normal', 'start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'],
  'align-items': ['start', 'end', 'center', 'baseline', 'stretch'],
  'align-content': ['normal', 'center', 'start', 'end', 'between', 'around', 'evenly', 'stretch'],
  'align-self': ['auto', 'start', 'end', 'center', 'stretch', 'baseline'],
  'justify-items': ['start', 'end', 'center', 'stretch'],
  'justify-self': ['auto', 'start', 'end', 'center', 'stretch'],
  'place-items': ['start', 'end', 'center', 'stretch'],
  'place-content': ['center', 'start', 'end', 'between', 'around', 'evenly', 'stretch'],
  'place-self': ['auto', 'start', 'end', 'center', 'stretch'],
  'flex-direction': ['row', 'row-reverse', 'col', 'col-reverse'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'flex-grow': ['0', '1'],
  'flex-shrink': ['0', '1'],
  'grid-auto-flow': ['row', 'column', 'dense', 'row-dense', 'column-dense'],
  'border-style': ['solid', 'dashed', 'dotted', 'double', 'none'],
  'outline-style': ['solid', 'dashed', 'dotted', 'double', 'none'],
  'mix-blend-mode': ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten'],
  'background-blend-mode': ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten'],
  'table-layout': ['auto', 'fixed'],
  'caption-side': ['top', 'bottom'],
  cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'not-allowed'],
  'pointer-events': ['none', 'auto'],
  resize: ['none', 'both', 'horizontal', 'vertical'],
  'scroll-behavior': ['auto', 'smooth'],
  'user-select': ['none', 'text', 'all', 'auto'],
};

// ─── COLOR UTILS ─────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1,3),16)/255,
    g: parseInt(hex.slice(3,5),16)/255,
    b: parseInt(hex.slice(5,7),16)/255,
    a: 1,
  };
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255;
  let g = parseInt(hex.slice(3,5),16)/255;
  let b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0;
  const l = (max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max === r) h = ((g-b)/d + (g<b?6:0))/6;
    else if (max === g) h = ((b-r)/d + 2)/6;
    else h = ((r-g)/d + 4)/6;
  }
  return [h*360, s*100, l*100];
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p+(q-p)*6*t;
      if (t < 1/2) return q;
      if (t < 2/3) return p+(q-p)*(2/3-t)*6;
      return p;
    };
    const q = l < 0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l-q;
    r = hue2rgb(p,q,h+1/3);
    g = hue2rgb(p,q,h);
    b = hue2rgb(p,q,h-1/3);
  }
  return '#'+[r,g,b].map(x => Math.round(x*255).toString(16).padStart(2,'0')).join('');
}

// Generate a full 11-shade palette from any hex color (base treated as ~500)
function generateShades(hex) {
  const [h, s] = hexToHsl(hex);
  const lightnessMap = { 50:97, 100:93, 200:86, 300:74, 400:61, 500:48, 600:38, 700:29, 800:21, 900:15, 950:9 };
  const result = {};
  for (const [shade, targetL] of Object.entries(lightnessMap)) {
    const satScale = targetL > 85 ? 0.55 : targetL < 18 ? 0.65 : 1;
    result[shade] = hslToHex(h, Math.min(100, s * satScale), targetL);
  }
  return result;
}

// ─── CREATORS ───────────────────────────────────────────────────────────────

function createColorPrimitive(includeFullPalette, extraPalettes = {}) {
  const col = figma.variables.createVariableCollection('Color Primitive');
  const modeId = col.defaultModeId;
  const varMap = {};

  const allColors = includeFullPalette ? Object.assign({}, COLORS, extraPalettes) : extraPalettes;

  const entries = [['black','#000000'],['white','#ffffff']];
  Object.keys(allColors).forEach(function(name) {
    Object.keys(allColors[name]).forEach(function(shade) {
      entries.push([name + '/' + shade, allColors[name][shade]]);
    });
  });

  for (const [name, hex] of entries) {
    const v = figma.variables.createVariable(name, col, 'COLOR');
    v.setValueForMode(modeId, hexToRgb(hex));
    varMap[name] = v;
  }

  return { count: entries.length, varMap };
}

function createTypoPrimitive() {
  const col = figma.variables.createVariableCollection('Typography Primitive');
  const modeId = col.defaultModeId;

  const fontSizes     = { xs:12, sm:14, base:16, lg:18, xl:20, '2xl':24, '3xl':30, '4xl':36, '5xl':48, '6xl':60, '7xl':72, '8xl':96, '9xl':128 };
  const fontWeights   = { thin:100, extralight:200, light:300, normal:400, medium:500, semibold:600, bold:700, extrabold:800, black:900 };
  const lineHeights   = { none:1, tight:1.25, snug:1.375, normal:1.5, relaxed:1.625, loose:2 };
  const letterSpacing = { tighter:-0.8, tight:-0.4, normal:0, wide:0.4, wider:0.8, widest:1.6 };
  const fontFamilies  = { sans:'Inter, ui-sans-serif, system-ui, sans-serif', mono:'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace' };

  let count = 0;
  function fl(name, value) { const v = figma.variables.createVariable(name, col, 'FLOAT');  v.setValueForMode(modeId, value); count++; }
  function st(name, value) { const v = figma.variables.createVariable(name, col, 'STRING'); v.setValueForMode(modeId, value); count++; }

  for (const [k,v] of Object.entries(fontSizes))     fl(`font-size/${k}`, v);
  for (const [k,v] of Object.entries(fontWeights))   fl(`font-weight/${k}`, v);
  for (const [k,v] of Object.entries(lineHeights))   fl(`line-height/${k}`, v);
  for (const [k,v] of Object.entries(letterSpacing)) fl(`letter-spacing/${k}`, v);
  for (const [k,v] of Object.entries(fontFamilies))  st(`font-family/${k}`, v);

  return count;
}

function createTailwindSpecVariables() {
  const existingCollection = figma.variables
    .getLocalVariableCollections()
    .find((c) => c.name === 'Tailwind Spec');
  const col = existingCollection || figma.variables.createVariableCollection('Tailwind Spec');
  const modeId = col.defaultModeId;
  let count = 0;
  const existingVars = {};
  for (const v of figma.variables.getLocalVariables()) {
    if (v.variableCollectionId === col.id) existingVars[v.name] = v;
  }
  function tokenSlug(name) {
    return String(name).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function upsertString(name, value) {
    const v = existingVars[name] || figma.variables.createVariable(name, col, 'STRING');
    v.setValueForMode(modeId, value);
    existingVars[name] = v;
    count++;
  }
  function addFloat(name, value) {
    if (typeof value !== 'number' || Number.isNaN(value)) return;
    const v = existingVars[name] || figma.variables.createVariable(name, col, 'FLOAT');
    v.setValueForMode(modeId, value);
    existingVars[name] = v;
    count++;
  }
  function tokenToClassName(prefix, token) {
    if (token === 'DEFAULT') return prefix;
    return `${prefix}-${token}`;
  }

  for (const [category, props] of Object.entries(TAILWIND_SPEC)) {
    const categorySlug = category.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-');
    for (const prop of props) {
      const propSlug = tokenSlug(prop);
      const scale = PROPERTY_SCALE_MAP[prop];
      if (scale && TAILWIND_OFFICIAL_NUMERIC[scale]) {
        const classPrefix = PROPERTY_CLASS_PREFIX_MAP[prop] || tokenSlug(prop);
        for (const [token, value] of Object.entries(TAILWIND_OFFICIAL_NUMERIC[scale])) {
          const className = tokenToClassName(classPrefix, token);
          addFloat(`tw-spec/${categorySlug}/${propSlug}/${tokenSlug(className)}`, value);
        }
        continue;
      }

      const enums = PROPERTY_ENUM_VALUES[prop];
      if (enums && enums.length) {
        for (const option of enums) {
          upsertString(`tw-spec/${categorySlug}/${propSlug}/${tokenSlug(option)}`, option);
        }
      }
    }
  }

  for (const [scale, values] of Object.entries(TAILWIND_OFFICIAL_NUMERIC)) {
    for (const [token, value] of Object.entries(values)) {
      addFloat(`tw/${scale}/${tokenSlug(token)}`, value);
    }
  }

  const basisTokens = {
    '3xs': 256, '2xs': 288, xs: 320, sm: 384, md: 448, lg: 512, xl: 576,
    '2xl': 672, '3xl': 768, '4xl': 896, '5xl': 1024, '6xl': 1152, '7xl': 1280,
  };
  for (const [token, px] of Object.entries(basisTokens)) {
    addFloat(`tw/flex-basis/basis-${token}`, px);
  }

  return count;
}

// brand: { primary: {mode:'palette',value:'blue'} | {mode:'custom',hex:'#...'}, ... }
function createBrandColors(brand, primitiveVarMap) {
  const col = figma.variables.createVariableCollection('Color Semantic');
  const modeId = col.defaultModeId;
  let count = 0;

  const existing = {};
  if (!primitiveVarMap) {
    for (const v of figma.variables.getLocalVariables('COLOR')) existing[v.name] = v;
  }

  for (const [role, config] of Object.entries(brand)) {
    if (!config) continue;
    const paletteName = config.mode === 'custom' ? role : config.value;

    for (const shade of SHADES) {
      const primitiveName = `${paletteName}/${shade}`;
      const v = figma.variables.createVariable(`${role}/${shade}`, col, 'COLOR');
      const source = primitiveVarMap ? primitiveVarMap[primitiveName] : existing[primitiveName];

      if (source) {
        v.setValueForMode(modeId, figma.variables.createVariableAlias(source));
      } else if (config.mode === 'custom') {
        // Fallback: generate shade inline
        const shades = generateShades(config.hex);
        v.setValueForMode(modeId, hexToRgb(shades[shade]));
      }
      count++;
    }
  }

  return count;
}

function rgbToHex(rgb) {
  return '#' + [rgb.r, rgb.g, rgb.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}

function extractShade(name) {
  const tail = name.split('/').pop() || '';
  return /^\d+$/.test(tail) ? tail : '—';
}

function resolveColorValue(variable, modeId, varsById, seen = new Set()) {
  const raw = variable.valuesByMode[modeId] || Object.values(variable.valuesByMode)[0];
  if (!raw) return null;

  if (raw.type === 'VARIABLE_ALIAS' && raw.id) {
    if (seen.has(raw.id) || !varsById[raw.id]) return null;
    seen.add(raw.id);
    return resolveColorValue(varsById[raw.id], modeId, varsById, seen);
  }

  if (typeof raw.r === 'number' && typeof raw.g === 'number' && typeof raw.b === 'number') return raw;
  return null;
}

function buildSpecClassRowsForCategory(categoryName) {
  const rows = [];
  function tokenSlug(name) {
    return String(name).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function tokenToClassName(prefix, token) {
    if (token === 'DEFAULT') return prefix;
    return `${prefix}-${token}`;
  }

  const props = TAILWIND_SPEC[categoryName] || [];
  for (const prop of props) {
    const scale = PROPERTY_SCALE_MAP[prop];
    const classPrefix = PROPERTY_CLASS_PREFIX_MAP[prop] || tokenSlug(prop);
    if (scale && TAILWIND_OFFICIAL_NUMERIC[scale]) {
      for (const [token, value] of Object.entries(TAILWIND_OFFICIAL_NUMERIC[scale])) {
        const className = tokenToClassName(classPrefix, token);
        rows.push({ property: prop, className, value, type: 'number' });
      }
      continue;
    }
    const enums = PROPERTY_ENUM_VALUES[prop] || [];
    for (const option of enums) rows.push({ property: prop, className: `${classPrefix}-${option}`, value: option, type: 'string' });
  }
  return rows;
}

async function createTypographyPage() {
  const loadedStyles = {};
  async function tryLoadInter(style) {
    try {
      await figma.loadFontAsync({ family: 'Inter', style });
      loadedStyles[style] = true;
    } catch (_) {
      loadedStyles[style] = false;
    }
  }
  await tryLoadInter('Regular');
  if (!loadedStyles['Regular']) throw new Error('Inter Regular is not available');
  await tryLoadInter('Medium');
  await tryLoadInter('Bold');
  await tryLoadInter('Light');
  await tryLoadInter('Thin');
  await tryLoadInter('ExtraLight');
  await tryLoadInter('SemiBold');
  await tryLoadInter('ExtraBold');
  await tryLoadInter('Black');
  function pickStyle(style) {
    return loadedStyles[style] ? style : 'Regular';
  }

  const page = figma.createPage();
  page.name = 'Spec — Typography';
  figma.currentPage = page;

  const PAGE_X = 72;
  const CONTENT_W = 1320;
  const PANEL_FILL = { type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.96 } };
  const PANEL_STROKE = { type: 'SOLID', color: { r: 0.86, g: 0.86, b: 0.88 } };
  const CODE_FILL = { type: 'SOLID', color: { r: 0.11, g: 0.13, b: 0.18 } };
  const CODE_BORDER = { type: 'SOLID', color: { r: 0.03, g: 0.06, b: 0.12 } };
  const CODE_TEXT = { type: 'SOLID', color: { r: 0.82, g: 0.86, b: 0.96 } };

  const title = figma.createText();
  title.fontName = { family: 'Inter', style: 'Bold' };
  title.fontSize = 42;
  title.characters = 'Typography Spec';
  title.x = PAGE_X;
  title.y = 64;
  page.appendChild(title);

  const subtitle = figma.createText();
  subtitle.fontName = { family: 'Inter', style: 'Regular' };
  subtitle.fontSize = 16;
  subtitle.fills = [{ type: 'SOLID', color: { r: 0.38, g: 0.38, b: 0.42 } }];
  subtitle.characters = 'Font sizes, weights, line heights, tracking, alignment and transforms.';
  subtitle.x = PAGE_X;
  subtitle.y = 120;
  page.appendChild(subtitle);

  let y = 180;

  function addSectionHeading(text) {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style: 'Medium' };
    t.fontSize = 28;
    t.characters = text;
    t.x = PAGE_X;
    t.y = y;
    page.appendChild(t);
    y += 44;
  }
  function addParagraph(text) {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style: 'Regular' };
    t.fontSize = 16;
    t.lineHeight = { value: 26, unit: 'PIXELS' };
    t.characters = text;
    t.x = PAGE_X;
    t.y = y;
    t.resize(CONTENT_W, 26);
    page.appendChild(t);
    y += 40;
  }
  function addPanel(height) {
    const p = figma.createFrame();
    p.x = PAGE_X;
    p.y = y;
    p.resize(CONTENT_W, height);
    p.cornerRadius = 14;
    p.fills = [PANEL_FILL];
    p.strokes = [PANEL_STROKE];
    p.strokeWeight = 2;
    page.appendChild(p);
    y += height + 16;
    return p;
  }
  function addCodeBlock(lines) {
    const block = figma.createFrame();
    block.x = PAGE_X;
    block.y = y;
    block.resize(CONTENT_W, 40 + lines.length * 28);
    block.cornerRadius = 12;
    block.fills = [CODE_FILL];
    block.strokes = [CODE_BORDER];
    block.strokeWeight = 2;
    page.appendChild(block);
    let yy = 18;
    for (const line of lines) {
      const tx = figma.createText();
      tx.fontName = { family: 'Inter', style: 'Regular' };
      tx.fontSize = 20;
      tx.fills = [CODE_TEXT];
      tx.characters = line;
      tx.x = 26;
      tx.y = yy;
      block.appendChild(tx);
      yy += 28;
    }
    y += block.height + 36;
  }

  // Font size scale
  addSectionHeading('Font size scale');
  addParagraph('Use text-* utilities to set font size. Previews render real font-size values.');
  const fontSizes = [
    { cls: 'text-xs', size: 12 },
    { cls: 'text-sm', size: 14 },
    { cls: 'text-base', size: 16 },
    { cls: 'text-lg', size: 18 },
    { cls: 'text-xl', size: 20 },
    { cls: 'text-2xl', size: 24 },
    { cls: 'text-3xl', size: 30 },
    { cls: 'text-4xl', size: 36 },
    { cls: 'text-5xl', size: 48 },
    { cls: 'text-6xl', size: 60 },
    { cls: 'text-7xl', size: 72 },
  ];
  {
    const rowHeight = 90;
    const panel = addPanel(fontSizes.length * rowHeight + 32);
    let yy = 16;
    for (const item of fontSizes) {
      const label = figma.createText();
      label.fontName = { family: 'Inter', style: 'Medium' };
      label.fontSize = 14;
      label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
      label.characters = item.cls;
      label.x = 24;
      label.y = yy + (rowHeight - 20) / 2;
      panel.appendChild(label);

      const sample = figma.createText();
      sample.fontName = { family: 'Inter', style: 'Regular' };
      sample.fontSize = item.size;
      sample.characters = 'The quick brown fox jumps over the lazy dog';
      sample.x = 200;
      sample.y = yy + (rowHeight - item.size) / 2 - 4;
      panel.appendChild(sample);

      const px = figma.createText();
      px.fontName = { family: 'Inter', style: 'Regular' };
      px.fontSize = 14;
      px.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
      px.characters = `${item.size}px`;
      px.x = CONTENT_W - 90;
      px.y = yy + (rowHeight - 20) / 2;
      panel.appendChild(px);

      yy += rowHeight;
    }
  }
  addCodeBlock([
    '<p class="text-sm">The quick brown fox</p>',
    '<p class="text-2xl">The quick brown fox</p>',
    '<p class="text-5xl">The quick brown fox</p>',
  ]);

  // Font weight
  addSectionHeading('Font weight');
  addParagraph('Use font-* utilities to control font weight.');
  const weights = [
    { cls: 'font-thin', style: 'Thin' },
    { cls: 'font-extralight', style: 'ExtraLight' },
    { cls: 'font-light', style: 'Light' },
    { cls: 'font-normal', style: 'Regular' },
    { cls: 'font-medium', style: 'Medium' },
    { cls: 'font-semibold', style: 'SemiBold' },
    { cls: 'font-bold', style: 'Bold' },
    { cls: 'font-extrabold', style: 'ExtraBold' },
    { cls: 'font-black', style: 'Black' },
  ];
  {
    const rowHeight = 72;
    const panel = addPanel(weights.length * rowHeight + 24);
    let yy = 12;
    for (const item of weights) {
      const label = figma.createText();
      label.fontName = { family: 'Inter', style: 'Medium' };
      label.fontSize = 14;
      label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
      label.characters = item.cls;
      label.x = 24;
      label.y = yy + (rowHeight - 20) / 2;
      panel.appendChild(label);

      const sample = figma.createText();
      sample.fontName = { family: 'Inter', style: pickStyle(item.style) };
      sample.fontSize = 28;
      sample.characters = 'The quick brown fox jumps';
      sample.x = 260;
      sample.y = yy + (rowHeight - 28) / 2 - 2;
      panel.appendChild(sample);

      yy += rowHeight;
    }
  }
  addCodeBlock([
    '<p class="font-light">The quick brown fox</p>',
    '<p class="font-bold">The quick brown fox</p>',
  ]);

  // Line height
  addSectionHeading('Line height');
  addParagraph('Use leading-* utilities to control line height. Preview uses fixed size (text-lg) with different leading.');
  const leadings = [
    { cls: 'leading-none', lh: 20, label: '1' },
    { cls: 'leading-tight', lh: 22, label: '1.1' },
    { cls: 'leading-snug', lh: 24, label: '1.2' },
    { cls: 'leading-normal', lh: 28, label: '1.4' },
    { cls: 'leading-relaxed', lh: 32, label: '1.6' },
    { cls: 'leading-loose', lh: 40, label: '2' },
  ];
  {
    const rowHeight = 112;
    const panel = addPanel(leadings.length * rowHeight + 24);
    let yy = 12;
    for (const item of leadings) {
      const label = figma.createText();
      label.fontName = { family: 'Inter', style: 'Medium' };
      label.fontSize = 14;
      label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
      label.characters = `${item.cls}  (${item.label})`;
      label.x = 24;
      label.y = yy + 40;
      panel.appendChild(label);

      const sample = figma.createText();
      sample.fontName = { family: 'Inter', style: 'Regular' };
      sample.fontSize = 18;
      sample.lineHeight = { value: item.lh, unit: 'PIXELS' };
      sample.characters = 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.';
      sample.x = 280;
      sample.y = yy + 14;
      sample.resize(CONTENT_W - 300, rowHeight - 24);
      panel.appendChild(sample);

      yy += rowHeight;
    }
  }
  addCodeBlock([
    '<p class="text-lg leading-tight">The quick brown fox...</p>',
    '<p class="text-lg leading-loose">The quick brown fox...</p>',
  ]);

  // Letter spacing
  addSectionHeading('Letter spacing');
  addParagraph('Use tracking-* utilities to control letter spacing.');
  const tracks = [
    { cls: 'tracking-tighter', v: -5 },
    { cls: 'tracking-tight', v: -2.5 },
    { cls: 'tracking-normal', v: 0 },
    { cls: 'tracking-wide', v: 2.5 },
    { cls: 'tracking-wider', v: 5 },
    { cls: 'tracking-widest', v: 10 },
  ];
  {
    const rowHeight = 64;
    const panel = addPanel(tracks.length * rowHeight + 24);
    let yy = 12;
    for (const item of tracks) {
      const label = figma.createText();
      label.fontName = { family: 'Inter', style: 'Medium' };
      label.fontSize = 14;
      label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
      label.characters = item.cls;
      label.x = 24;
      label.y = yy + (rowHeight - 20) / 2;
      panel.appendChild(label);

      const sample = figma.createText();
      sample.fontName = { family: 'Inter', style: 'Medium' };
      sample.fontSize = 22;
      sample.letterSpacing = { value: item.v, unit: 'PERCENT' };
      sample.characters = 'The quick brown fox';
      sample.x = 260;
      sample.y = yy + (rowHeight - 22) / 2 - 2;
      panel.appendChild(sample);

      yy += rowHeight;
    }
  }
  addCodeBlock([
    '<p class="tracking-tight">The quick brown fox</p>',
    '<p class="tracking-widest">The quick brown fox</p>',
  ]);

  // Text transform
  addSectionHeading('Text transform');
  addParagraph('Use uppercase, lowercase, capitalize, normal-case utilities.');
  const transforms = [
    { cls: 'uppercase', text: 'the quick brown fox'.toUpperCase() },
    { cls: 'lowercase', text: 'THE QUICK BROWN FOX'.toLowerCase() },
    { cls: 'capitalize', text: 'the quick brown fox'.replace(/\b\w/g, (c) => c.toUpperCase()) },
    { cls: 'normal-case', text: 'The quick brown fox' },
  ];
  {
    const rowHeight = 56;
    const panel = addPanel(transforms.length * rowHeight + 24);
    let yy = 12;
    for (const item of transforms) {
      const label = figma.createText();
      label.fontName = { family: 'Inter', style: 'Medium' };
      label.fontSize = 14;
      label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
      label.characters = item.cls;
      label.x = 24;
      label.y = yy + (rowHeight - 20) / 2;
      panel.appendChild(label);

      const sample = figma.createText();
      sample.fontName = { family: 'Inter', style: 'Medium' };
      sample.fontSize = 20;
      sample.characters = item.text;
      sample.x = 260;
      sample.y = yy + (rowHeight - 20) / 2 - 2;
      panel.appendChild(sample);

      yy += rowHeight;
    }
  }
  addCodeBlock([
    '<p class="uppercase">the quick brown fox</p>',
    '<p class="capitalize">the quick brown fox</p>',
  ]);

  // Text align
  addSectionHeading('Text align');
  addParagraph('Use text-left, text-center, text-right, text-justify utilities.');
  const aligns = [
    { cls: 'text-left', align: 'LEFT' },
    { cls: 'text-center', align: 'CENTER' },
    { cls: 'text-right', align: 'RIGHT' },
    { cls: 'text-justify', align: 'JUSTIFIED' },
  ];
  {
    const rowHeight = 84;
    const panel = addPanel(aligns.length * rowHeight + 24);
    let yy = 12;
    for (const item of aligns) {
      const label = figma.createText();
      label.fontName = { family: 'Inter', style: 'Medium' };
      label.fontSize = 14;
      label.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
      label.characters = item.cls;
      label.x = 24;
      label.y = yy + 28;
      panel.appendChild(label);

      const sample = figma.createText();
      sample.fontName = { family: 'Inter', style: 'Regular' };
      sample.fontSize = 16;
      sample.lineHeight = { value: 24, unit: 'PIXELS' };
      sample.characters = 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.';
      sample.textAlignHorizontal = item.align;
      sample.x = 260;
      sample.y = yy + 12;
      sample.resize(CONTENT_W - 280, rowHeight - 24);
      panel.appendChild(sample);

      yy += rowHeight;
    }
  }
  addCodeBlock([
    '<p class="text-left">...</p>',
    '<p class="text-center">...</p>',
    '<p class="text-right">...</p>',
    '<p class="text-justify">...</p>',
  ]);

  figma.viewport.scrollAndZoomIntoView([title]);
  return 32;
}

async function createSpecCategoryPage(categoryName) {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const page = figma.createPage();
  page.name = `Spec — ${categoryName}`;
  figma.currentPage = page;

  const title = figma.createText();
  title.fontName = { family: 'Inter', style: 'Bold' };
  title.fontSize = 36;
  title.characters = `${categoryName} Spec`;
  title.x = 72;
  title.y = 64;
  page.appendChild(title);

  const subtitle = figma.createText();
  subtitle.fontName = { family: 'Inter', style: 'Regular' };
  subtitle.fontSize = 14;
  subtitle.fills = [{ type: 'SOLID', color: { r: 0.38, g: 0.38, b: 0.42 } }];
  subtitle.characters = 'Generated from Tailwind token mappings for plugin variables';
  subtitle.x = 72;
  subtitle.y = 114;
  page.appendChild(subtitle);

  const rows = buildSpecClassRowsForCategory(categoryName);
  if (rows.length === 0) {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style: 'Regular' };
    t.fontSize = 14;
    t.characters = 'No mapped values for this category yet.';
    t.x = 72;
    t.y = 168;
    page.appendChild(t);
    figma.viewport.scrollAndZoomIntoView([title, t]);
    return 0;
  }

  if (categoryName === 'Spacing') {
    const numericRows = rows
      .filter((r) => r.type === 'number' && (r.className.startsWith('p-') || r.className.startsWith('m-') || r.className.startsWith('gap-')))
      .sort((a, b) => Number(a.value) - Number(b.value));

    let y = 170;
    const shown = numericRows.slice(0, 28);
    for (const row of shown) {
      const classText = figma.createText();
      classText.fontName = { family: 'Inter', style: 'Medium' };
      classText.fontSize = 12;
      classText.characters = row.className;
      classText.x = 72;
      classText.y = y + 12;
      page.appendChild(classText);

      const leftBox = figma.createRectangle();
      leftBox.x = 220;
      leftBox.y = y;
      leftBox.resize(48, 28);
      leftBox.cornerRadius = 6;
      leftBox.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.86, b: 0.9 } }];
      page.appendChild(leftBox);

      const rightBox = figma.createRectangle();
      rightBox.x = 220 + 48 + Number(row.value);
      rightBox.y = y;
      rightBox.resize(48, 28);
      rightBox.cornerRadius = 6;
      rightBox.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.86, b: 0.9 } }];
      page.appendChild(rightBox);

      const measure = figma.createRectangle();
      measure.x = 220 + 48;
      measure.y = y + 13;
      measure.resize(Math.max(1, Number(row.value)), 2);
      measure.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.12, b: 0.12 } }];
      page.appendChild(measure);

      const valueText = figma.createText();
      valueText.fontName = { family: 'Inter', style: 'Regular' };
      valueText.fontSize = 11;
      valueText.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.12, b: 0.12 } }];
      valueText.characters = `${Number(row.value)}px`;
      valueText.x = 220 + 52 + Number(row.value);
      valueText.y = y + 8;
      page.appendChild(valueText);

      y += 42;
    }
    figma.viewport.scrollAndZoomIntoView([title]);
    return shown.length;
  }

  const frame = figma.createFrame();
  frame.x = 72;
  frame.y = 168;
  frame.resize(1320, 120);
  frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
  frame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  frame.cornerRadius = 12;
  page.appendChild(frame);

  const cardW = 300;
  const cardH = 130;
  const cols = 4;
  const gap = 12;
  const shownRows = rows.slice(0, 120);

  for (let i = 0; i < shownRows.length; i++) {
    const row = shownRows[i];
    const colI = i % cols;
    const rowI = Math.floor(i / cols);
    const x = 16 + colI * (cardW + gap);
    const y = 16 + rowI * (cardH + gap);

    const card = figma.createFrame();
    card.x = x;
    card.y = y;
    card.resize(cardW, cardH);
    card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    card.cornerRadius = 10;
    frame.appendChild(card);

    const name = figma.createText();
    name.fontName = { family: 'Inter', style: 'Medium' };
    name.fontSize = 11;
    name.characters = row.className;
    name.x = 10;
    name.y = 8;
    card.appendChild(name);

    const value = figma.createText();
    value.fontName = { family: 'Inter', style: 'Regular' };
    value.fontSize = 10;
    value.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.42, b: 0.46 } }];
    value.characters = String(row.value);
    value.x = 10;
    value.y = 24;
    card.appendChild(value);

    const demo = figma.createFrame();
    demo.x = 10;
    demo.y = 46;
    demo.resize(cardW - 20, cardH - 56);
    demo.cornerRadius = 6;
    demo.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.97, b: 0.99 } }];
    demo.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    card.appendChild(demo);

    // Generic visualizations by category/property.
    if (categoryName === 'Typography') {
      const t = figma.createText();
      t.fontName = { family: 'Inter', style: 'Medium' };
      t.characters = 'The quick brown fox';
      t.x = 8;
      t.y = 8;
      if (row.property === 'font-size' && row.type === 'number') t.fontSize = Number(row.value);
      else t.fontSize = 13;
      if (row.property === 'letter-spacing' && row.type === 'number') t.letterSpacing = { value: Number(row.value), unit: 'PERCENT' };
      if (row.property === 'line-height' && row.type === 'number') t.lineHeight = { value: Number(row.value), unit: 'PIXELS' };
      demo.appendChild(t);
    } else if (categoryName === 'Borders') {
      const r = figma.createRectangle();
      r.x = 10;
      r.y = 8;
      r.resize(demo.width - 20, demo.height - 16);
      r.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.95, b: 1 } }];
      r.strokes = [{ type: 'SOLID', color: { r: 0.3, g: 0.35, b: 0.55 } }];
      if (row.property === 'border-radius' && row.type === 'number') r.cornerRadius = Number(row.value);
      if (row.property === 'border-width' && row.type === 'number') r.strokeWeight = Math.max(1, Number(row.value));
      demo.appendChild(r);
    } else if (categoryName === 'Effects') {
      const a = figma.createRectangle();
      a.x = 18; a.y = 14; a.resize(54, 28);
      a.fills = [{ type: 'SOLID', color: { r: 0.52, g: 0.33, b: 0.95 }, opacity: row.property === 'opacity' && row.type === 'number' ? Math.max(0, Math.min(1, Number(row.value) / 100)) : 1 }];
      a.cornerRadius = 6;
      demo.appendChild(a);
      const b = figma.createRectangle();
      b.x = 52; b.y = 26; b.resize(54, 28);
      b.fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.46, b: 0.95 } }];
      b.cornerRadius = 6;
      demo.appendChild(b);
    } else if (categoryName === 'Transforms') {
      const r = figma.createRectangle();
      r.x = 26; r.y = 12; r.resize(72, 36);
      r.cornerRadius = 6;
      r.fills = [{ type: 'SOLID', color: { r: 0.32, g: 0.45, b: 0.92 } }];
      if (row.className.indexOf('rotate') >= 0) r.rotation = 15;
      if (row.className.indexOf('scale') >= 0) r.resize(82, 40);
      if (row.className.indexOf('translate') >= 0) r.x += 14;
      demo.appendChild(r);
    } else if (categoryName === 'Layout' || categoryName === 'Flexbox & Grid' || categoryName === 'Sizing') {
      const base = figma.createRectangle();
      base.x = 10; base.y = 8; base.resize(demo.width - 20, demo.height - 16);
      base.cornerRadius = 6;
      base.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.94, b: 0.98 } }];
      demo.appendChild(base);
      const bar = figma.createRectangle();
      bar.x = 16;
      bar.y = 14;
      const maxW = demo.width - 32;
      const width = row.type === 'number' ? Math.max(12, Math.min(maxW, Number(row.value) / 2)) : maxW * 0.6;
      bar.resize(width, 22);
      bar.cornerRadius = 5;
      bar.fills = [{ type: 'SOLID', color: { r: 0.33, g: 0.42, b: 0.93 } }];
      demo.appendChild(bar);
    } else {
      const t = figma.createText();
      t.fontName = { family: 'Inter', style: 'Regular' };
      t.fontSize = 11;
      t.characters = `${row.property}: ${row.value}`;
      t.x = 8;
      t.y = 8;
      demo.appendChild(t);
    }
  }

  const rowsCount = Math.max(1, Math.ceil(shownRows.length / cols));
  frame.resize(1320, 16 + rowsCount * (cardH + gap));
  figma.viewport.scrollAndZoomIntoView([title, frame]);
  return shownRows.length;
}

async function plotColorCollections() {
  const collections = figma.variables.getLocalVariableCollections();
  const colorVars = figma.variables.getLocalVariables('COLOR');
  if (colorVars.length === 0) throw new Error('No local color variables found.');

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });

  const varsById = {};
  for (const v of colorVars) varsById[v.id] = v;

  const byCollection = {};
  for (const v of colorVars) {
    const key = v.variableCollectionId || 'unknown';
    if (!byCollection[key]) byCollection[key] = [];
    byCollection[key].push(v);
  }

  const frameWidth = 952;
  const cardWidth = 176;
  const cardHeight = 84;
  const columns = 5;
  const gutter = 14;
  const sectionGap = 24;
  let plotted = 0;
  const plottedFrames = [];

  const collectionById = {};
  for (const col of collections) collectionById[col.id] = col;

  const sortedCollectionIds = Object.keys(byCollection).sort((a, b) => {
    const an = ((collectionById[a] && collectionById[a].name) || a).toLowerCase();
    const bn = ((collectionById[b] && collectionById[b].name) || b).toLowerCase();
    return an.localeCompare(bn);
  });

  for (const collectionId of sortedCollectionIds) {
    const col = collectionById[collectionId];
    const modeId = col ? col.defaultModeId : null;
    if (!modeId) continue;

    const vars = byCollection[collectionId].slice().sort((a, b) => a.name.localeCompare(b.name));
    const groups = {};
    for (const v of vars) {
      const parts = v.name.split('/');
      const groupName = parts.length > 1 ? parts[0] : 'misc';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(v);
    }
    const groupNames = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    for (const groupName of groupNames) {
      let visibleIndex = 0;
      const groupVars = groups[groupName].slice().sort((a, b) => {
        const as = parseInt(extractShade(a.name), 10);
        const bs = parseInt(extractShade(b.name), 10);
        if (!isNaN(as) && !isNaN(bs)) return as - bs;
        return a.name.localeCompare(b.name);
      });

      const frame = figma.createFrame();
      frame.name = `${groupName} (${col.name})`;
      frame.resize(frameWidth, 120);
      frame.fills = [{ type: 'SOLID', color: { r: 0.985, g: 0.986, b: 0.99 } }];
      frame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      frame.strokeWeight = 1;
      frame.cornerRadius = 10;

      const title = figma.createText();
      title.fontName = { family: 'Inter', style: 'Medium' };
      title.fontSize = 15;
      title.characters = `${groupName} (${col.name})`;
      title.x = 14;
      title.y = 12;
      frame.appendChild(title);

      for (const v of groupVars) {
        const rgb = resolveColorValue(v, modeId, varsById);
        if (!rgb) continue;

        const hex = rgbToHex(rgb).toUpperCase();
        const shade = extractShade(v.name);
        const colIndex = visibleIndex % columns;
        const rowIndex = Math.floor(visibleIndex / columns);
        const x = 14 + colIndex * (cardWidth + gutter);
        const yy = 40 + rowIndex * (cardHeight + 12);

        const card = figma.createFrame();
        card.name = `${v.name} ${hex}`;
        card.x = x;
        card.y = yy;
        card.resize(cardWidth, cardHeight);
        card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        card.cornerRadius = 8;

        const swatch = figma.createRectangle();
        swatch.name = 'Swatch';
        swatch.x = 8;
        swatch.y = 8;
        swatch.resize(cardWidth - 16, 36);
        swatch.cornerRadius = 5;
        swatch.fills = [{ type: 'SOLID', color: { r: rgb.r, g: rgb.g, b: rgb.b }, opacity: typeof rgb.a === 'number' ? rgb.a : 1 }];
        card.appendChild(swatch);

        const nameText = figma.createText();
        nameText.fontName = { family: 'Inter', style: 'Medium' };
        nameText.fontSize = 11;
        nameText.characters = v.name;
        nameText.x = 8;
        nameText.y = 50;
        card.appendChild(nameText);

        const metaText = figma.createText();
        metaText.fontName = { family: 'Inter', style: 'Regular' };
        metaText.fontSize = 10;
        metaText.fills = [{ type: 'SOLID', color: { r: 0.38, g: 0.38, b: 0.42 } }];
        metaText.characters = `${hex}  •  ${shade}`;
        metaText.x = 8;
        metaText.y = 65;
        card.appendChild(metaText);

        frame.appendChild(card);
        visibleIndex++;
        plotted++;
      }

      if (visibleIndex === 0) continue;
      const rows = Math.max(1, Math.ceil(visibleIndex / columns));
      frame.resize(frameWidth, 40 + rows * (cardHeight + 12) + 8);
      plottedFrames.push(frame);
    }
  }

  if (plottedFrames.length === 0) throw new Error('No color groups with plottable values found.');

  const totalHeight = plottedFrames.reduce((sum, frame) => sum + frame.height, 0) + (plottedFrames.length - 1) * sectionGap;
  const startX = figma.viewport.center.x - frameWidth / 2;
  let y = figma.viewport.center.y - totalHeight / 2;

  for (const frame of plottedFrames) {
    figma.currentPage.appendChild(frame);
    frame.x = startX;
    frame.y = y;
    y += frame.height + sectionGap;
  }

  figma.currentPage.selection = plottedFrames;
  figma.viewport.scrollAndZoomIntoView(plottedFrames);

  return plotted;
}

// ─── FRAME DOCUMENTATION (template agent) ──────────────────────────────────

function rgbToHexA(c) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`.toUpperCase();
  if (typeof c.a === 'number' && c.a < 1) return hex + toHex(c.a);
  return hex;
}

function formatVariableValue(value, type) {
  if (value === null || value === undefined) return 'null';
  if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    const aliased = figma.variables.getVariableById(value.id);
    return aliased ? `→ ${aliased.name}` : '→ (unknown alias)';
  }
  if (type === 'COLOR' && value && typeof value === 'object') {
    return rgbToHexA(value);
  }
  if (type === 'FLOAT') return String(value);
  if (type === 'STRING') return JSON.stringify(value);
  if (type === 'BOOLEAN') return String(value);
  return JSON.stringify(value);
}

function categoryForVariable(v) {
  const name = (v.name || '').toLowerCase();
  if (v.resolvedType === 'COLOR') return 'colors';
  if (/font|text|leading|tracking|weight|typo/.test(name)) return 'typography';
  if (/radius|radii|rounded/.test(name)) return 'radii';
  if (/space|spacing|gap|padding|margin/.test(name)) return 'spacing';
  if (/shadow|blur|effect|opacity/.test(name)) return 'effects';
  if (/size|width|height/.test(name)) return 'sizing';
  return 'other';
}

function nodePathString(stack) {
  return stack.map((s) => s || '(unnamed)').join(' ▸ ');
}

async function createFrameDocumentation() {
  const selection = figma.currentPage.selection;
  if (!selection || selection.length === 0) {
    throw new Error('Select a frame or component first.');
  }
  const target = selection[0];
  if (!('children' in target)) {
    throw new Error('Selection must be a frame, group, component, or instance.');
  }

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const uniqueVars = {};
  const usage = [];

  function recordVariable(id) {
    if (uniqueVars[id]) return uniqueVars[id];
    const v = figma.variables.getVariableById(id);
    if (!v) return null;
    const coll = figma.variables.getVariableCollectionById(v.variableCollectionId);
    const collectionName = coll ? coll.name : 'Unknown collection';
    const modeId = coll ? coll.defaultModeId : null;
    const rawValue = modeId ? v.valuesByMode[modeId] : null;
    const entry = {
      id,
      name: v.name,
      type: v.resolvedType,
      collection: collectionName,
      valueRaw: rawValue,
      valueFormatted: formatVariableValue(rawValue, v.resolvedType),
      category: categoryForVariable(v),
    };
    uniqueVars[id] = entry;
    return entry;
  }

  function walk(node, stack) {
    const here = stack.concat([node.name || node.type]);
    const bv = node.boundVariables;
    if (bv) {
      for (const field in bv) {
        const bound = bv[field];
        const aliases = Array.isArray(bound) ? bound : [bound];
        for (const alias of aliases) {
          if (!alias || alias.type !== 'VARIABLE_ALIAS') continue;
          const entry = recordVariable(alias.id);
          if (!entry) continue;
          usage.push({
            path: nodePathString(here),
            nodeName: node.name || '(unnamed)',
            nodeType: node.type,
            field,
            variableName: entry.name,
            variableCollection: entry.collection,
            variableValue: entry.valueFormatted,
          });
        }
      }
    }
    if ('children' in node) {
      for (const child of node.children) walk(child, here);
    }
  }

  walk(target, []);

  // ─── Tree extractor (for browser-side rendering) ───────────────────────────
  // The `bindings`/`variables` arrays document the token surface. `tree`
  // carries the structural + presentational info a renderer needs: layout
  // props, fills, strokes, text content, instance keys. Token refs are
  // preserved alongside resolved values so a consumer with a live token
  // system can re-resolve at runtime.

  function fillToHex(fill) {
    if (!fill || fill.type !== 'SOLID' || fill.visible === false) return null;
    const r = Math.round((fill.color.r || 0) * 255);
    const g = Math.round((fill.color.g || 0) * 255);
    const b = Math.round((fill.color.b || 0) * 255);
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return {
      color: `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(),
      opacity: fill.opacity != null ? fill.opacity : 1,
    };
  }

  function rgbaStop(stop) {
    const { r, g, b } = stop.color;
    const a = stop.color.a != null ? stop.color.a : 1;
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
  }

  function gradientToCss(fill) {
    const stops = fill.gradientStops
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((s) => `${rgbaStop(s)} ${(s.position * 100).toFixed(1)}%`)
      .join(', ');

    // Figma gradient transform maps local unit space (0..1) onto the node.
    // For LINEAR: derive angle from the inverse of the transform.
    // This formula matches Figma's CSS export output well enough for renderers.
    const t = fill.gradientTransform || [[1, 0, 0], [0, 1, 0]];
    const [a, b] = [t[0][0], t[0][1]];
    const c = t[1][0];
    if (fill.type === 'GRADIENT_LINEAR') {
      const angle = Math.atan2(c, a) * 180 / Math.PI;
      const cssAngle = (angle + 90) % 360;
      return `linear-gradient(${cssAngle.toFixed(1)}deg, ${stops})`;
    }
    if (fill.type === 'GRADIENT_RADIAL') {
      return `radial-gradient(ellipse at center, ${stops})`;
    }
    if (fill.type === 'GRADIENT_ANGULAR') {
      return `conic-gradient(from 0deg at 50% 50%, ${stops})`;
    }
    if (fill.type === 'GRADIENT_DIAMOND') {
      // CSS has no diamond gradient; approximate with radial.
      return `radial-gradient(ellipse at center, ${stops})`;
    }
    return null;
  }

  // 1.5 MB cap — raised from the old 500 KB now that the viewer can show
  // a labelled placeholder for anything above it (instead of silently
  // dropping). Keeps the typical 5-10 MB total payload manageable while
  // covering most hero/OG images.
  const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
  const imageCache = {};
  const imageSkipBytes = {};
  let imagesInlinedBytes = 0;
  let imagesSkippedTooLarge = 0;
  let imagesFailed = 0;

  function bytesToBase64(bytes) {
    // btoa expects a binary string. Build in chunks to avoid call-stack limits.
    const CHUNK = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(binary);
  }

  function sniffImageMime(bytes) {
    if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
    if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
    if (bytes.length >= 12 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
    return 'image/png';
  }

  async function imageBytesToDataUrl(imageHash) {
    if (imageCache[imageHash] !== undefined) return imageCache[imageHash];
    try {
      const img = figma.getImageByHash(imageHash);
      if (!img) { imageCache[imageHash] = null; imagesFailed++; return null; }
      const bytes = await img.getBytesAsync();
      if (bytes.length > MAX_IMAGE_BYTES) {
        imagesSkippedTooLarge++;
        imageCache[imageHash] = null;
        imageSkipBytes[imageHash] = bytes.length;
        return null;
      }
      const mime = sniffImageMime(bytes);
      const b64 = bytesToBase64(bytes);
      const url = `data:${mime};base64,${b64}`;
      imagesInlinedBytes += bytes.length;
      imageCache[imageHash] = url;
      return url;
    } catch (e) {
      imagesFailed++;
      imageCache[imageHash] = null;
      return null;
    }
  }

  const SVG_NODE_TYPES = ['VECTOR', 'BOOLEAN_OPERATION', 'LINE', 'STAR', 'POLYGON'];
  let svgsExported = 0;
  let svgsFailed = 0;

  function bytesToUtf8(bytes) {
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder('utf-8').decode(bytes);
    }
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return s;
  }

  async function exportSvgString(node) {
    try {
      const bytes = await node.exportAsync({ format: 'SVG' });
      svgsExported++;
      return bytesToUtf8(bytes);
    } catch (e) {
      svgsFailed++;
      return null;
    }
  }

  function extractEffects(node) {
    if (!('effects' in node) || !Array.isArray(node.effects)) return [];
    const out = [];
    for (const e of node.effects) {
      if (e.visible === false) continue;
      if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
        const { r, g, b } = e.color;
        const a = e.color.a != null ? e.color.a : 1;
        out.push({
          type: e.type,
          offset: { x: e.offset.x, y: e.offset.y },
          radius: e.radius,
          spread: e.spread || 0,
          color: `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`,
          blendMode: e.blendMode || 'NORMAL',
        });
      } else if (e.type === 'LAYER_BLUR' || e.type === 'BACKGROUND_BLUR') {
        out.push({ type: e.type, radius: e.radius });
      }
    }
    return out;
  }

  function boundVariableName(node, field, index) {
    const bv = node.boundVariables;
    if (!bv || !bv[field]) return null;
    const alias = Array.isArray(bv[field]) ? bv[field][index || 0] : bv[field];
    if (!alias || alias.type !== 'VARIABLE_ALIAS') return null;
    const v = figma.variables.getVariableById(alias.id);
    return v ? v.name : null;
  }

  function numericWithToken(node, field, raw) {
    const out = { value: typeof raw === 'number' ? raw : null };
    const tok = boundVariableName(node, field);
    if (tok) out.token = tok;
    return out;
  }

  async function extractPaintsAsync(node, field) {
    const list = field === 'strokes' ? node.strokes : node.fills;
    if (!Array.isArray(list)) return [];
    const out = [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f || f.visible === false) continue;

      if (f.type === 'SOLID') {
        const hex = fillToHex(f);
        if (!hex) continue;
        const entry = { type: 'SOLID', color: hex.color, opacity: hex.opacity };
        const tok = boundVariableName(node, field, i);
        if (tok) entry.token = tok;
        out.push(entry);
      } else if (f.type && f.type.indexOf('GRADIENT_') === 0) {
        const css = gradientToCss(f);
        if (!css) continue;
        out.push({
          type: f.type,
          css,
          stops: f.gradientStops.map((s) => ({
            position: s.position,
            color: rgbaStop(s),
          })),
          opacity: f.opacity != null ? f.opacity : 1,
        });
      } else if (f.type === 'IMAGE') {
        const src = f.imageHash ? await imageBytesToDataUrl(f.imageHash) : null;
        const skipped = f.imageHash && src === null && imageSkipBytes[f.imageHash] != null;
        out.push({
          type: 'IMAGE',
          scaleMode: f.scaleMode || 'FILL',
          opacity: f.opacity != null ? f.opacity : 1,
          src, // may be null if skipped/failed — renderer can fall back
          imageHash: f.imageHash,
          skipped: !!skipped,
          bytes: skipped ? imageSkipBytes[f.imageHash] : undefined,
        });
      }
    }
    return out;
  }

  function extractText(node) {
    if (node.type !== 'TEXT') return undefined;
    const firstFill = Array.isArray(node.fills) && node.fills[0] ? fillToHex(node.fills[0]) : null;
    const fontNameObj = typeof node.fontName === 'object' && node.fontName !== null ? node.fontName : null;
    const lhObj = typeof node.lineHeight === 'object' && node.lineHeight !== null ? node.lineHeight : null;
    const lsObj = typeof node.letterSpacing === 'object' && node.letterSpacing !== null ? node.letterSpacing : null;
    const fontSizeVal = typeof node.fontSize === 'number' ? node.fontSize : null;

    const out = {
      characters: node.characters || '',
      fontSize: numericWithToken(node, 'fontSize', fontSizeVal),
      fontFamily: fontNameObj ? fontNameObj.family : null,
      fontStyle: fontNameObj ? fontNameObj.style : null,
      lineHeight: lhObj ? { value: lhObj.value, unit: lhObj.unit } : { unit: 'AUTO' },
      letterSpacing: lsObj ? { value: lsObj.value, unit: lsObj.unit } : null,
      textAlignHorizontal: node.textAlignHorizontal || 'LEFT',
      textAlignVertical: node.textAlignVertical || 'TOP',
      textDecoration: node.textDecoration || 'NONE',
      color: firstFill ? firstFill.color : null,
      // textAutoResize controls whether Figma allows the text box to wrap.
      //   NONE              → both axes fixed, may wrap inside the box
      //   HEIGHT            → width fixed, height grows (wrap allowed)
      //   WIDTH_AND_HEIGHT  → neither axis fixed (single-line, no wrap)
      //   TRUNCATE          → fixed box, clipped with ellipsis
      // The renderer uses this to decide between `white-space: nowrap` vs
      // `pre-wrap` so icon labels like "Date" don't wrap when the local
      // font metrics slightly exceed Figma's recorded text width.
      textAutoResize: node.textAutoResize || 'NONE',
    };
    const colorTok = boundVariableName(node, 'fills', 0);
    if (colorTok) out.colorToken = colorTok;
    const lhTok = boundVariableName(node, 'lineHeight');
    if (lhTok) out.lineHeight.token = lhTok;
    const lsTok = boundVariableName(node, 'letterSpacing');
    if (lsTok && out.letterSpacing) out.letterSpacing.token = lsTok;
    return out;
  }

  function extractLayout(node) {
    if (!('layoutMode' in node)) return undefined;
    const out = {
      mode: node.layoutMode || 'NONE',
      primaryAxisAlign: node.primaryAxisAlignItems,
      counterAxisAlign: node.counterAxisAlignItems,
      primaryAxisSizing: node.primaryAxisSizingMode,
      counterAxisSizing: node.counterAxisSizingMode,
      itemSpacing: numericWithToken(node, 'itemSpacing', node.itemSpacing),
      padding: {
        top: numericWithToken(node, 'paddingTop', node.paddingTop),
        right: numericWithToken(node, 'paddingRight', node.paddingRight),
        bottom: numericWithToken(node, 'paddingBottom', node.paddingBottom),
        left: numericWithToken(node, 'paddingLeft', node.paddingLeft),
      },
    };
    // Wrap mode — Figma adds this to horizontal auto-layout frames so a row
    // of cards reflows into multiple lines. Renderer uses `flex-wrap`.
    if ('layoutWrap' in node && node.layoutWrap && node.layoutWrap !== 'NO_WRAP') {
      out.wrap = node.layoutWrap;
      if ('counterAxisSpacing' in node && typeof node.counterAxisSpacing === 'number') {
        out.counterAxisSpacing = numericWithToken(node, 'counterAxisSpacing', node.counterAxisSpacing);
      }
    }
    // Figma 2024+ introduced native CSS-grid auto-layout (`layoutMode:GRID`).
    // Capture grid-specific metadata so the renderer can use `display:grid`
    // instead of flex. Properties gated on feature detection to stay
    // backwards-compatible with older plugin API hosts.
    if (node.layoutMode === 'GRID') {
      if ('gridColumnCount' in node) out.gridColumnCount = node.gridColumnCount;
      if ('gridRowCount' in node) out.gridRowCount = node.gridRowCount;
      if ('gridColumnsSizingMode' in node) out.gridColumnsSizing = node.gridColumnsSizingMode;
      if ('gridRowsSizingMode' in node) out.gridRowsSizing = node.gridRowsSizingMode;
      if ('gridColumnsGap' in node) out.gridColumnsGap = numericWithToken(node, 'gridColumnsGap', node.gridColumnsGap);
      if ('gridRowsGap' in node) out.gridRowsGap = numericWithToken(node, 'gridRowsGap', node.gridRowsGap);
    }
    return out;
  }

  async function extractStyleAsync(node) {
    const style = {};
    const fills = await extractPaintsAsync(node, 'fills');
    if (fills.length) style.fills = fills;
    const strokes = await extractPaintsAsync(node, 'strokes');
    if (strokes.length) {
      style.strokes = strokes;
      if ('strokeWeight' in node) {
        style.strokeWeight = numericWithToken(node, 'strokeWeight', node.strokeWeight);
      }
      if ('strokeAlign' in node) style.strokeAlign = node.strokeAlign;
    }
    if ('cornerRadius' in node) {
      if (typeof node.cornerRadius === 'number') {
        style.cornerRadius = { all: numericWithToken(node, 'cornerRadius', node.cornerRadius) };
      } else {
        style.cornerRadius = {
          topLeft: numericWithToken(node, 'topLeftRadius', node.topLeftRadius),
          topRight: numericWithToken(node, 'topRightRadius', node.topRightRadius),
          bottomRight: numericWithToken(node, 'bottomRightRadius', node.bottomRightRadius),
          bottomLeft: numericWithToken(node, 'bottomLeftRadius', node.bottomLeftRadius),
        };
      }
    }
    if ('opacity' in node && node.opacity !== 1) style.opacity = node.opacity;
    if ('blendMode' in node && node.blendMode && node.blendMode !== 'PASS_THROUGH' && node.blendMode !== 'NORMAL') {
      style.blendMode = node.blendMode;
    }
    if ('clipsContent' in node) style.clipsContent = !!node.clipsContent;
    // Rotation: Figma stores it in radians on `node.rotation` for visual
    // nodes. Only emit if non-zero to keep the JSON compact.
    if ('rotation' in node && typeof node.rotation === 'number' && Math.abs(node.rotation) > 0.0001) {
      // Figma's `rotation` is already in DEGREES despite the docs' old wording
      // — confirmed via plugin API since 2020. Normalize to [-180, 180).
      let deg = node.rotation;
      while (deg > 180) deg -= 360;
      while (deg <= -180) deg += 360;
      style.rotation = +deg.toFixed(2);
    }
    // Mask nodes: the renderer hides these by default (they overlay siblings
    // in Figma, but we can't reproduce the sibling-mask effect in CSS without
    // precise image masks). Flagging so we can opt into a crude approximation
    // later and so the docs are aware of it.
    if ('isMask' in node && node.isMask) {
      style.isMask = true;
      if ('maskType' in node && node.maskType) style.maskType = node.maskType;
    }
    const effects = extractEffects(node);
    if (effects.length) style.effects = effects;
    return Object.keys(style).length ? style : undefined;
  }

  // `parentAbs` is the parent node's absolute page position, used to compute
  // a child's position relative to the parent's top-left. This is necessary
  // because Figma's `node.x`/`node.y` is only relative for FRAME-like parents;
  // for GROUP parents it's pass-through (i.e. relative to the grandparent),
  // which caused stacked cards in the renderer. Using `absoluteTransform`
  // deltas gives a uniform, parent-local coordinate for every node type.
  async function extractTreeNodeAsync(node, parentAbs) {
    const absTransform = ('absoluteTransform' in node && node.absoluteTransform) ? node.absoluteTransform : null;
    const abs = absTransform
      ? { x: absTransform[0][2], y: absTransform[1][2] }
      : null;

    const out = {
      id: node.id,
      name: node.name || '(unnamed)',
      type: node.type,
      visible: node.visible !== false,
    };
    if ('width' in node && 'height' in node) {
      out.size = { width: Math.round(node.width), height: Math.round(node.height) };
    }
    if (abs && parentAbs) {
      out.position = {
        x: Math.round(abs.x - parentAbs.x),
        y: Math.round(abs.y - parentAbs.y),
      };
    } else if (abs) {
      // Root node — position relative to its own origin is (0, 0) by
      // definition; we keep the field so the renderer can use a consistent
      // shape.
      out.position = { x: 0, y: 0 };
    } else if ('x' in node && 'y' in node) {
      // Fallback for nodes without `absoluteTransform` (rare; e.g. some
      // leaves inside boolean ops). Use the raw x/y — caveats as before.
      out.position = { x: Math.round(node.x), y: Math.round(node.y) };
    }
    const layout = extractLayout(node);
    if (layout) out.layout = layout;
    const style = await extractStyleAsync(node);
    if (style) out.style = style;
    const text = extractText(node);
    if (text) out.text = text;
    if (node.type === 'INSTANCE' && node.mainComponent) {
      const component = {
        key: node.mainComponent.key,
        name: node.mainComponent.name,
      };
      // `componentPropertyReferences` tells us which text/visibility/instance
      // slots of the component are driven by a prop on the parent set.
      try {
        if (node.componentProperties && typeof node.componentProperties === 'object') {
          const props = {};
          for (const key of Object.keys(node.componentProperties)) {
            const p = node.componentProperties[key];
            if (!p) continue;
            // Drop `preferredValues` and other heavy fields — we only need the
            // resolved value + type for downstream mapping.
            props[key] = { type: p.type, value: p.value };
          }
          if (Object.keys(props).length) component.properties = props;
        }
      } catch (_e) { /* ignore */ }
      // `overrides` is an array of { id, overriddenFields } — tells the
      // renderer which descendants differ from their main-component defaults.
      // We keep it compact; downstream DS-component mapping can use it to
      // decide whether to fall back to a raw render.
      try {
        if (Array.isArray(node.overrides) && node.overrides.length) {
          component.overrides = node.overrides.slice(0, 200).map(function (o) {
            return { id: o.id, fields: o.overriddenFields };
          });
        }
      } catch (_e) { /* ignore */ }
      out.component = component;
    }

    // Leaf shapes → inline SVG. Containers (FRAME/GROUP/INSTANCE/COMPONENT)
    // render via CSS; their children are walked recursively below.
    if (SVG_NODE_TYPES.indexOf(node.type) !== -1) {
      const svg = await exportSvgString(node);
      if (svg) out.svg = svg;
    }

    if ('children' in node && node.children && node.children.length) {
      out.children = [];
      for (const c of node.children) {
        // Pass THIS node's absolute position so the child can compute a
        // parent-local delta. This is the single fix that makes cards inside
        // a GROUP (no own coord system) land in the right place.
        out.children.push(await extractTreeNodeAsync(c, abs));
      }
    }
    return out;
  }

  const tree = await extractTreeNodeAsync(target);

  const byCategory = { colors: [], typography: [], spacing: [], sizing: [], radii: [], effects: [], other: [] };
  for (const id in uniqueVars) {
    const v = uniqueVars[id];
    byCategory[v.category].push(v);
  }
  for (const k in byCategory) {
    byCategory[k].sort((a, b) => a.name.localeCompare(b.name));
  }

  const categoryLabels = {
    colors: 'Colors',
    typography: 'Typography',
    spacing: 'Spacing',
    sizing: 'Sizing',
    radii: 'Border radii',
    effects: 'Effects & opacity',
    other: 'Other',
  };

  // Build Markdown doc
  const md = [];
  md.push(`# ${target.name}`);
  md.push('');
  md.push(`**Type:** ${target.type}`);
  md.push(`**Size:** ${Math.round(target.width)} × ${Math.round(target.height)} px`);
  md.push(`**Unique variables used:** ${Object.keys(uniqueVars).length}`);
  md.push(`**Total variable bindings:** ${usage.length}`);
  md.push('');
  md.push('---');
  md.push('');
  md.push('## Variables by category');
  md.push('');
  let hasAny = false;
  for (const k of ['colors', 'typography', 'spacing', 'sizing', 'radii', 'effects', 'other']) {
    const list = byCategory[k];
    if (!list.length) continue;
    hasAny = true;
    md.push(`### ${categoryLabels[k]}`);
    md.push('');
    for (const v of list) {
      md.push(`- \`${v.name}\` — ${v.type.toLowerCase()} · ${v.valueFormatted} · _${v.collection}_`);
    }
    md.push('');
  }
  if (!hasAny) {
    md.push('_No bound Figma variables detected in this frame._');
    md.push('');
  }

  md.push('---');
  md.push('');
  md.push('## Bindings per node');
  md.push('');
  const byPath = {};
  for (const u of usage) {
    if (!byPath[u.path]) byPath[u.path] = [];
    byPath[u.path].push(u);
  }
  const paths = Object.keys(byPath);
  if (!paths.length) {
    md.push('_No variable bindings found on any descendant node._');
    md.push('');
  } else {
    for (const path of paths) {
      md.push(`#### ${path}`);
      for (const u of byPath[path]) {
        md.push(`- **${u.field}** → \`${u.variableName}\` (${u.variableValue}) · _${u.variableCollection}_`);
      }
      md.push('');
    }
  }

  md.push('---');
  md.push('');
  md.push('## Machine-readable summary');
  md.push('');
  const summary = {
    frame: {
      name: target.name,
      type: target.type,
      width: Math.round(target.width),
      height: Math.round(target.height),
    },
    stats: {
      uniqueVariables: Object.keys(uniqueVars).length,
      totalBindings: usage.length,
    },
    variables: Object.keys(uniqueVars).map((id) => {
      const v = uniqueVars[id];
      return {
        name: v.name,
        type: v.type,
        collection: v.collection,
        value: v.valueFormatted,
        category: v.category,
      };
    }),
    bindings: usage,
    tree,
    schemaVersion: 4,
    extraction: {
      svgsExported,
      svgsFailed,
      imagesInlinedBytes,
      imagesSkippedTooLarge,
      imagesFailed,
      maxImageBytes: MAX_IMAGE_BYTES,
    },
  };
  md.push('```json');
  md.push(JSON.stringify(summary, null, 2));
  md.push('```');

  // Compose the per-category counts for the on-canvas summary card.
  const categoryCounts = [];
  for (const k of ['colors', 'typography', 'spacing', 'sizing', 'radii', 'effects', 'other']) {
    if (byCategory[k].length) {
      categoryCounts.push(`${categoryLabels[k]}: ${byCategory[k].length}`);
    }
  }

  const GAP = 64;
  const DOC_W = 360; // narrow summary card — heavy content goes to the plugin UI instead
  const bbox = target.absoluteBoundingBox || { x: target.x, y: target.y, width: target.width, height: target.height };

  const doc = figma.createFrame();
  doc.name = `Docs — ${target.name}`;
  doc.resize(DOC_W, 1);
  doc.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  doc.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.92 } }];
  doc.strokeWeight = 1;
  doc.cornerRadius = 14;
  doc.layoutMode = 'VERTICAL';
  doc.primaryAxisSizingMode = 'AUTO';
  doc.counterAxisSizingMode = 'FIXED';
  doc.paddingTop = 22;
  doc.paddingBottom = 22;
  doc.paddingLeft = 22;
  doc.paddingRight = 22;
  doc.itemSpacing = 10;

  const header = figma.createText();
  header.fontName = { family: 'Inter', style: 'Bold' };
  header.fontSize = 16;
  header.characters = `Docs — ${target.name}`;
  header.layoutAlign = 'STRETCH';
  doc.appendChild(header);

  const sub = figma.createText();
  sub.fontName = { family: 'Inter', style: 'Regular' };
  sub.fontSize = 11;
  sub.fills = [{ type: 'SOLID', color: { r: 0.44, g: 0.44, b: 0.48 } }];
  sub.characters = `${Object.keys(uniqueVars).length} unique variables · ${usage.length} bindings`;
  sub.layoutAlign = 'STRETCH';
  doc.appendChild(sub);

  if (categoryCounts.length) {
    const cats = figma.createText();
    cats.fontName = { family: 'Inter', style: 'Regular' };
    cats.fontSize = 11;
    cats.lineHeight = { value: 16, unit: 'PIXELS' };
    cats.fills = [{ type: 'SOLID', color: { r: 0.25, g: 0.25, b: 0.3 } }];
    cats.characters = categoryCounts.join('\n');
    cats.layoutAlign = 'STRETCH';
    doc.appendChild(cats);
  }

  const hint = figma.createText();
  hint.fontName = { family: 'Inter', style: 'Medium' };
  hint.fontSize = 10;
  hint.lineHeight = { value: 14, unit: 'PIXELS' };
  hint.fills = [{ type: 'SOLID', color: { r: 0.32, g: 0.32, b: 0.78 } }];
  hint.characters = 'Full markdown available in the plugin panel →\nCopy to clipboard or Download .md';
  hint.layoutAlign = 'STRETCH';
  doc.appendChild(hint);

  figma.currentPage.appendChild(doc);
  doc.x = bbox.x + bbox.width + GAP;
  doc.y = bbox.y;
  figma.currentPage.selection = [doc];
  figma.viewport.scrollAndZoomIntoView([target, doc]);

  const safeName = String(target.name || 'frame')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase() || 'frame';

  return {
    uniqueCount: Object.keys(uniqueVars).length,
    bindingCount: usage.length,
    markdown: md.join('\n'),
    filename: `${safeName}-docs.md`,
  };
}

// ─── APPLY VARIABLES TO SELECTION (template agent) ─────────────────────────

function rgbEq(a, b) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  const ah = `${toHex(a.r)}${toHex(a.g)}${toHex(a.b)}`.toLowerCase();
  const bh = `${toHex(b.r)}${toHex(b.g)}${toHex(b.b)}`.toLowerCase();
  return ah === bh;
}

function hexKeyFromRgb(c) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`.toLowerCase();
}

function resolveVariableValue(variable, modeId) {
  let v = variable;
  let value = v.valuesByMode[modeId];
  let guard = 0;
  while (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS' && guard < 8) {
    const next = figma.variables.getVariableById(value.id);
    if (!next) return null;
    const coll = figma.variables.getVariableCollectionById(next.variableCollectionId);
    const nextModeId = coll ? coll.defaultModeId : modeId;
    value = next.valuesByMode[nextModeId];
    v = next;
    guard++;
  }
  return value;
}

function buildVariableIndex() {
  const all = figma.variables.getLocalVariables();
  const colorByHex = {};
  const colors = [];
  const floats = [];
  for (const v of all) {
    const coll = figma.variables.getVariableCollectionById(v.variableCollectionId);
    if (!coll) continue;
    const modeId = coll.defaultModeId;
    const value = resolveVariableValue(v, modeId);
    if (value === null || value === undefined) continue;
    if (v.resolvedType === 'COLOR' && typeof value === 'object' && 'r' in value) {
      const key = hexKeyFromRgb(value);
      if (!colorByHex[key]) colorByHex[key] = v;
      colors.push({ variable: v, rgb: { r: value.r, g: value.g, b: value.b }, hex: key, collection: coll.name });
    } else if (v.resolvedType === 'FLOAT' && typeof value === 'number') {
      floats.push({ variable: v, value, name: v.name.toLowerCase(), collection: coll.name });
    }
  }
  return { colorByHex, colors, floats };
}

// Field → preferred category hints for float matching.
const FIELD_CATEGORY = {
  topLeftRadius: 'radius',
  topRightRadius: 'radius',
  bottomLeftRadius: 'radius',
  bottomRightRadius: 'radius',
  cornerRadius: 'radius',
  paddingTop: 'spacing',
  paddingBottom: 'spacing',
  paddingLeft: 'spacing',
  paddingRight: 'spacing',
  itemSpacing: 'spacing',
  counterAxisSpacing: 'spacing',
  horizontalPadding: 'spacing',
  verticalPadding: 'spacing',
  width: 'sizing',
  height: 'sizing',
  minWidth: 'sizing',
  maxWidth: 'sizing',
  minHeight: 'sizing',
  maxHeight: 'sizing',
  fontSize: 'fontSize',
  lineHeight: 'lineHeight',
  letterSpacing: 'letterSpacing',
  paragraphSpacing: 'spacing',
  strokeWeight: 'borderWidth',
  opacity: 'opacity',
};

function matchesCategory(cat, nameLower, collLower) {
  switch (cat) {
    case 'radius':
      return /radius|radii|rounded/.test(nameLower) || /radius|rounded/.test(collLower);
    case 'spacing':
      return /spacing|space|gap|padding|margin|\bp[trblxy]?-|\bm[trblxy]?-|gap(-[xy])?-/.test(nameLower);
    case 'sizing':
      return /sizing|size|width|height|w-|h-|max-|min-/.test(nameLower);
    case 'fontSize':
      return /font-?size|\btext\b|text-/.test(nameLower);
    case 'lineHeight':
      return /leading|line-?height/.test(nameLower);
    case 'letterSpacing':
      return /tracking|letter-?spacing/.test(nameLower);
    case 'borderWidth':
      return /border|stroke/.test(nameLower);
    case 'opacity':
      return /opacity|alpha/.test(nameLower);
    default:
      return false;
  }
}

function findFloatVariable(floats, field, value, opts) {
  const tolerance = 0.01;
  const snap = !!(opts && opts.snap);
  const cat = FIELD_CATEGORY[field];

  // Category-aware pool first so fuzzy mapping never snaps, e.g., paddingTop=16
  // onto a fontSize variable that happens to be 16 too.
  let pool = floats;
  if (cat) {
    const preferred = floats.filter((f) => matchesCategory(cat, f.name, f.collection.toLowerCase()));
    if (preferred.length > 0) pool = preferred;
  }

  let bestExact = null;
  let bestExactDiff = Infinity;
  let bestNearest = null;
  let bestNearestDiff = Infinity;
  for (const f of pool) {
    const diff = Math.abs(f.value - value);
    if (diff <= tolerance && diff < bestExactDiff) {
      bestExact = f;
      bestExactDiff = diff;
    }
    if (diff < bestNearestDiff) {
      bestNearest = f;
      bestNearestDiff = diff;
    }
  }
  if (bestExact) return { variable: bestExact.variable, snapped: false, delta: 0, targetValue: bestExact.value };
  if (snap && bestNearest) {
    return { variable: bestNearest.variable, snapped: true, delta: bestNearestDiff, targetValue: bestNearest.value };
  }
  return null;
}

function findColorVariable(colorIndex, paintColor, opts) {
  const key = hexKeyFromRgb(paintColor);
  const exact = colorIndex.byHex[key];
  if (exact) return { variable: exact, snapped: false, deltaHex: null, targetHex: key };
  if (!(opts && opts.snap) || !colorIndex.list.length) return null;

  let best = null;
  let bestDist = Infinity;
  for (const entry of colorIndex.list) {
    const dr = (entry.rgb.r - paintColor.r);
    const dg = (entry.rgb.g - paintColor.g);
    const db = (entry.rgb.b - paintColor.b);
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < bestDist) {
      bestDist = dist;
      best = entry;
    }
  }
  if (!best) return null;
  return { variable: best.variable, snapped: true, deltaHex: bestDist, targetHex: best.hex };
}

function bindFillsOrStrokes(node, fieldName, colorIndex, path, changes, opts) {
  const paints = node[fieldName];
  if (!paints || paints === figma.mixed || !Array.isArray(paints) || paints.length === 0) {
    return 0;
  }
  let bound = 0;
  const next = paints.map((paint, idx) => {
    if (!paint || paint.type !== 'SOLID') return paint;
    const existing = paint.boundVariables && paint.boundVariables.color;
    if (existing) return paint;
    const match = findColorVariable(colorIndex, paint.color, opts);
    if (!match) return paint;
    const key = hexKeyFromRgb(paint.color);
    bound++;
    if (changes) {
      const coll = figma.variables.getVariableCollectionById(match.variable.variableCollectionId);
      const arrow = match.snapped
        ? ` ≈ #${match.targetHex.toUpperCase()}`
        : '';
      changes.push({
        kind: 'color',
        path,
        field: paints.length > 1 ? `${fieldName}[${idx}]` : fieldName,
        oldValue: `#${key.toUpperCase()}${arrow}`,
        variableName: match.variable.name,
        collection: coll ? coll.name : '',
        snapped: match.snapped,
      });
    }
    return figma.variables.setBoundVariableForPaint(paint, 'color', match.variable);
  });
  if (bound > 0) node[fieldName] = next;
  return bound;
}

function tryBindFloat(node, field, floats, path, changes, opts) {
  try {
    const value = node[field];
    if (typeof value !== 'number') return false;
    const existing = node.boundVariables && node.boundVariables[field];
    if (existing) return false;
    const match = findFloatVariable(floats, field, value, opts);
    if (!match) return false;
    node.setBoundVariable(field, match.variable);
    if (changes) {
      const coll = figma.variables.getVariableCollectionById(match.variable.variableCollectionId);
      const oldValue = match.snapped
        ? `${value} ≈ ${match.targetValue}`
        : String(value);
      changes.push({
        kind: 'float',
        path,
        field,
        oldValue,
        variableName: match.variable.name,
        collection: coll ? coll.name : '',
        snapped: match.snapped,
      });
    }
    return true;
  } catch (_) {
    return false;
  }
}

function bumpCounter(report, key) {
  report.floatsBound++;
  report.byField[key] = (report.byField[key] || 0) + 1;
}

function applyVariablesToNode(node, index, report, stack, opts) {
  report.nodesVisited++;
  const here = stack.concat([node.name || node.type]);
  const path = here.join(' ▸ ');
  const colorIndex = { byHex: index.colorByHex, list: index.colors };

  if ('fills' in node) {
    const bound = bindFillsOrStrokes(node, 'fills', colorIndex, path, report.changes, opts);
    report.colorsBound += bound;
  }
  if ('strokes' in node) {
    const bound = bindFillsOrStrokes(node, 'strokes', colorIndex, path, report.changes, opts);
    report.colorsBound += bound;
  }

  if ('cornerRadius' in node) {
    const cr = node.cornerRadius;
    if (typeof cr === 'number') {
      if (tryBindFloat(node, 'cornerRadius', index.floats, path, report.changes, opts)) bumpCounter(report, 'cornerRadius');
    } else {
      for (const field of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) {
        if (field in node && tryBindFloat(node, field, index.floats, path, report.changes, opts)) bumpCounter(report, field);
      }
    }
  }

  const isAutoLayout = ('layoutMode' in node) && node.layoutMode && node.layoutMode !== 'NONE';
  if (isAutoLayout) {
    for (const field of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
      if (field in node && tryBindFloat(node, field, index.floats, path, report.changes, opts)) bumpCounter(report, field);
    }
    if ('itemSpacing' in node && node.primaryAxisAlignItems !== 'SPACE_BETWEEN') {
      if (tryBindFloat(node, 'itemSpacing', index.floats, path, report.changes, opts)) bumpCounter(report, 'itemSpacing');
    }
    if ('counterAxisSpacing' in node && node.layoutWrap === 'WRAP') {
      if (tryBindFloat(node, 'counterAxisSpacing', index.floats, path, report.changes, opts)) bumpCounter(report, 'counterAxisSpacing');
    }
  }

  for (const field of ['minWidth', 'maxWidth', 'minHeight', 'maxHeight']) {
    if (field in node && tryBindFloat(node, field, index.floats, path, report.changes, opts)) bumpCounter(report, field);
  }

  if ('strokeWeight' in node && tryBindFloat(node, 'strokeWeight', index.floats, path, report.changes, opts)) {
    bumpCounter(report, 'strokeWeight');
  }

  if (node.type === 'TEXT') {
    if (typeof node.fontSize === 'number') {
      if (tryBindFloat(node, 'fontSize', index.floats, path, report.changes, opts)) bumpCounter(report, 'fontSize');
    }
    for (const field of ['lineHeight', 'letterSpacing']) {
      const v = node[field];
      if (!v || v === figma.mixed || typeof v !== 'object') continue;
      if (v.unit !== 'PIXELS') continue;
      const existing = node.boundVariables && node.boundVariables[field];
      if (existing) continue;
      const match = findFloatVariable(index.floats, field, v.value, opts);
      if (!match) continue;
      try {
        node.setBoundVariable(field, match.variable);
        const coll = figma.variables.getVariableCollectionById(match.variable.variableCollectionId);
        const oldValue = match.snapped
          ? `${v.value}px ≈ ${match.targetValue}px`
          : `${v.value}px`;
        report.changes.push({
          kind: 'float', path, field,
          oldValue,
          variableName: match.variable.name,
          collection: coll ? coll.name : '',
          snapped: match.snapped,
        });
        bumpCounter(report, field);
      } catch (_) {}
    }
    if (typeof node.paragraphSpacing === 'number') {
      if (tryBindFloat(node, 'paragraphSpacing', index.floats, path, report.changes, opts)) bumpCounter(report, 'paragraphSpacing');
    }
  }

  if ('children' in node) {
    for (const child of node.children) applyVariablesToNode(child, index, report, here, opts);
  }
}

async function applyVariablesToSelection(summaryOptions, mappingOptions) {
  const selection = figma.currentPage.selection;
  if (!selection || selection.length === 0) {
    throw new Error('Select a frame or layer first.');
  }
  const target = selection[0];

  const index = buildVariableIndex();
  const colorCount = Object.keys(index.colorByHex).length;
  if (colorCount === 0 && index.floats.length === 0) {
    throw new Error('No local variables found. Create variables first (use the first accordion).');
  }

  const mapping = mappingOptions || { snap: false };
  const report = { colorsBound: 0, floatsBound: 0, nodesVisited: 0, byField: {}, changes: [], snap: !!mapping.snap };
  applyVariablesToNode(target, index, report, [], mapping);

  const opts = summaryOptions || { basic: true, log: false, json: false };
  if (opts.basic || opts.log || opts.json) {
    await createApplySummaryFrame(target, report, opts);
  }
  return report;
}

async function createApplySummaryFrame(target, report, opts) {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const group = (keys) => keys.reduce((sum, k) => sum + (report.byField[k] || 0), 0);
  const padCount = group(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']);
  const gapCount = group(['itemSpacing', 'counterAxisSpacing']);
  const radiusCount = group(['cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']);
  const sizeCount = group(['minWidth', 'maxWidth', 'minHeight', 'maxHeight']);
  const textCount = group(['fontSize', 'lineHeight', 'letterSpacing', 'paragraphSpacing']);
  const strokeCount = group(['strokeWeight']);

  // Group changes by the "kind" of binding for a clean per-category list
  const groups = {
    Colors: [],
    Padding: [],
    Gap: [],
    'Corner radius': [],
    Sizing: [],
    'Stroke weight': [],
    Typography: [],
    Other: [],
  };
  for (const c of report.changes) {
    if (c.kind === 'color') groups['Colors'].push(c);
    else if (/^padding/.test(c.field)) groups['Padding'].push(c);
    else if (c.field === 'itemSpacing' || c.field === 'counterAxisSpacing') groups['Gap'].push(c);
    else if (/Radius$/.test(c.field)) groups['Corner radius'].push(c);
    else if (/^(min|max)(Width|Height)$/.test(c.field)) groups['Sizing'].push(c);
    else if (c.field === 'strokeWeight') groups['Stroke weight'].push(c);
    else if (/fontSize|lineHeight|letterSpacing|paragraphSpacing/.test(c.field)) groups['Typography'].push(c);
    else groups['Other'].push(c);
  }

  const GAP = 64;
  const DOC_W = 720;
  const bbox = target.absoluteBoundingBox || { x: target.x, y: target.y, width: target.width, height: target.height };

  const doc = figma.createFrame();
  doc.name = `Applied — ${target.name}`;
  doc.resize(DOC_W, 400);
  doc.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  doc.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.92 } }];
  doc.strokeWeight = 1;
  doc.cornerRadius = 14;
  doc.layoutMode = 'VERTICAL';
  doc.primaryAxisSizingMode = 'AUTO';
  doc.counterAxisSizingMode = 'FIXED';
  doc.paddingTop = 28;
  doc.paddingBottom = 28;
  doc.paddingLeft = 28;
  doc.paddingRight = 28;
  doc.itemSpacing = 0;

  const header = figma.createText();
  header.fontName = { family: 'Inter', style: 'Bold' };
  header.fontSize = 18;
  header.characters = `Applied variables — ${target.name}`;
  doc.appendChild(header);

  const sub = figma.createText();
  sub.fontName = { family: 'Inter', style: 'Regular' };
  sub.fontSize = 12;
  sub.fills = [{ type: 'SOLID', color: { r: 0.44, g: 0.44, b: 0.48 } }];
  sub.characters = `${report.colorsBound + report.floatsBound} total bindings across ${report.nodesVisited} nodes`;
  doc.appendChild(sub);

  const spacer = figma.createFrame();
  spacer.resize(1, 14);
  spacer.fills = [];
  doc.appendChild(spacer);

  // Build markdown-style body based on the requested sections
  const md = [];

  const snappedCount = (report.changes || []).filter((c) => c.snapped).length;
  const exactCount = (report.changes || []).length - snappedCount;

  if (opts.basic) {
    md.push('## Summary');
    md.push('');
    md.push(`- Mapping mode: ${report.snap ? '**Snap to nearest** (exact + approximate matches)' : '**Exact-only**'}`);
    md.push(`- Exact bindings: ${exactCount}`);
    md.push(`- Snapped bindings: ${snappedCount}`);
    md.push('');
    const bullets = [];
    if (report.colorsBound) bullets.push(`- Colors: ${report.colorsBound}`);
    if (padCount) bullets.push(`- Padding: ${padCount}`);
    if (gapCount) bullets.push(`- Gap: ${gapCount}`);
    if (radiusCount) bullets.push(`- Corner radius: ${radiusCount}`);
    if (sizeCount) bullets.push(`- Sizing: ${sizeCount}`);
    if (strokeCount) bullets.push(`- Stroke weight: ${strokeCount}`);
    if (textCount) bullets.push(`- Typography: ${textCount}`);
    if (bullets.length === 0) bullets.push('- No matching variables were found for any raw value.');
    md.push(bullets.join('\n'));
    md.push('');
  }

  if (opts.log) {
    md.push('## Log');
    md.push('');
    const groupOrder = ['Colors', 'Padding', 'Gap', 'Corner radius', 'Sizing', 'Stroke weight', 'Typography', 'Other'];
    let any = false;
    for (const key of groupOrder) {
      const list = groups[key];
      if (!list || list.length === 0) continue;
      any = true;
      md.push(`### ${key} (${list.length})`);
      md.push('');
      // Collapse duplicates by [path, field, variable] so the list stays readable
      const seen = new Set();
      for (const c of list) {
        const sig = `${c.path}|${c.field}|${c.variableName}`;
        if (seen.has(sig)) continue;
        seen.add(sig);
        const badge = c.snapped ? ' **[snapped]**' : '';
        md.push(`- **${c.path}** · \`${c.field}\`: ${c.oldValue} → \`${c.variableName}\`${c.collection ? ` _(${c.collection})_` : ''}${badge}`);
      }
      md.push('');
    }
    if (!any) {
      md.push('_No changes were applied._');
      md.push('');
    }
  }

  if (opts.json) {
    md.push('## Machine-readable summary');
    md.push('');
    md.push('```json');
    md.push(JSON.stringify({
      frame: { name: target.name, type: target.type },
      mapping: { mode: report.snap ? 'snap-to-nearest' : 'exact-only' },
      totals: {
        colors: report.colorsBound,
        padding: padCount,
        gap: gapCount,
        cornerRadius: radiusCount,
        sizing: sizeCount,
        strokeWeight: strokeCount,
        typography: textCount,
        exact: exactCount,
        snapped: snappedCount,
        nodesVisited: report.nodesVisited,
      },
      changes: report.changes,
    }, null, 2));
    md.push('```');
  }

  const body = figma.createText();
  body.fontName = { family: 'Inter', style: 'Regular' };
  body.fontSize = 12;
  body.lineHeight = { value: 18, unit: 'PIXELS' };
  body.characters = md.join('\n');
  body.textAutoResize = 'HEIGHT';
  body.layoutAlign = 'STRETCH';
  doc.appendChild(body);

  figma.currentPage.appendChild(doc);
  // Position AFTER appending so x/y are interpreted in page coords, placing
  // the summary next to the analysed frame regardless of nesting depth.
  doc.x = bbox.x + bbox.width + GAP;
  doc.y = bbox.y;
  figma.currentPage.selection = [doc];
  figma.viewport.scrollAndZoomIntoView([target, doc]);
}

// ─── PER-PRODUCT FOUNDATIONS ────────────────────────────────────────────────
// `web` is generated from the Zyte design system tokens (see block below).
// core/scrapy/extractSummit remain hand-maintained mirrors for now.
// Phase 2 (MCP): replace these with a `fetch(mcpServerUrl + '/foundations/' + id)` call.

// The web bundle below is the real design system (Zyte-design-system/packages/web).
// Regenerate with:  node scripts/gen-foundations.js
// <<<GEN:WEB_FOUNDATIONS START>>>
// Generated by scripts/gen-foundations.js from web tokens.json (v1.3).
// Do NOT edit by hand — re-run the generator instead. Source of truth:
// Zyte-design-system/packages/web/src/foundations.ts -> dist/tokens.json
const WEB_FOUNDATIONS_GENERATED_AT = "2026-06-23T08:41:37.269Z";
const WEB_FOUNDATIONS = {
    "label": "Web",
    "description": "zyte-website-nextjs — marketing site, blog, pricing.",
    "version": "1.3",
    "colors": {
      "surfaceDark": {
        "background": "#000000",
        "pageSections": "#060608",
        "secondary": "#0a0a0e",
        "cards": "#0d0d14"
      },
      "surfaceLight": {
        "background": "#f7f7f8",
        "pageSections": "#f0f0f2",
        "secondary": "#e8e8ec",
        "cards": "#ffffff"
      },
      "primary": {
        "50": "#fdf4ff",
        "100": "#fae8ff",
        "200": "#f5d0fe",
        "300": "#f0abfc",
        "400": "#e879f9",
        "500": "#b02cce",
        "600": "#c026d3",
        "700": "#a21caf",
        "800": "#86198f",
        "900": "#4a044e",
        "950": "#4a044e"
      },
      "secondary": {
        "50": "#eeeff3",
        "100": "#dddff3",
        "200": "#8c95ed",
        "300": "#3f4fed",
        "400": "#31235f",
        "500": "#181e5a",
        "600": "#13184c",
        "700": "#131745",
        "800": "#101339",
        "900": "#0b0d25",
        "950": "#070917"
      },
      "headlineGradient": {
        "DEFAULT": "linear-gradient(90deg, #e8520a 0%, #c026d3 100%)",
        "subtle": "linear-gradient(90deg, #f5d0fe 100%, #ffffff 100%)"
      },
      "heroGradient": {
        "DEFAULT": "linear-gradient(113.78deg, rgb(19, 20, 87) 39.45%, rgb(176, 44, 206) 108.24%)"
      },
      "accent": {
        "50": "#e3d3da",
        "100": "#e2b0c6",
        "200": "#e67eab",
        "300": "#e83281",
        "400": "#e60466",
        "500": "#db005f",
        "600": "#be0052",
        "700": "#990042",
        "800": "#6d002f",
        "900": "#540024",
        "950": "#330016"
      },
      "neutral": {
        "0": "#FFFFFF",
        "50": "#FAFAFA",
        "100": "#F5F5F5",
        "200": "#E5E5E5",
        "300": "#D4D4D4",
        "400": "#A3A3A3",
        "500": "#737373",
        "600": "#525252",
        "700": "#404040",
        "800": "#262626",
        "900": "#171717",
        "1000": "#000000"
      }
    },
    "semanticColors": {
      "brand": "primary",
      "accent": "accent",
      "surface": "neutral"
    },
    "typography": {
      "family": {
        "display": "var(--font-yellix), Yellix, sans-serif",
        "sans": "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
        "mono": "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
      },
      "size": {
        "xs": 12,
        "sm": 14,
        "base": 16,
        "lg": 18,
        "xl": 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
        "5xl": 48,
        "6xl": 60
      },
      "weight": {
        "light": 300,
        "regular": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      },
      "lineHeight": {
        "none": 1,
        "tight": 1.25,
        "snug": 1.375,
        "normal": 1.5,
        "relaxed": 1.625,
        "loose": 2
      },
      "letterSpacing": {
        "tighter": -0.8,
        "tight": -0.4,
        "normal": 0,
        "wide": 0.4,
        "wider": 0.8,
        "widest": 1.6
      }
    },
    "spacing": {
      "0": 0,
      "1": 4,
      "2": 8,
      "3": 12,
      "4": 16,
      "5": 20,
      "6": 24,
      "8": 32,
      "10": 40,
      "12": 48,
      "16": 64,
      "20": 80,
      "24": 96,
      "32": 128,
      "0.5": 2,
      "1.5": 6,
      "2.5": 10
    },
    "radius": {
      "DEFAULT": 4,
      "none": 0,
      "sm": 2,
      "md": 6,
      "lg": 8,
      "xl": 12,
      "2xl": 16,
      "full": 9999
    },
    "shadow": {
      "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    },
    "breakpoint": {
      "sm": 640,
      "md": 768,
      "lg": 1024,
      "xl": 1280,
      "2xl": 1536
    },
    "opacity": {
      "0": 0,
      "25": 0.25,
      "50": 0.5,
      "75": 0.75,
      "100": 1
    },
    "zIndex": {
      "0": 0,
      "10": 10,
      "20": 20,
      "30": 30,
      "40": 40,
      "50": 50
    }
  };
// <<<GEN:WEB_FOUNDATIONS END>>>

const PRODUCTS = [
  { id: 'web', label: 'Web' },
  { id: 'core', label: 'Core' },
  { id: 'scrapy', label: 'Scrapy' },
  { id: 'extractSummit', label: 'Extract Summit' },
];

const WEB_COLORS = {
  primary: {
    '50':'#FDF2F6','100':'#F7CCDF','200':'#E9669F','300':'#FF7AB4','400':'#E2337E',
    '500':'#DB005F','600':'#B5004F','700':'#7B0036','800':'#7A0035','900':'#3F0D23','950':'#260815',
  },
  accentPrimary: {
    '50':'#F4F5FA','100':'#EEEFF3','200':'#DDE0F3','300':'#C8DFE7',
    '500':'#8B95EE','600':'#3F4FED','700':'#181E5A','800':'#131746','900':'#0D0E2C',
  },
  accentSecondary: {
    '100':'#F9DAD9','200':'#F9C2C0','300':'#F97D78','500':'#F9433B',
    '600':'#DE271F','700':'#BD2C26','800':'#801813',
  },
  accentSecondaryPurple: {
    '50':'#F5DEFA','100':'#E2AFEE','200':'#DC64F7','500':'#B02CCE',
    '600':'#68137A','700':'#460D52','800':'#360A40',
  },
  neutral: {
    '0':'#FFFFFF','50':'#FAFAFA','100':'#F5F5F5','200':'#E5E5E5','300':'#D4D4D4',
    '400':'#A3A3A3','500':'#737373','600':'#525252','700':'#404040','800':'#262626',
    '900':'#171717','1000':'#000000',
  },
};

// Mirrors the live Dash foundation palette
// (Zyte-design-system/packages/core/src/foundations.ts -> dist/tokens.json).
// Names + values kept 1:1 with Dash src/styles/colors/palette.scss.
const CORE_COLORS = {
  actionPrimary: {
    '800':'#520023','700':'#7a0035','600':'#b5004f','500':'#db005f',
    '400':'#e2337e','200':'#e9669f','100':'#f7ccdf','50':'#fdf2f6',
  },
  accentPrimary: {
    '800':'#0c0e2b','700':'#121745','500':'#181e5a','400':'#3f4fed',
    '300':'#8c95ed','200':'#c8dfe8','100':'#dddff3','50':'#fafbfc',
  },
  accentSecondaryCold: {
    '800':'#360a40','700':'#460d52','600':'#68137a','500':'#b02cce',
    '200':'#dc64f7','100':'#e2afee','50':'#f3f4f5',
  },
  accentSecondaryWarm: {
    '800':'#801813','700':'#bd2c26','600':'#de271f','500':'#f9433b',
    '300':'#fa716b','200':'#f9c2c0','100':'#f9dad9',
  },
  colorGray: {
    DEFAULT:'#9badb5','darker':'#33525f','dark':'#667d87',
    'light':'#d9e4e8','lighter':'#f3f4f5','icon':'#9ba3af',
  },
  surface: { white:'#fefefe', grey:'#f3f4f5', lightBlue:'#f1f5f9' },
  colorBorder: { grey:'#d9e4e8' },
  text: {
    '700':'#050c4d','600':'#181e5a','500':'#33525f','400':'#667d87',
    '300':'#9badb5','200':'#d9e4e8','100':'#f3f4f5','50':'#fefefe',
  },
  info: {
    '800':'#174152','700':'#29718f','600':'#328db2','500':'#41b6e6',
    '400':'#90d4ee','200':'#b4e2f4','100':'#ecf8fc',
  },
  success: {
    '800':'#003b2c','700':'#00694f','600':'#008a69','500':'#00b388',
    '400':'#40b397','200':'#7accb8','100':'#d1f0e8',
  },
  warning: {
    '800':'#402807','700':'#8a550f','600':'#ff9e1b','500':'#ff9e1b',
    '400':'#fdb153','200':'#fec47c','100':'#fff5e9',
  },
  error: {
    '800':'#2e0001','700':'#660002','600':'#a10003','500':'#db0004',
    '400':'#f13336','200':'#f56668','100':'#fccccd','50':'#fee7e7',
  },
  white: { DEFAULT:'#fff' },
  black: { DEFAULT:'#000' },
  parakeet: { DEFAULT:'#00b388' },
  yolk: { DEFAULT:'#fdda24' },
  peachy: { DEFAULT:'#ff9e1b' },
  orange: { DEFAULT:'#f9423a' },
  blue: { DEFAULT:'#41b6e6' },
  lime: { DEFAULT:'#a4d65e' },
  indigo: { DEFAULT:'#b02cce' },
  cobalt: { DEFAULT:'#005eb8' },
  pink: { DEFAULT:'#e93cac' },
  lightGreen: { DEFAULT:'#56f387' },
  syntaxHighlight: { keyword:'#0000ff', string:'#a31515', number:'#098658' },
};

const SCRAPY_COLORS = {
  primary: {
    '50':'#E6F6EC','100':'#C3E8CF','200':'#8DD3A6','300':'#5ABD7D','400':'#30A55B',
    '500':'#188644','600':'#126B37','700':'#0D522A','800':'#08391D','900':'#052312',
  },
  neutral: WEB_COLORS.neutral,
};

const EXTRACT_SUMMIT_COLORS = {
  primary: {
    '50':'#FFF5E5','100':'#FFE4B8','200':'#FFCE7A','300':'#FFB347','400':'#F79320',
    '500':'#D47600','600':'#A85E00','700':'#7D4600','800':'#552F00','900':'#331D00',
  },
  neutral: WEB_COLORS.neutral,
};

const SHARED_SPACING = {
  '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'4':16,'5':20,'6':24,
  '8':32,'10':40,'12':48,'16':64,'20':80,'24':96,'32':128,
};
const SHARED_RADIUS = { none:0, sm:2, DEFAULT:4, md:6, lg:8, xl:12, '2xl':16, full:9999 };
const SHARED_SHADOW = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};
const SHARED_BREAKPOINT = { sm:640, md:768, lg:1024, xl:1280, '2xl':1536 };
const SHARED_OPACITY = { '0':0, '25':0.25, '50':0.5, '75':0.75, '100':1 };
const SHARED_ZINDEX = { '0':0, '10':10, '20':20, '30':30, '40':40, '50':50 };

const BASE_TYPOGRAPHY_NUMERIC = {
  size: { xs:12, sm:14, base:16, lg:18, xl:20, '2xl':24, '3xl':30, '4xl':36, '5xl':48, '6xl':60 },
  weight: { light:300, regular:400, medium:500, semibold:600, bold:700 },
  lineHeight: { none:1, tight:1.25, snug:1.375, normal:1.5, relaxed:1.625, loose:2 },
  letterSpacing: { tighter:-0.8, tight:-0.4, normal:0, wide:0.4, wider:0.8, widest:1.6 },
};

const PRODUCT_FOUNDATIONS = {
  // Real design system, generated from Zyte-design-system/packages/web tokens.
  web: WEB_FOUNDATIONS,
  core: {
    label: 'Core',
    colors: CORE_COLORS,
    semanticColors: {
      brand: 'accentSecondaryCold',
      success: 'success',
      danger: 'error',
      warning: 'warning',
      info: 'info',
      surface: 'surface',
    },
    typography: Object.assign({
      family: {
        sans: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
      },
    }, BASE_TYPOGRAPHY_NUMERIC),
    spacing: SHARED_SPACING, radius: SHARED_RADIUS, shadow: SHARED_SHADOW,
    breakpoint: SHARED_BREAKPOINT, opacity: SHARED_OPACITY, zIndex: SHARED_ZINDEX,
  },
  scrapy: {
    label: 'Scrapy',
    colors: SCRAPY_COLORS,
    semanticColors: { brand: 'primary', surface: 'neutral' },
    typography: Object.assign({
      family: {
        sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
      },
    }, BASE_TYPOGRAPHY_NUMERIC),
    spacing: SHARED_SPACING, radius: SHARED_RADIUS, shadow: SHARED_SHADOW,
    breakpoint: SHARED_BREAKPOINT, opacity: SHARED_OPACITY, zIndex: SHARED_ZINDEX,
  },
  extractSummit: {
    label: 'Extract Summit',
    colors: EXTRACT_SUMMIT_COLORS,
    semanticColors: { brand: 'primary', surface: 'neutral' },
    typography: Object.assign({
      family: {
        sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
      },
    }, BASE_TYPOGRAPHY_NUMERIC),
    spacing: SHARED_SPACING, radius: SHARED_RADIUS, shadow: SHARED_SHADOW,
    breakpoint: SHARED_BREAKPOINT, opacity: SHARED_OPACITY, zIndex: SHARED_ZINDEX,
  },
};

// Figma scope constants we want to apply per variable category.
// These restrict where the variable can be bound in the editor.
const FOUNDATIONS_SCOPES = {
  color:               ['ALL_FILLS', 'STROKE_COLOR'],
  spacing:             ['GAP', 'WIDTH_HEIGHT'],
  radius:              ['CORNER_RADIUS'],
  typographyFamily:    ['FONT_FAMILY'],
  typographySize:      ['FONT_SIZE'],
  typographyWeight:    ['FONT_WEIGHT'],
  typographyLineHeight:['LINE_HEIGHT'],
  typographyLetterSp:  ['LETTER_SPACING'],
  breakpoint:          ['WIDTH_HEIGHT'],
  opacity:             ['OPACITY'],
  zIndex:              ['ALL_SCOPES'],
  shadow:              ['ALL_SCOPES'],
};

function collectionNameForProduct(productId) {
  const bundle = PRODUCT_FOUNDATIONS[productId];
  return `Foundations · ${bundle ? bundle.label : productId}`;
}

function getOrCreateCollection(name) {
  const existing = figma.variables.getLocalVariableCollections().find((c) => c.name === name);
  if (existing) return { col: existing, created: false };
  return { col: figma.variables.createVariableCollection(name), created: true };
}

/**
 * Figma variable name rules (enforced by `createVariable`):
 *  - cannot be empty
 *  - cannot start or end with `/`
 *  - cannot contain consecutive `//`
 *  - cannot contain leading/trailing whitespace in any segment
 *  - Figma rejects certain characters (e.g. `{`, `}`, newlines, tabs)
 *
 * We also replace `.` with `_` because some Figma builds reject dots in
 * variable names (observed as "invalid variable name" errors on `spacing/0.5`).
 */
function sanitizeVariableName(raw) {
  if (raw == null) return '';
  const parts = String(raw)
    .split('/')
    .map((seg) =>
      seg
        .trim()
        .replace(/[{}\\]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\./g, '_')
    )
    .filter((seg) => seg.length > 0);
  return parts.join('/');
}

function upsertVariable(collection, modeId, name, type, value, scopes) {
  const clean = sanitizeVariableName(name);
  if (!clean) {
    throw new Error(`Refusing to create variable with empty/invalid name: "${name}"`);
  }
  const all = figma.variables.getLocalVariables();
  let v = all.find((x) => x.variableCollectionId === collection.id && x.name === clean);
  if (!v) {
    try {
      v = figma.variables.createVariable(clean, collection, type);
    } catch (err) {
      const msg = (err && err.message) ? err.message : String(err);
      throw new Error(`createVariable("${clean}", ${type}) failed: ${msg}`);
    }
  }
  try {
    v.setValueForMode(modeId, value);
  } catch (err) {
    const msg = (err && err.message) ? err.message : String(err);
    throw new Error(`setValueForMode("${clean}", ${JSON.stringify(value)}) failed: ${msg}`);
  }
  if (scopes && scopes.length) {
    try { v.scopes = scopes; } catch (_) { /* older API or incompatible type: skip */ }
  }
  return v;
}

function safeHexToRgb(hex) {
  const clean = (hex || '').replace('#', '').trim();
  if (clean.length !== 6 && clean.length !== 3) return null;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0,2), 16);
  const g = parseInt(full.slice(2,4), 16);
  const b = parseInt(full.slice(4,6), 16);
  if ([r,g,b].some((n) => Number.isNaN(n))) return null;
  return { r: r/255, g: g/255, b: b/255, a: 1 };
}

function isCssGradient(value) {
  return typeof value === 'string' && /(^|\s)(linear|radial|conic)-gradient\s*\(/i.test(value);
}

/**
 * Parse a CSS `linear-gradient(<angle>deg, <color> <pos%>, …)` into the pieces
 * a Figma GRADIENT_LINEAR paint needs. Returns null for anything we can't map
 * (radial/conic, malformed). Colors must be hex (the only form our tokens use).
 */
function parseLinearGradient(css) {
  const m = /linear-gradient\s*\(([\s\S]*)\)/i.exec(css || '');
  if (!m) return null;

  // Split top-level args on commas (no nested parens in our token values).
  const args = m[1].split(',').map((s) => s.trim()).filter(Boolean);
  if (!args.length) return null;

  let angle = 180; // CSS default ("to bottom")
  if (/^[-\d.]+deg$/i.test(args[0])) {
    angle = parseFloat(args[0]);
    args.shift();
  } else if (/^to\s+/i.test(args[0])) {
    const dir = args[0].toLowerCase();
    angle = dir.includes('right') ? 90 : dir.includes('left') ? 270 : dir.includes('top') ? 0 : 180;
    args.shift();
  }

  const stops = [];
  args.forEach((arg, i) => {
    const parts = arg.split(/\s+/);
    const rgb = safeHexToRgb(parts[0]);
    if (!rgb) return;
    let pos = parts[1] && /%$/.test(parts[1]) ? parseFloat(parts[1]) / 100 : null;
    if (pos == null) pos = args.length > 1 ? i / (args.length - 1) : 0;
    stops.push({ color: rgb, position: Math.max(0, Math.min(1, pos)) });
  });
  if (stops.length < 2) return null;

  return { angle, stops };
}

/** 2×3 gradient transform for a CSS angle, centered on the box (inverse of gradientToCss). */
function gradientTransformForCssAngle(cssAngle) {
  const theta = (cssAngle - 90) * Math.PI / 180;
  const cos = Math.cos(theta), sin = Math.sin(theta);
  const a = cos, b = -sin, c = sin, d = cos;
  // Keep the gradient midpoint at the box center (0.5, 0.5).
  const tx = 0.5 - (a * 0.5 + b * 0.5);
  const ty = 0.5 - (c * 0.5 + d * 0.5);
  return [[a, b, tx], [c, d, ty]];
}

function getOrCreatePaintStyle(name) {
  const existing = figma.getLocalPaintStyles().find((s) => s.name === name);
  if (existing) return existing;
  const s = figma.createPaintStyle();
  s.name = name;
  return s;
}

/**
 * Create / update a Figma paint style holding a linear gradient, so designers
 * can apply it from the Fill → Styles picker. This is the only way a gradient
 * becomes reusable in Figma — color *variables* can't hold gradients.
 */
function upsertGradientPaintStyle(styleName, css) {
  const parsed = parseLinearGradient(css);
  if (!parsed) throw new Error(`unsupported gradient "${css}"`);
  const style = getOrCreatePaintStyle(styleName);
  style.paints = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: gradientTransformForCssAngle(parsed.angle),
    gradientStops: parsed.stops.map((s) => ({ position: s.position, color: s.color })),
  }];
  return style;
}

/**
 * Create (or update) a product-scoped foundations collection in Figma.
 * Returns per-group counts so the UI can render a summary.
 */
function syncProductFoundations(productId, groups) {
  const bundle = PRODUCT_FOUNDATIONS[productId];
  if (!bundle) throw new Error('Unknown product id: ' + productId);

  const { col, created } = getOrCreateCollection(collectionNameForProduct(productId));
  const modeId = col.defaultModeId;
  const counts = { colors: 0, gradients: 0, spacing: 0, radius: 0, typography: 0, shadow: 0, breakpoint: 0, opacity: 0, zIndex: 0, semantic: 0 };
  const failures = [];

  const varByName = {};
  for (const v of figma.variables.getLocalVariables()) {
    if (v.variableCollectionId === col.id) varByName[v.name] = v;
  }

  // tryUpsert wraps a single variable write so one bad name does not abort
  // the whole sync; the failure is logged for the UI summary.
  function tryUpsert(group, name, type, value, scopes) {
    try {
      const v = upsertVariable(col, modeId, name, type, value, scopes);
      varByName[sanitizeVariableName(name)] = v;
      counts[group]++;
      return v;
    } catch (err) {
      const message = (err && err.message) ? err.message : String(err);
      failures.push({ group, name, message });
      console.warn('[foundations sync] ' + message);
      return null;
    }
  }

  // Colors
  if (groups.colors) {
    for (const [paletteName, shades] of Object.entries(bundle.colors)) {
      for (const [shade, hex] of Object.entries(shades)) {
        const rgb = safeHexToRgb(hex);
        if (rgb) {
          tryUpsert('colors', `color/${paletteName}/${shade}`, 'COLOR', rgb, FOUNDATIONS_SCOPES.color);
        } else if (isCssGradient(hex)) {
          // Gradients can't be color variables — publish a paint style instead,
          // so the token is usable from Fill → Styles. Name mirrors the token:
          //   headlineGradient/DEFAULT -> "<collection>/headlineGradient"
          //   headlineGradient/subtle  -> "<collection>/headlineGradient/subtle"
          const styleName = shade === 'DEFAULT'
            ? `${col.name}/${paletteName}`
            : `${col.name}/${paletteName}/${shade}`;
          try {
            upsertGradientPaintStyle(styleName, String(hex));
            counts.gradients++;
          } catch (err) {
            const message = (err && err.message) ? err.message : String(err);
            failures.push({ group: 'gradients', name: styleName, message });
            console.warn('[foundations sync] ' + message);
          }
        } else {
          failures.push({ group: 'colors', name: `color/${paletteName}/${shade}`, message: `unsupported color value "${hex}"` });
        }
      }
    }

    // Semantic aliases → primitive colors.
    for (const [role, palette] of Object.entries(bundle.semanticColors || {})) {
      const shades = bundle.colors[palette];
      if (!shades) continue;
      for (const shade of Object.keys(shades)) {
        const targetName = sanitizeVariableName(`color/${palette}/${shade}`);
        const target = varByName[targetName];
        if (!target) continue;
        try {
          const alias = figma.variables.createVariableAlias(target);
          tryUpsert('semantic', `semantic/${role}/${shade}`, 'COLOR', alias, FOUNDATIONS_SCOPES.color);
        } catch (err) {
          const message = (err && err.message) ? err.message : String(err);
          failures.push({ group: 'semantic', name: `semantic/${role}/${shade}`, message });
        }
      }
    }
  }

  // Spacing
  if (groups.spacing) {
    for (const [token, px] of Object.entries(bundle.spacing)) {
      tryUpsert('spacing', `spacing/${token}`, 'FLOAT', px, FOUNDATIONS_SCOPES.spacing);
    }
  }

  // Radius
  if (groups.radius) {
    for (const [token, px] of Object.entries(bundle.radius)) {
      tryUpsert('radius', `radius/${token}`, 'FLOAT', px, FOUNDATIONS_SCOPES.radius);
    }
  }

  // Typography
  if (groups.typography) {
    for (const [token, family] of Object.entries(bundle.typography.family || {})) {
      tryUpsert('typography', `typography/font-family/${token}`, 'STRING', family, FOUNDATIONS_SCOPES.typographyFamily);
    }
    for (const [token, size] of Object.entries(bundle.typography.size || {})) {
      tryUpsert('typography', `typography/font-size/${token}`, 'FLOAT', size, FOUNDATIONS_SCOPES.typographySize);
    }
    for (const [token, weight] of Object.entries(bundle.typography.weight || {})) {
      tryUpsert('typography', `typography/font-weight/${token}`, 'FLOAT', weight, FOUNDATIONS_SCOPES.typographyWeight);
    }
    for (const [token, lh] of Object.entries(bundle.typography.lineHeight || {})) {
      tryUpsert('typography', `typography/line-height/${token}`, 'FLOAT', lh, FOUNDATIONS_SCOPES.typographyLineHeight);
    }
    for (const [token, ls] of Object.entries(bundle.typography.letterSpacing || {})) {
      tryUpsert('typography', `typography/letter-spacing/${token}`, 'FLOAT', ls, FOUNDATIONS_SCOPES.typographyLetterSp);
    }
  }

  // Shadow (stored as string hints; real effect styles come later)
  if (groups.shadow) {
    for (const [token, css] of Object.entries(bundle.shadow)) {
      tryUpsert('shadow', `shadow/${token}`, 'STRING', css, FOUNDATIONS_SCOPES.shadow);
    }
  }

  // Breakpoints
  if (groups.breakpoint) {
    for (const [token, px] of Object.entries(bundle.breakpoint)) {
      tryUpsert('breakpoint', `breakpoint/${token}`, 'FLOAT', px, FOUNDATIONS_SCOPES.breakpoint);
    }
  }

  // Opacity
  if (groups.opacity) {
    for (const [token, value] of Object.entries(bundle.opacity)) {
      tryUpsert('opacity', `opacity/${token}`, 'FLOAT', value, FOUNDATIONS_SCOPES.opacity);
    }
  }

  // Z-index
  if (groups.zIndex) {
    for (const [token, value] of Object.entries(bundle.zIndex)) {
      tryUpsert('zIndex', `z-index/${token}`, 'FLOAT', value, FOUNDATIONS_SCOPES.zIndex);
    }
  }

  return { collection: col.name, created, counts, failures };
}

// ─── MESSAGE HANDLER ────────────────────────────────────────────────────────

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'plot-colors') {
      const plotted = await plotColorCollections();
      // @ts-ignore
      figma.ui.postMessage({ type: 'done', text: `Plotted ${plotted} colors on current page` });
      return;
    }

    if (msg.type === 'create-spec-page') {
      const category = msg.category;
      if (!category || !TAILWIND_SPEC[category]) throw new Error('Unknown spec category');
      const plotted = await createSpecCategoryPage(category);
      // @ts-ignore
      figma.ui.postMessage({ type: 'done', text: `Created "${category}" spec page (${plotted} rows)` });
      return;
    }

    if (msg.type === 'create-typography-page') {
      figma.notify('Building Typography spec page…');
      try {
        const plotted = await createTypographyPage();
        figma.notify(`Typography page created (${plotted} rows)`);
        // @ts-ignore
        figma.ui.postMessage({ type: 'done', text: `Created "Typography" spec page (${plotted} rows)` });
      } catch (err) {
        figma.notify('Typography page failed: ' + (err && err.message ? err.message : String(err)), { error: true });
        // @ts-ignore
        figma.ui.postMessage({ type: 'error', text: (err && err.message) || 'Typography page failed' });
      }
      return;
    }

    if (msg.type === 'apply-variables') {
      try {
        const report = await applyVariablesToSelection(msg.summary, msg.mapping);

        const group = (keys) => keys.reduce((sum, k) => sum + (report.byField[k] || 0), 0);
        const padCount = group(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']);
        const gapCount = group(['itemSpacing', 'counterAxisSpacing']);
        const radiusCount = group(['cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']);
        const textCount = group(['fontSize', 'lineHeight', 'letterSpacing', 'paragraphSpacing']);

        const parts = [];
        if (report.colorsBound) parts.push(`${report.colorsBound} colors`);
        if (padCount) parts.push(`${padCount} padding`);
        if (gapCount) parts.push(`${gapCount} gap`);
        if (radiusCount) parts.push(`${radiusCount} radius`);
        if (textCount) parts.push(`${textCount} text`);
        const snappedCount = (report.changes || []).filter((c) => c.snapped).length;
        const modeNote = report.snap
          ? ` · ${snappedCount} snapped`
          : '';
        const summary = parts.length
          ? `Applied: ${parts.join(', ')} (${report.nodesVisited} nodes${modeNote}).`
          : `No variable matches found across ${report.nodesVisited} nodes — are your local values matching variable values?`;
        figma.notify(summary);
        // @ts-ignore
        figma.ui.postMessage({ type: 'done', text: summary });
      } catch (err) {
        figma.notify('Apply variables failed: ' + (err && err.message ? err.message : String(err)), { error: true });
        // @ts-ignore
        figma.ui.postMessage({ type: 'error', text: (err && err.message) || 'Apply variables failed' });
      }
      return;
    }

    if (msg.type === 'get-products') {
      // @ts-ignore
      figma.ui.postMessage({ type: 'products', products: PRODUCTS });
      return;
    }

    if (msg.type === 'get-foundations-meta') {
      // @ts-ignore
      figma.ui.postMessage({
        type: 'foundations-meta',
        generatedAt: typeof WEB_FOUNDATIONS_GENERATED_AT !== 'undefined' ? WEB_FOUNDATIONS_GENERATED_AT : null,
        version: (WEB_FOUNDATIONS && WEB_FOUNDATIONS.version) || null,
      });
      return;
    }

    if (msg.type === 'sync-product-foundations') {
      try {
        const productId = msg.productId;
        const groups = Object.assign(
          { colors: true, spacing: true, radius: true, typography: true, shadow: true, breakpoint: true, opacity: true, zIndex: true },
          msg.groups || {}
        );

        const result = syncProductFoundations(productId, groups);
        const parts = [];
        if (result.counts.colors) parts.push(`${result.counts.colors} colors`);
        if (result.counts.gradients) parts.push(`${result.counts.gradients} gradients`);
        if (result.counts.semantic) parts.push(`${result.counts.semantic} semantic`);
        if (result.counts.typography) parts.push(`${result.counts.typography} typography`);
        if (result.counts.spacing) parts.push(`${result.counts.spacing} spacing`);
        if (result.counts.radius) parts.push(`${result.counts.radius} radius`);
        if (result.counts.shadow) parts.push(`${result.counts.shadow} shadow`);
        if (result.counts.breakpoint) parts.push(`${result.counts.breakpoint} breakpoints`);
        if (result.counts.opacity) parts.push(`${result.counts.opacity} opacity`);
        if (result.counts.zIndex) parts.push(`${result.counts.zIndex} z-index`);

        const failureCount = (result.failures || []).length;
        const baseSummary = `${result.created ? 'Created' : 'Updated'} "${result.collection}" · ${parts.join(', ') || 'no changes'}`;
        const summary = failureCount ? `${baseSummary} · ${failureCount} skipped` : baseSummary;

        if (failureCount) {
          const first = result.failures[0];
          figma.notify(`Foundations: ${failureCount} token(s) skipped. First: ${first.name} — ${first.message}`, { error: true, timeout: 6000 });
        } else {
          figma.notify(summary);
        }

        // @ts-ignore
        figma.ui.postMessage({ type: 'foundations-synced', productId, result, text: summary });
      } catch (err) {
        figma.notify('Foundation sync failed: ' + (err && err.message ? err.message : String(err)), { error: true });
        // @ts-ignore
        figma.ui.postMessage({ type: 'error', text: (err && err.message) || 'Foundation sync failed' });
      }
      return;
    }

    if (msg.type === 'document-frame') {
      try {
        const result = await createFrameDocumentation();
        figma.notify(`Docs generated — ${result.uniqueCount} variables, ${result.bindingCount} bindings`);
        // @ts-ignore
        figma.ui.postMessage({
          type: 'frame-doc-ready',
          text: `Docs generated (${result.uniqueCount} variables, ${result.bindingCount} bindings) — copy or download below`,
          markdown: result.markdown,
          filename: result.filename,
          uniqueCount: result.uniqueCount,
          bindingCount: result.bindingCount,
        });
      } catch (err) {
        figma.notify('Docs failed: ' + (err && err.message ? err.message : String(err)), { error: true });
        // @ts-ignore
        figma.ui.postMessage({ type: 'error', text: (err && err.message) || 'Docs generation failed' });
      }
      return;
    }

    if (msg.type !== 'create') return;

    let total = 0;
    let primitiveVarMap = null;
    const notices = [];

    // Collect custom palettes that need baking into Color Primitive
    const extraPalettes = {};
    for (const [role, config] of Object.entries(msg.brand)) {
      if (config && config.mode === 'custom') {
        extraPalettes[role] = generateShades(config.hex);
      }
    }

    const needsPrimitive = msg.doColors || Object.keys(extraPalettes).length > 0;
    if (needsPrimitive) {
      const result = createColorPrimitive(msg.doColors, extraPalettes);
      total += result.count;
      primitiveVarMap = result.varMap;
    }

    if (msg.doTypo) {
      total += createTypoPrimitive();
    }

    if (msg.doTailwindSpec) {
      try {
        total += createTailwindSpecVariables();
      } catch (err) {
        notices.push('Tailwind Spec skipped');
      }
    }

    const fallbackBrand = {
      primary: { mode: 'palette', value: 'primary' },
      secondary: { mode: 'palette', value: 'slate' },
      destructive: { mode: 'palette', value: 'red' },
    };
    const hasBrandPayload = msg.brand && Object.keys(msg.brand).length > 0;
    const brandToCreate = hasBrandPayload ? msg.brand : fallbackBrand;
    total += createBrandColors(brandToCreate, primitiveVarMap);

    // @ts-ignore — postMessage exists at runtime; local typings are outdated
    figma.ui.postMessage({
      type: 'done',
      text: `Done — ${total} variables created${notices.length ? ` (${notices.join(', ')})` : ''}`,
    });
  } catch (err) {
    // @ts-ignore
    figma.ui.postMessage({ type: 'error', text: err.message });
  }
};
