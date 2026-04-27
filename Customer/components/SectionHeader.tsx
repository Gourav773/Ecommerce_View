import Link from "next/link";

export default function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-slate-800 md:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="text-sm font-semibold text-[var(--color-secondary)] hover:underline">
          View all
        </Link>
      ) : null}
    </div>
  );
}
