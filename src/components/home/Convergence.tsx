"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const SERVICES = [
  { index: "01", label: "Websites", lines: ["Websites"], glyph: "site" as const },
  {
    index: "02",
    label: "Business Tools",
    lines: ["Business", "Tools"],
    glyph: "dash" as const,
    technical: true,
  },
  { index: "03", label: "Short-Form", lines: ["Short-Form"], glyph: "reel" as const },
];

function ServiceCardBody({ i }: { i: number }) {
  const s = SERVICES[i];
  return (
    <>
      <span className="font-display text-sm font-semibold text-gold">{s.index}</span>
      <p className={`micro mt-2.5 ${s.technical ? "text-blue" : "text-ivory/80"}`}>
        {s.label}
      </p>
    </>
  );
}

function StudioBoxBody() {
  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <span className="block h-2 w-2 rotate-45 bg-gold" />
        <span className="font-display text-lg font-semibold tracking-[0.18em] text-ivory sm:text-xl">
          SLATE <span className="text-gold">&</span> CODE
        </span>
      </div>
      <p className="micro mt-2.5 text-fog">Studio</p>
    </>
  );
}

const CARD_CLASS =
  "rounded-lg border border-line bg-surface px-3 py-5 text-center shadow-[0_12px_24px_rgba(0,0,0,0.35),0_32px_70px_rgba(0,0,0,0.3)] sm:px-4 sm:py-6";
const BOX_CLASS =
  "relative rounded-lg border border-gold/40 bg-surface px-8 py-6 text-center shadow-[0_12px_28px_rgba(0,0,0,0.45),0_36px_80px_rgba(0,0,0,0.4),0_0_46px_rgba(214,168,90,0.1)] sm:px-12 sm:py-8";

