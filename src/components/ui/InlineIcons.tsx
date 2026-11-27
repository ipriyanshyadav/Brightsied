// Small inline controls that sit inside headline type, drawn from scratch as solid objects.
// Gradients and the soft shadow filter come from <SvgDefs> in the layout.

export function DialIcon() {
  return (
    <span className="tile-slot" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="h-full w-full overflow-visible">
        <g filter="url(#gt-soft)">
          <circle cx="20" cy="21.5" r="17.5" fill="#7d828d" />
          <circle cx="20" cy="20" r="17.5" fill="url(#gt-knob)" />
        </g>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="19.4" y="3.6" width="1.2" height="3" rx="0.6" fill="#000" opacity="0.22" transform={`rotate(${i * 30} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="11" fill="#f4f5f8" />
        <circle cx="20" cy="20" r="11" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="20" cy="20.6" r="11" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="0.8" />
        <rect x="18.8" y="10.5" width="2.4" height="7" rx="1.2" fill="#3b5bff" transform="rotate(38 20 20)" />
      </svg>
    </span>
  );
}

export function SliderIcon() {
  return (
    <span className="tile-slot" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="h-full w-full overflow-visible">
        {[8, 16, 24, 32].map((x, i) => {
          const y = [22, 10, 26, 15][i];
          return (
            <g key={x}>
              <rect x={x - 1.4} y="5" width="2.8" height="30" rx="1.4" fill="#b9bcc4" />
              <rect x={x - 1.4} y="5" width="2.8" height="1.4" rx="0.7" fill="#000" opacity="0.18" />
              <g filter="url(#gt-soft)">
                <rect x={x - 3.6} y={y + 1} width="7.2" height="6" rx="1.8" fill="#000" />
                <rect x={x - 3.6} y={y} width="7.2" height="6" rx="1.8" fill="url(#gt-cap)" />
              </g>
              <rect x={x - 2.4} y={y + 0.7} width="4.8" height="1" rx="0.5" fill="#fff" opacity="0.35" />
            </g>
          );
        })}
      </svg>
    </span>
  );
}

export function GlowWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block rounded-[0.22em] bg-[linear-gradient(180deg,#e4f6ff,#bfe8ff)] px-[0.12em] shadow-[inset_0_1px_0_#fff,0_0_0_2px_#8fd8ff,0_0_26px_6px_rgba(80,190,255,0.5)]">
      {children}
    </span>
  );
}
