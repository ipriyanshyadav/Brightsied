import { process, site } from "@/lib/content";
import { LiveTile } from "@/components/ui/LiveTile";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { Tilt } from "@/components/ui/Tilt";

function DesignVisual() {
  const rows = [
    ["GET", "/rfqs", "#6f9cff"],
    ["POST", "/rfqs/{id}/bids", "#1fbf86"],
    ["PATCH", "/pos/{id}/approve", "#f59e0b"],
    ["GET", "/invoices/{id}/match", "#6f9cff"],
    ["POST", "/vendors", "#1fbf86"],
  ];
  return (
    <div className="panel-3d flex h-full flex-col justify-center gap-2 p-5">
      {rows.map(([m, p, c]) => (
        <div key={p} className="panel-cell flex items-center gap-3 rounded-lg px-3 py-2 font-mono text-[11px] text-white/80">
          <span className="w-10 font-semibold" style={{ color: c, textShadow: `0 0 10px ${c}88` }}>{m}</span>
          <span className="truncate">{p}</span>
        </div>
      ))}
    </div>
  );
}

function BuildVisual() {
  return (
    <div className="card-soft flex h-full items-center justify-center p-5">
      <pre className="panel-3d w-full overflow-hidden rounded-xl p-4 font-mono text-[11px] leading-relaxed text-white/70">
        <span className="text-[#9fb2ff]">@router.post</span>(<span className="text-[#ffd38a]">&quot;/pos/{"{id}"}/approve&quot;</span>)
        {"\n"}<span className="text-[#ff9f8a]">async def</span> approve(
        {"\n"}  id: UUID,
        {"\n"}  user: Checker = Depends(...),
        {"\n"}):
        {"\n"}  po = <span className="text-[#ff9f8a]">await</span> repo.get(id)
        {"\n"}  po.approve(by=user)
        {"\n"}  <span className="text-[#ff9f8a]">await</span> audit.log(po)
      </pre>
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
    ["K3s", "#1fbf86", "-6deg"],
    ["Jaeger", "#3b5bff", "4deg"],
    ["Grafana", "#f59e0b", "-3deg"],
    ["Loki", "#ff5a3c", "7deg"],
    ["Kong", "#7c4dff", "-8deg"],
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

const visuals = [<DesignVisual key="d" />, <BuildVisual key="b" />, <IntegrateVisual key="i" />, <ShipVisual key="s" />];

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow">Process</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <BlurReveal id="process-title" className="max-w-[20ch] text-section font-medium">
            From API design to production, end to end.
          </BlurReveal>
          <a
            href={site.resume}
            className="btn-light rounded-xl px-4 py-2 text-sm font-medium"
          >
            Download résumé
          </a>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
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
              <p className="mt-1 text-sm leading-relaxed text-ink/55">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