/* Static fallback (reduced motion / no WebGL): the diagram mid-convergence */
function StaticScene() {
  return (
    <div className="relative mx-auto mt-12 h-[400px] w-full max-w-3xl sm:h-[440px]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 400"
        preserveAspectRatio="none"
        aria-hidden
      >
        {[
          "M100 75 C100 140 300 120 300 190",
          "M300 75 C300 130 300 130 300 190",
          "M500 75 C500 130 300 120 300 190",
        ].map((d) => (
          <path
            key={d}
            d={d}
            stroke="#D6A85A"
            strokeOpacity={0.5}
            strokeWidth={1.5}
            fill="none"
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-0 grid grid-cols-3 gap-4 sm:gap-6">
        {SERVICES.map((s, i) => (
          <div key={s.index} className={CARD_CLASS}>
            <ServiceCardBody i={i} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={BOX_CLASS}>
          <StudioBoxBody />
        </div>
      </div>
    </div>
  );
}

/** One shared timeline: plays once when the stage scrolls into view. */
const PLAY_SECONDS = 4.4;

/**
 * Convergence, in stone: three slate panes — Websites, Business Tools,
 * Short-Form — float in their own depth lanes, converge, and slot together
 * into a single monolith carrying the studio wordmark. Plays once on
 * scroll-into-view, then the finished block floats gently. Each pane keeps
 * its own z-lane for the whole flight, so they can never cross or clip.
 *
 * Same guardrails as the other scenes: lazy three.js, DPR clamp, RAF paused
 * offscreen, reduced-motion and WebGL-failure fall back to the DOM diagram.
 */
export default function Convergence() {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showStatic = reduce || failed;

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let mounted = true;
    let raf = 0;
    let cleanup = () => {};

    (async () => {
      const C = await import("@/components/three/common");
      const { THREE } = C;
      await C.ensureFonts();
      if (!mounted || !canvasRef.current) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        setFailed(true);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      const onContextLost = (e: Event) => {
        e.preventDefault();
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        if (mounted) setFailed(true);
      };
      canvas.addEventListener("webglcontextlost", onContextLost as EventListener);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
      camera.position.set(0, 0, 4.6);
      camera.lookAt(0, -0.2, 0);

      const disposeEnv = C.applyEnvironment(renderer, scene);

      const key = new THREE.DirectionalLight(0xffe8c8, 2.2);
      key.position.set(-2.5, 3.0, 2.5);
      const rim = new THREE.DirectionalLight(0xbcd2ff, 1.6);
      rim.position.set(2.8, 1.0, -2.6);
      const fill = new THREE.HemisphereLight(0x2a2d33, 0x0a0a0c, 0.8);
      const gold = new THREE.PointLight(0xd6a85a, 0, 8, 1.7);
      gold.position.set(0, -0.2, 1.5);
      scene.add(key, rim, fill, gold);

      /* ——— Assembly: three panes + face labels + wordmark + glow ——— */
      const displayFamily = C.resolveFontFamily("--font-display", "sans-serif");
      const assembly = new THREE.Group();
      assembly.position.set(0, -0.25, 0);
      scene.add(assembly);

      const paneGeo = new THREE.ExtrudeGeometry(C.roundedRectShape(0.92, 1.22, 0.04), {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.01,
        bevelSegments: 3,
        curveSegments: 10,
      });
      paneGeo.center();
      const paneMat = C.slateMaterial();

      const labelZ = 0.05 / 2 + 0.012 + 0.005;
      const disposables: { dispose: () => void }[] = [paneGeo, paneMat];
      if (paneMat.bumpMap) disposables.push(paneMat.bumpMap);

      type Pane = {
        group: InstanceType<typeof THREE.Group>;
        labelMat: InstanceType<typeof THREE.MeshBasicMaterial>;
        zEnd: number;
      };
      const Z_END = [-0.115, 0, 0.115];
      const panes: Pane[] = SERVICES.map((s, i) => {
        const g = new THREE.Group();
        g.add(new THREE.Mesh(paneGeo, paneMat));
        const tex = C.paneLabelTexture(
          s.index,
          s.lines,
          displayFamily,
          s.technical ? "#4da3ff" : C.IVORY,
          s.glyph,
        );
        const labelMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          toneMapped: false,
          depthWrite: false,
        });
        const label = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 1.12), labelMat);
        label.position.set(0, 0, labelZ);
        label.renderOrder = 2;
        g.add(label);
        disposables.push(tex, labelMat, label.geometry);
        assembly.add(g);
        return { group: g, labelMat, zEnd: Z_END[i] };
      });

      const wordTex = C.wordmarkTexture(displayFamily);
      const wordMat = new THREE.MeshBasicMaterial({
        map: wordTex,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
        opacity: 0,
      });
      const word = new THREE.Mesh(
        new THREE.PlaneGeometry(0.86, 0.86 * (768 / 2048)),
        wordMat,
      );
      // Flush against the front pane once the seams have closed (±0.075)
      word.position.set(0, 0, 0.075 + 0.05 / 2 + 0.012 + 0.006);
      word.renderOrder = 3;
      assembly.add(word);
      disposables.push(wordTex, wordMat, word.geometry);

      const glowTex = C.glowTexture();
      const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      });
      // Anchored to the scene (not the assembly) so the block's reveal
      // rotation can't skew the halo off-center; sized to finish fading
      // before the canvas edge so it never clips into a straight line.
      const glow = new THREE.Sprite(glowMat);
      glow.position.set(0, -0.25, -0.55);
      glow.scale.setScalar(2.0);
      scene.add(glow);
      disposables.push(glowTex, glowMat);

      /* ——— Sizing ——— */
      let spreadX = 1.55;
      const resize = () => {
        const parent = canvas.parentElement;
        const w = parent?.clientWidth || window.innerWidth;
        const h = parent?.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        const visW = visH * camera.aspect;
        spreadX = Math.min(Math.max(visW * 0.42 - 0.05, 0.34), 1.55);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement || canvas);

      /* ——— Choreography: each pane owns a depth lane that matches its final
         slot, so lanes never cross — the sides slide onto the seated core. ——— */
      const START = [
        { x: -1, y: 0.12, z: -0.4, rx: 0.05, ry: 0.5, rz: 0.04 },
        { x: 0, y: 0.38, z: 0, rx: -0.07, ry: 0.1, rz: -0.02 },
        { x: 1, y: 0.12, z: 0.4, rx: 0.05, ry: -0.5, rz: -0.04 },
      ];
      const WINDOW: [number, number][] = [
        [0.16, 0.62],
        [0.05, 0.5],
        [0.2, 0.66],
      ];

      const render = (t: number, u: number) => {
        if (renderer.getContext().isContextLost()) return;

        const seam = C.smoothstep(0.66, 0.8, u);
        const reveal = C.smoothstep(0.8, 1, u);
        const settled = C.smoothstep(0.96, 1, u);
        const floatAmp = 1 - C.smoothstep(0.5, 0.7, u);

        panes.forEach((pane, i) => {
          const e = C.smoothstep(WINDOW[i][0], WINDOW[i][1], u);
          const s = START[i];
          // Seams close from the lane slot (±0.115) to flush contact (±0.075)
          const zTarget = pane.zEnd * C.lerp(1, 0.652, seam);
          pane.group.position.set(
            C.lerp(s.x * spreadX, 0, e),
            C.lerp(s.y, 0, e) + Math.sin(t * 0.6 + i * 2.1) * 0.03 * floatAmp,
            C.lerp(s.z, zTarget, e),
          );
          pane.group.rotation.set(
            C.lerp(s.rx, 0, e) + Math.sin(t * 0.45 + i * 1.7) * 0.015 * floatAmp,
            C.lerp(s.ry, 0, e),
            C.lerp(s.rz, 0, e),
          );
          pane.labelMat.opacity = 1 - C.smoothstep(0.62, 0.78, u);
        });

        // The finished block breathes gently once settled.
        assembly.rotation.y =
          C.lerp(-0.06, -0.2, reveal) + Math.sin(t * 0.23) * 0.015 * settled;
        assembly.position.y = -0.25 + Math.sin(t * 0.5) * 0.03 * settled;
        assembly.scale.setScalar(C.lerp(1, 1.1, reveal));
        wordMat.opacity = C.smoothstep(0.86, 0.98, u);
        glowMat.opacity = reveal * 0.75;
        glow.scale.setScalar(2.0 + reveal * 0.4);

        // Warm kiss throughout, flash at contact, settle into the reveal glow.
        const flash = Math.exp(-Math.pow((u - 0.8) / 0.07, 2)) * 2.2;
        gold.intensity = 0.35 + seam * 0.5 + flash + reveal * 1.7;

        camera.position.z = 4.6 - reveal * 0.35;
        renderer.render(scene, camera);
      };

      const disposeAll = () => {
        disposables.forEach((d) => d.dispose());
        disposeEnv();
        renderer.dispose();
      };

      let baseline = performance.now();
      let elapsed = 0;
      let playBase: number | null = null; // set when the stage first appears
      const loop = (now: number) => {
        elapsed = (now - baseline) / 1000;
        const u =
          playBase === null
            ? 0
            : Math.min((now - playBase) / (PLAY_SECONDS * 1000), 1);
        render(elapsed, u);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting;
          if (visible && playBase === null) {
            playBase = performance.now() + 250; // small beat before it plays
          }
          if (!visible && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          } else if (visible && !raf) {
            baseline = performance.now() - elapsed * 1000;
            raf = requestAnimationFrame(loop);
          }
        },
        { threshold: 0.35 },
      );
      io.observe(stage);

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        canvas.removeEventListener("webglcontextlost", onContextLost as EventListener);
        disposeAll();
      };
    })().catch(() => {
      if (mounted) setFailed(true);
    });

    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
      cleanup();
    };
  }, [reduce]);

  return (
    <section id="studio" className="relative border-t border-line bg-pit">
      <div className="grid-faint mask-fade absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          eyebrow="One Studio"
          title={
            <>
              It all comes <em className="serif-accent">together</em>.
            </>
          }
          align="center"
        />
        {showStatic ? (
          <StaticScene />
        ) : (
          <div
            ref={stageRef}
            className="relative mx-auto mt-6 h-[460px] w-full max-w-4xl sm:h-[510px]"
          >
            <canvas
              ref={canvasRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}
