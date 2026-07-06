import * as THREE from "three";

/* Shared three.js helpers for the site's 3D scenes. This module statically
   imports three, so it must only ever be pulled in via `await import(...)`
   from client components — that keeps three out of the initial JS chunk. */

export { THREE };

export const GOLD = "#d6a85a";
export const IVORY = "#f4f1ea";

/** Resolve a CSS font-family custom property (next/font hashes family names,
    so canvas text must read the computed family from the DOM). */
export function resolveFontFamily(varName: string, fallback = "serif"): string {
  if (typeof document === "undefined") return fallback;
  const el = document.createElement("span");
  el.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;font-family:var(${varName})`;
  document.body.appendChild(el);
  const fam = getComputedStyle(el).fontFamily;
  el.remove();
  return fam || fallback;
}

/** Wait for webfonts so canvas-drawn glyphs don't rasterize in a fallback face. */
export async function ensureFonts(): Promise<void> {
  try {
    await document.fonts?.ready;
  } catch {
    /* fonts API unavailable — draw with whatever is loaded */
  }
}

export function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Soft low-frequency noise used as a bump map so the slate reads as stone,
    not plastic: random dots on a tiny canvas, upscaled with smoothing. */
function stoneNoiseTexture(): THREE.CanvasTexture {
  const small = document.createElement("canvas");
  small.width = small.height = 48;
  const sc = small.getContext("2d")!;
  sc.fillStyle = "#808080";
  sc.fillRect(0, 0, 48, 48);
  for (let i = 0; i < 260; i++) {
    const v = 108 + Math.floor(Math.random() * 60);
    sc.fillStyle = `rgba(${v},${v},${v},0.55)`;
    const r = 1 + Math.random() * 3.5;
    sc.beginPath();
    sc.arc(Math.random() * 48, Math.random() * 48, r, 0, Math.PI * 2);
    sc.fill();
  }
  const big = document.createElement("canvas");
  big.width = big.height = 256;
  const bc = big.getContext("2d")!;
  bc.imageSmoothingEnabled = true;
  bc.drawImage(small, 0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(big);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

/** Dark slate stone with a light polish — the brand material. */
export function slateMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0x101317,
    metalness: 0.08,
    roughness: 0.46,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
    envMapIntensity: 1.1,
    bumpMap: stoneNoiseTexture(),
    bumpScale: 0.4,
  });
}

/** Dark studio reflections without shipping an HDR: a hand-drawn equirect —
    near-black room, warm gold softbox to one side, cool strip to the other.
    LDR by construction, so no viewing angle can catch a blown-out hotspot
    (RoomEnvironment's emitters wash camera-facing surfaces white). */
export function applyEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
): () => void {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0a0a0d";
  ctx.fillRect(0, 0, 512, 256);

  const blob = (x: number, y: number, r: number, rgba: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  blob(120, 62, 130, "rgba(255,216,152,0.55)"); // warm key softbox
  blob(408, 88, 110, "rgba(168,194,255,0.38)"); // cool rim strip
  blob(256, 16, 150, "rgba(244,241,234,0.16)"); // faint overhead

  const equirect = new THREE.CanvasTexture(c);
  equirect.mapping = THREE.EquirectangularReflectionMapping;
  equirect.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromEquirectangular(equirect).texture;
  scene.environment = envTex;
  pmrem.dispose();
  equirect.dispose();
  return () => envTex.dispose();
}

function canvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export type PaneGlyph = "site" | "dash" | "reel";

function roundedPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Line-art discipline glyphs, drawn in the site's blueprint idiom. */
function drawGlyph(
  ctx: CanvasRenderingContext2D,
  glyph: PaneGlyph,
  cx: number,
  cy: number,
  accent: string,
) {
  const ink = "rgba(244,241,234,0.45)";
  ctx.lineWidth = 3;
  ctx.strokeStyle = ink;

  if (glyph === "site") {
    // Browser window: chrome bar, dots, copy lines, gold CTA
    roundedPath(ctx, cx - 130, cy - 95, 260, 190, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 130, cy - 55);
    ctx.lineTo(cx + 130, cy - 55);
    ctx.stroke();
    ctx.fillStyle = ink;
    for (const dx of [-108, -86]) {
      ctx.beginPath();
      ctx.arc(cx + dx, cy - 75, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(244,241,234,0.3)";
    ctx.beginPath();
    ctx.moveTo(cx - 104, cy - 18);
    ctx.lineTo(cx + 50, cy - 18);
    ctx.moveTo(cx - 104, cy + 8);
    ctx.lineTo(cx + 8, cy + 8);
    ctx.stroke();
    ctx.strokeStyle = accent;
    roundedPath(ctx, cx - 104, cy + 38, 78, 30, 4);
    ctx.stroke();
  } else if (glyph === "dash") {
    // Dashboard: sidebar + rising bars
    roundedPath(ctx, cx - 130, cy - 95, 260, 190, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 74, cy - 95);
    ctx.lineTo(cx - 74, cy + 95);
    ctx.stroke();
    ctx.fillStyle = "rgba(244,241,234,0.3)";
    for (const [i, dy] of [-70, -48, -26].entries()) {
      ctx.globalAlpha = i === 0 ? 1 : 0.55;
      ctx.fillRect(cx - 116, cy + dy, 28, 5);
    }
    ctx.globalAlpha = 1;
    const bars: [number, number][] = [
      [-38, 52],
      [12, 86],
      [62, 122],
    ];
    for (const [i, [bx, bh]] of bars.entries()) {
      const grad = i === bars.length - 1;
      ctx.strokeStyle = grad ? accent : "rgba(244,241,234,0.38)";
      roundedPath(ctx, cx + bx, cy + 72 - bh, 34, bh, 4);
      ctx.stroke();
    }
  } else {
    // Reel: portrait frame, play mark, gold progress
    roundedPath(ctx, cx - 78, cy - 118, 156, 236, 12);
    ctx.stroke();
    ctx.fillStyle = "rgba(244,241,234,0.5)";
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 30);
    ctx.lineTo(cx + 26, cy - 4);
    ctx.lineTo(cx - 16, cy + 22);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(244,241,234,0.25)";
    ctx.beginPath();
    ctx.moveTo(cx - 56, cy + 84);
    ctx.lineTo(cx + 56, cy + 84);
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.beginPath();
    ctx.moveTo(cx - 56, cy + 84);
    ctx.lineTo(cx + 14, cy + 84);
    ctx.stroke();
  }
}

/** Full pane face for the convergence cards: inset hairline frame with gold
    corner ticks, faint blueprint grid, discipline glyph, index and spaced
    title — the DOM card language, engraved into the stone. */
export function paneLabelTexture(
  index: string,
  lines: string[],
  displayFamily: string,
  accent = IVORY,
  glyph: PaneGlyph = "site",
): THREE.CanvasTexture {
  const W = 768;
  const H = 1024;
  const M = 52; // frame inset
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Faint blueprint grid, clipped to the frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(M, M, W - 2 * M, H - 2 * M);
  ctx.clip();
  ctx.strokeStyle = "rgba(244,241,234,0.045)";
  ctx.lineWidth = 1;
  for (let x = M + 83; x < W - M; x += 83) {
    ctx.beginPath();
    ctx.moveTo(x, M);
    ctx.lineTo(x, H - M);
    ctx.stroke();
  }
  for (let y = M + 83; y < H - M; y += 83) {
    ctx.beginPath();
    ctx.moveTo(M, y);
    ctx.lineTo(W - M, y);
    ctx.stroke();
  }
  ctx.restore();

  // Hairline frame
  ctx.strokeStyle = "rgba(244,241,234,0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(M, M, W - 2 * M, H - 2 * M);

  // Gold corner ticks on the frame corners
  ctx.strokeStyle = "rgba(214,168,90,0.6)";
  ctx.lineWidth = 2.5;
  for (const [tx, ty] of [
    [M, M],
    [W - M, M],
    [M, H - M],
    [W - M, H - M],
  ]) {
    ctx.beginPath();
    ctx.moveTo(tx - 15, ty);
    ctx.lineTo(tx + 15, ty);
    ctx.moveTo(tx, ty - 15);
    ctx.lineTo(tx, ty + 15);
    ctx.stroke();
  }

  // Index with flanking rules
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 62px ${displayFamily}`;
  ctx.fillStyle = GOLD;
  ctx.fillText(index, W / 2, 158);
  ctx.strokeStyle = "rgba(214,168,90,0.3)";
  ctx.lineWidth = 2;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + dir * 62, 158);
    ctx.lineTo(W / 2 + dir * 118, 158);
    ctx.stroke();
  }

  drawGlyph(ctx, glyph, W / 2, 440, accent === IVORY ? GOLD : accent);

  // Title
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "18px";
  } catch {
    /* keep default tracking */
  }
  ctx.font = `500 66px ${displayFamily}`;
  ctx.fillStyle = accent;
  const base = 764 - (lines.length - 1) * 46;
  lines.forEach((line, i) => {
    ctx.fillText(line.toUpperCase(), W / 2, base + i * 92);
  });

  // Diamond seal at the foot
  ctx.save();
  ctx.translate(W / 2, 908);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "rgba(214,168,90,0.85)";
  ctx.fillRect(-8, -8, 16, 16);
  ctx.restore();

  return canvasTexture(c);
}

