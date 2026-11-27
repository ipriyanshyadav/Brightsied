import Link from "next/link";
import type { ProcessStep } from "@/lib/content/types";
import { LiveTile } from "@/components/ui/LiveTile";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { Tilt } from "@/components/ui/Tilt";

// A written scope, ticked off together.
function DiscoverVisual() {
  const rows: [string, string][] = [
    ["Who will use it", "#1fbf86"],
    ["What it must do", "#1fbf86"],
    ["Budget and timeline", "#1fbf86"],
    ["What success looks like", "#6f9cff"],
  ];
  return (
    <div className="panel-3d flex h-full flex-col justify-center gap-2 p-5">
      <p className="px-1 pb-1 text-[11px] text-white/45">Scope, agreed in writing</p>
      {rows.map(([label, c]) => (
        <div key={label} className="panel-cell flex items-center gap-3 rounded-lg px-3 py-2 text-[12px] text-white/80">
          <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: c, boxShadow: `0 0 10px ${c}88` }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.5 4.2l1.7 1.7L6.5 2.4" />
            </svg>
          </span>
          <span className="truncate">{label}</span>
        </div>
      ))}
    </div>
  );
}

// Screens sketched and agreed before anything is built.
function DesignVisual() {
  return (
    <div className="card-soft flex h-full items-center justify-center p-5">
      <div className="panel-3d flex w-full flex-col gap-2.5 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-10 rounded-full bg-white/70" />
          <span className="ml-auto h-5 w-14 rounded-md bg-[linear-gradient(180deg,#5b7bff,#2f4ae0)] shadow-[0_0_12px_-2px_rgba(59,91,255,0.7)]" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["#1fbf86", "#f59e0b", "#6f9cff"].map((c) => (
            <span key={c} className="panel-cell flex h-12 flex-col justify-end rounded-lg p-2">
              <span className="h-1.5 w-2/3 rounded-full" style={{ background: c }} />
            </span>
          ))}
        </div>
        {[90, 70, 80].map((w) => (
          <span key={w} className="panel-cell flex h-6 items-center rounded-md px-2">
            <span className="h-1.5 rounded-full bg-white/25" style={{ width: `${w}%` }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function IntegrateVisual() {
  return (
    <div className="panel-3d relative h-full overflow-hidden">
      <div className="aurora left-[10%] top-[20%] h-[45%] w-[55%] bg-[#6a45ff] opacity-40" />
      <div className="aurora bottom-[10%] right-[5%] h-[40%] w-[50%] bg-[#ff5a3c] opacity-25" />
      <LiveTile kind="vectors" rotate={-10} sizes="160px" className="float-y absolute left-[12%] top-[14%] w-[38%]" />
      <LiveTile kind="api" rotate={8} sizes="150px" className="float-y absolute right-[10%] top-[28%] w-[34%] [animation-delay:-2.5s]" />
      <LiveTile kind="agents" rotate={-2} sizes="170px" className="float-y absolute bottom-[14%] left-[30%] w-[40%] [animation-delay:-4.5s]" />
    </div>
  );
}

function ShipVisual() {
  const chips: [string, string, string][] = [
    ["Live", "#1fbf86", "-6deg"],
    ["Secure", "#3b5bff", "4deg"],
    ["Backed up", "#f59e0b", "-3deg"],
    ["Watched", "#ff5a3c", "7deg"],
    ["Supported", "#7c4dff", "-8deg"],
  ];
  return (
    <div className="card-soft flex h-full flex-wrap content-center items-center justify-center gap-x-2 gap-y-3 p-5">
      {chips.map(([t, c, r]) => (
        <span
          key={t}
          className="sticker rounded-xl px-3 py-1 text-xl font-extrabold italic tracking-tight"
          style={{ color: c, rotate: r }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const visuals = [<DiscoverVisual key="d" />, <DesignVisual key="s" />, <IntegrateVisual key="b" />, <ShipVisual key="l" />];

export function Process({ steps }: { steps: ProcessStep[] }) {
  return (
    <section id="process" aria-labelledby="process-title" className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow">How we engage</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <BlurReveal id="process-title" className="max-w-[20ch] text-section font-medium">
            From first conversation to launch, one team.
          </BlurReveal>
          <Link href="/services#packages" className="btn-light rounded-xl px-4 py-2 text-sm font-medium">
            See ways to work with us
          </Link>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((p, i) => (
            <li key={p.title}>
              <Tilt max={6} className="group">
                <div
                  className="tilt-3d aspect-[4/5] overflow-hidden rounded-[22px] shadow-[0_30px_50px_-30px_rgba(0,0,0,0.45)] transition-shadow duration-500 group-hover:shadow-[0_40px_70px_-30px_rgba(0,0,0,0.55)]"
                  aria-hidden="true"
                >
                  {visuals[i]}
                </div>
              </Tilt>
              <h3 className="mt-4 text-lg font-medium tracking-tight">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
