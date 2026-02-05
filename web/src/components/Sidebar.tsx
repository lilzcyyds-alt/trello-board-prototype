import Link from "next/link";
import { useRouter } from "next/router";

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const router = useRouter();
  const active = router.pathname === href || router.asPath === href;

  return (
    <Link
      href={href}
      className={
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors " +
        (active
          ? "bg-slate-200 text-slate-900"
          : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900")
      }
    >
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
      <div className="px-4 py-4">
        <div className="text-xs font-semibold tracking-wide text-slate-500">
          Workspace
        </div>
        <div className="mt-1 text-base font-semibold text-slate-900">
          Trello Prototype
        </div>
      </div>

      <nav className="px-2 pb-4">
        <div className="space-y-1">
          <NavItem href="/inbox" label="Inbox" />
          <NavItem href="/board/demo" label="Board" />
        </div>
      </nav>

      <div className="mt-auto px-4 py-4">
        <div className="text-xs text-slate-500">
          Pages Router · Next.js + Tailwind
        </div>
      </div>
    </aside>
  );
}
