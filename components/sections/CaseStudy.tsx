"use client";

import { useEffect, useRef, useState } from "react";
import { caseStudy } from "@/lib/content";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// Sample rows for the illustrative app window; not real data.
const rfqs = [
  { id: "RFQ-0142", item: "Hot-rolled steel coils", bids: 4, state: "Sealed", tone: "bg-[#2a2a2a] text-white/70" },
  { id: "RFQ-0139", item: "Industrial fasteners", bids: 6, state: "Evaluating", tone: "bg-[#3a2e10] text-[#ffd38a]" },
  { id: "RFQ-0137", item: "Packaging film, 40 µm", bids: 3, state: "Approved", tone: "bg-[#103a2a] text-[#7ff0c0]" },
  { id: "RFQ-0131", item: "Servo motors, 2 kW", bids: 5, state: "PO issued", tone: "bg-[#1d2a55] text-[#9fb2ff]" },
];
const sidebar = ["Requisitions", "RFQs", "Bids", "Comparative statements", "Purchase orders", "Invoices", "Vendors", "Audit log"];

function AppWindow() {
  return (
    <div className="app-window panel-3d overflow-hidden rounded-[22px] text-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.65)]" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-panel-line px-4 py-3">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${c} 55%)`, boxShadow: `inset 0 -1px 1px #0005` }} />
        ))}
        <span className="ml-3 font-mono text-[11px] text-white/40">s2p / rfqs</span>
      </div>
      <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1">
        <ul className="border-r border-panel-line p-3 text-[13px] max-md:hidden">
          {sidebar.map((s) => (
            <li key={s} className={`rounded-lg px-3 py-2 ${s === "RFQs" ? "panel-cell text-white" : "text-white/45"}`}>
              {s}
            </li>
          ))}
        </ul>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium tracking-tight">Open RFQs</p>
            <span className="btn-light rounded-lg px-3 py-1.5 text-xs font-medium">New RFQ</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-panel-line">
            <div className="panel-cell grid grid-cols-[1fr_2fr_0.6fr_1fr] gap-2 px-4 py-2.5 font-mono text-[11px] text-white/40">
              <span>ID</span><span>Item</span><span>Bids</span><span>Status</span>
            </div>
            {rfqs.map((r) => (
              <div key={r.id} className="grid grid-cols-[1fr_2fr_0.6fr_1fr] items-center gap-2 border-t border-panel-line px-4 py-3 text-[13px]">
                <span className="font-mono text-white/60">{r.id}</span>
                <span className="truncate">{r.item}</span>
                <span className="font-mono text-white/60">{r.bids}</span>
                <span className={`w-fit rounded-md px-2 py-0.5 text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ${r.tone}`}>{r.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const services = [
  { id: "api", label: "FastAPI services" },
  { id: "rules", label: "Approval rules" },
  { id: "queue", label: "RabbitMQ" },
  { id: "worker", label: "Workers" },
  { id: "store", label: "MinIO documents" },
  { id: "db", label: "PostgreSQL" },
];

function Diagram({ step }: { step: number }) {
  const s = caseStudy.steps[step];
  const lit = new Set<string>(s.lit);
  return (
    <div className="panel-3d rounded-[20px] p-4 text-white sm:p-5">
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-white/40">
        <span>event</span>
        <span key={s.event} className="step-swap panel-cell rounded-md px-2 py-1 text-white/90">{s.event}</span>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {services.map((svc) => {
          const on = lit.has(svc.id);
          return (
            <li
              key={svc.id}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-3 text-[13px] transition-all duration-500 ${
                on ? "lit" : "panel-cell text-white/35"
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${on ? "bg-[#c4d0ff] shadow-[0_0_8px_2px_rgba(111,139,255,0.9)]" : "bg-white/20"}`} />
              {svc.label}
              {on && <span className="sr-only"> (used in this step)</span>}
            </li>
          );
        })}
      </ul>
      <div
        className={`mt-2 flex items-center gap-2.5 rounded-xl px-3 py-3 text-[13px] transition-all duration-500 ${
          lit.has("audit") ? "lit-amber" : "panel-cell text-white/35"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${lit.has("audit") ? "bg-[#ffc24a] shadow-[0_0_8px_2px_rgba(245,158,11,0.9)]" : "bg-white/20"}`} />
        Immutable audit log
      </div>
      <style>{`.step-swap{animation:step-swap .45s both var(--ease-out-soft)}@keyframes step-swap{from{opacity:0;transform:translateY(6px)}}`}</style>
    </div>
  );
}

export function CaseStudy() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  // The app window starts tipped back in 3D and stands up as it scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".app-window",
          { rotateX: 24, y: 70, scale: 0.9, transformOrigin: "50% 100%" },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: stage.current, start: "top 95%", end: "top 35%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: stage },
  );

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Case study</p>
          <BlurReveal id="work-title" className="mt-4 text-hero font-medium">
            Source-to-Pay, built solo.
          </BlurReveal>
          <p className="mx-auto mt-6 max-w-[54ch] text-ink/65">{caseStudy.summary}</p>
          <a href="#work-steps" className="btn-3d mt-7 inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
            Walk through it
          </a>
        </div>

        <div ref={stage} className="relative isolate mt-16 [perspective:1600px]">
          <div aria-hidden="true" className="aurora left-[10%] top-[20%] -z-10 h-[60%] w-[40%] bg-[#7f9bff] opacity-35" />
          <div aria-hidden="true" className="aurora right-[8%] top-[30%] -z-10 h-[50%] w-[35%] bg-[#ffb07a] opacity-30" />
          <AppWindow />
          <p className="mt-3 text-center text-xs text-muted">Illustrative screen with sample data.</p>
        </div>

        <div id="work-steps" className="mt-28 grid scroll-mt-24 gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
          <ol>
            {caseStudy.steps.map((step, i) => (
              <li
                key={step.title}
                data-step={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                aria-current={active === i ? "step" : undefined}
                className="flex flex-col justify-center py-10 lg:min-h-[58vh]"
              >
                <p className="eyebrow">Step {i + 1} of {caseStudy.steps.length}</p>
                <h3 className={`mt-3 text-split font-medium transition-colors duration-500 ${active === i ? "text-ink" : "lg:text-ink/25"}`}>
                  {step.title}
                </h3>
                <p className={`mt-4 max-w-md transition-colors duration-500 ${active === i ? "text-ink/65" : "lg:text-ink/25"}`}>{step.body}</p>
                <div className="mt-8 lg:hidden">
                  <Diagram step={i} />
                </div>
              </li>
            ))}
          </ol>
          <div className="hidden lg:block">
            <div className="card-soft sticky top-[calc(50vh-230px)] rounded-[28px] p-8">
              <Diagram step={active} />
              <ul className="mt-6 flex flex-col gap-2 text-sm text-ink/60">
                {caseStudy.rules.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ul className="mt-16 flex flex-wrap justify-center gap-2" aria-label="Stack">
          {caseStudy.stack.map((t) => (
            <li key={t} className="glass rounded-xl px-3.5 py-1.5 font-mono text-xs text-ink/70">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
