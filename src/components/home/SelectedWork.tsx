import type { ReactNode } from "react";
import ParallaxPreview from "@/components/ParallaxPreview";
import Reveal from "@/components/Reveal";
import ScrollFade from "@/components/ScrollFade";
import SectionHeading from "@/components/SectionHeading";
import SpotlightCard from "@/components/SpotlightCard";
import {
  CarInspectionPreview,
  MubarakAutoPreview,
  UntoldArchivesPreview,
  CrescentPreview,
  MahjongPreview,
} from "@/components/home/previews";

type Project = {
  name: string;
  type: string;
  technical?: boolean; // blue accent for internal-tool tags
  glow: string; // cursor-tracked glow color, "r, g, b"
  status?: string;
  description: string;
  detail: string;
  url?: string; // live site — makes the whole card a link
  preview: ReactNode;
  span: string; // grid column span
};

const PROJECTS: Project[] = [
  {
    name: "Car Inspection Site",
    type: "Website",
    glow: "214, 168, 90", // gold
    description:
      "A premium business website for a vehicle inspection company, built to create trust, explain services clearly, and turn visitors into inquiries.",
    detail: "Designed for trust, clarity, and conversion.",
    url: "https://crescentcarcheck.com",
    preview: <CarInspectionPreview />,
    span: "lg:col-span-7",
  },
  {
    name: "MubarakAuto Website",
    type: "Website",
    glow: "52, 186, 178", // teal
    description:
      "A digital presence for a B2B spare parts business, focused on credibility, structure, and easier client communication.",
    detail: "Built for structure, credibility, and clearer client communication.",
    url: "https://mubarakauto.ae",
    preview: <MubarakAutoPreview />,
    span: "lg:col-span-5",
  },
  {
    name: "Untold Archives Website",
    type: "Media Brand",
    glow: "224, 98, 110", // crimson
    description:
      "A cinematic web experience for a documentary-style media brand, built around storytelling, atmosphere, and visual identity.",
    detail: "A cinematic web presence for a documentary-style media brand.",
    url: "https://untoldarchives.com",
    preview: <UntoldArchivesPreview />,
    span: "lg:col-span-5",
  },
  {
    name: "Crescent Car Software",
    type: "Internal Tool",
    glow: "77, 163, 255", // blue
    technical: true,
    description:
      "A custom reporting tool designed to organize inspection data and generate polished client-facing reports.",
    detail: "Built to simplify reporting and client delivery.",
    preview: <CrescentPreview />,
    span: "lg:col-span-7",
  },
  {
    name: "Mahjong Website Redesign",
    type: "Redesign",
    glow: "168, 142, 245", // violet
    status: "In Progress",
    description:
      "A refined redesign focused on visual clarity, smoother navigation, and a more premium brand experience.",
    detail: "Sharper hierarchy, calmer surfaces, smoother navigation.",
    preview: <MahjongPreview />,
    span: "lg:col-span-12",
  },
];

function ProjectCard({
  project,
  index,
  wide,
}: {
  project: Project;
  index: number;
  wide?: boolean;
}) {
  // Wide card uses a grid for the side-by-side split. Grid degrades safely: if
  // the lg: classes ever don't apply, it falls back to the base full-width
  // stack (preview on top, text below) rather than a broken half-width column.
  const shellClass = `group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-edge hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] ${
    wide ? "lg:grid lg:grid-cols-[42%_minmax(0,1fr)]" : ""
  }`;

  const inner = (
    <>
      <div
        aria-hidden
        className={`relative shrink-0 overflow-hidden border-b border-line ${
          wide
            ? "h-56 lg:h-auto lg:min-h-[15rem] lg:border-b-0 lg:border-r"
            : "h-56 sm:h-64"
        }`}
      >
        {/* Scroll drift underneath, hover zoom on top: both transforms survive */}
        <ParallaxPreview>
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.025]">
            {project.preview}
          </div>
        </ParallaxPreview>
      </div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        {/* Ghost index watermark */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-5 top-4 font-display text-[2.6rem] font-semibold leading-none text-ivory/[0.05] transition-colors duration-500 group-hover:text-ivory/[0.09]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`micro rounded border px-2.5 py-1.5 ${
              project.technical
                ? "border-blue/30 bg-blue/[0.07] text-blue shadow-[0_0_14px_rgba(77,163,255,0.12)]"
                : "border-line bg-raised text-fog"
            }`}
          >
            {project.type}
          </span>
          {project.status && (
            <span className="micro rounded border border-gold/40 bg-gold/[0.07] px-2.5 py-1.5 text-gold">
              {project.status}
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-xl font-semibold text-ivory">
          {project.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fog">{project.description}</p>

        <p className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-2 pt-5 text-[13px] text-ivory/70">
          <span className="h-px w-5 shrink-0 bg-gold/70 transition-all duration-500 group-hover:w-9" />
          <span className="flex-1">{project.detail}</span>
          {project.url && (
            <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-gold">
              Visit site
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path
                  d="M3.5 12.5 12.5 3.5M5.5 3.5h7v7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </p>
      </div>
    </>
  );

  return (
    <SpotlightCard color={project.glow} className="h-full rounded-lg">
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name}, visit live site`}
          data-cursor-label="Visit"
          className={shellClass}
        >
          {inner}
        </a>
      ) : (
        <article className={shellClass}>{inner}</article>
      )}
    </SpotlightCard>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-24 bg-pit">
      <ScrollFade className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          title={
            <>
              Work built for{" "}
              <em className="serif-accent">real businesses</em>, not just
              portfolios.
            </>
          }
          lead="Websites, internal tools, and brand experiences, each one designed around a specific business problem."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.12} className={p.span}>
              <ProjectCard
                project={p}
                index={i}
                wide={p.span === "lg:col-span-12"}
              />
            </Reveal>
          ))}
        </div>
      </ScrollFade>
    </section>
  );
}
