type Props = { title: string; updated: string; children: React.ReactNode };

export function LegalPage({ title, updated, children }: Props) {
  return (
    <article className="bg-ground px-4 pb-28 pt-36 sm:px-8 sm:pt-44">
      <div className="prose-legal mx-auto max-w-[720px]">
        <p className="eyebrow">Last updated {updated}</p>
        <h1 className="mt-4 text-section font-medium">{title}</h1>
        {children}
      </div>
    </article>
  );
}
