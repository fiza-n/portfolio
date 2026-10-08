import { site } from "@/content/site";

/** The rear-panel spec plate. Server component: no JS shipped. */
export function Specs() {
  return (
    <section id="specs" className="py-16">
      <div className="wrap">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-3.5">
          <h2 className="font-display text-[1.75rem] font-bold tracking-[-0.03em]">System specifications</h2>
          <span className="label">Rear panel, model FN-26</span>
        </div>
        <div className="relative rounded-[10px] border border-line bg-surface px-[26px] pb-[18px] pt-[26px] font-mono">
          <span aria-hidden="true" className="absolute left-2.5 top-2 text-xs text-ink-2">+</span>
          <span aria-hidden="true" className="absolute right-2.5 top-2 text-xs text-ink-2">+</span>
          <div className="mb-1.5 flex flex-wrap justify-between gap-3 border-b-2 border-ink pb-2.5">
            <strong className="font-display text-lg tracking-tight">FN-26 Engineering Workstation</strong>
            <span className="label">Karachi · Pakistan</span>
          </div>
          <dl className="grid grid-cols-1 min-[880px]:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
            {site.specs.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="border-line pt-3.5 text-[0.8125rem] uppercase tracking-[0.08em] text-ink-2 min-[880px]:border-b min-[880px]:border-dashed min-[880px]:pb-3">
                  {k}
                </dt>
                <dd className="border-b border-dashed border-line py-3 text-[0.95rem]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap justify-between gap-3 pt-3 text-xs text-ink-2">
            <span>Input: coffee, 220V~ 50Hz</span>
            <span>Serial No. BL-2026-0001</span>
          </div>
        </div>
      </div>
    </section>
  );
}
