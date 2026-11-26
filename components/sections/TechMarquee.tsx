// Rendered twice for a seamless loop; the copy is hidden from assistive tech.
export function TechMarquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li
          key={item}
          className={`px-8 text-2xl tracking-tight text-ink/70 sm:px-11 sm:text-[28px] ${
            i % 3 === 0 ? "font-extrabold italic" : i % 3 === 1 ? "font-medium" : "font-mono text-xl font-semibold uppercase sm:text-2xl"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="marquee-title" className="bg-ground py-16">
      <h2 id="marquee-title" className="text-center text-sm text-muted">
        The stack we ship on
      </h2>
      <div className="group mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="motion-loop flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