/** The assembled wordmark: diamond seal over SLATE & CODE (gold &), STUDIO under. */
export function wordmarkTexture(displayFamily: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 768;
  const ctx = c.getContext("2d")!;
  ctx.textBaseline = "middle";

  // Diamond with flanking rules above the wordmark
  ctx.save();
  ctx.translate(1024, 150);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "rgba(214,168,90,0.9)";
  ctx.fillRect(-13, -13, 26, 26);
  ctx.restore();
  ctx.strokeStyle = "rgba(244,241,234,0.22)";
  ctx.lineWidth = 3;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(1024 + dir * 70, 150);
    ctx.lineTo(1024 + dir * 230, 150);
    ctx.stroke();
  }

  const size = 190;
  ctx.font = `700 ${size}px ${displayFamily}`;
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "30px";
  } catch {
    /* keep default tracking */
  }
  const segs: { text: string; color: string }[] = [
    { text: "SLATE ", color: IVORY },
    { text: "&", color: GOLD },
    { text: " CODE", color: IVORY },
  ];
  const total = segs.reduce((w, s) => w + ctx.measureText(s.text).width, 0);
  let x = (2048 - total) / 2;
  ctx.textAlign = "left";
  for (const s of segs) {
    ctx.fillStyle = s.color;
    ctx.fillText(s.text, x, 400);
    x += ctx.measureText(s.text).width;
  }

  ctx.textAlign = "center";
  ctx.font = `500 70px ${displayFamily}`;
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "58px";
  } catch {
    /* keep default tracking */
  }
  ctx.fillStyle = "rgba(196,193,186,0.95)";
  ctx.fillText("STUDIO", 1024 + 29, 615);
  return canvasTexture(c);
}

/** Radial gold glow sprite. Gaussian-shaped stops so the falloff has no
    visible terminator ring, plus alpha dithering to kill 8-bit banding on
    near-black backgrounds. */
export function glowTexture(): THREE.CanvasTexture {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  const stops: [number, number][] = [
    [0, 0.72],
    [0.15, 0.6],
    [0.3, 0.42],
    [0.45, 0.26],
    [0.6, 0.14],
    [0.75, 0.06],
    [0.88, 0.02],
    [1, 0],
  ];
  for (const [p, a] of stops) g.addColorStop(p, `rgba(224,182,110,${a})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);

  const img = ctx.getImageData(0, 0, S, S);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) {
    const a = d[i];
    if (a > 0 && a < 255) {
      d[i] = Math.max(0, Math.min(255, a + ((Math.random() * 3) | 0) - 1));
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvasTexture(c);
}

/** Ease helpers shared by the scenes. */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
export const smoothstep = (a: number, b: number, t: number) => {
  const x = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return x * x * (3 - 2 * x);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
