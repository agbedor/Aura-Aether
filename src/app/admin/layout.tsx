"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PanelsTopLeft, Package, ShoppingCart, ExternalLink, Sparkles } from "lucide-react";

const navigation = [
  { label: "Overview & orders", href: "/admin", icon: LayoutDashboard },
  { label: "Website editor", href: "/admin/content?section=home", icon: PanelsTopLeft },
  { label: "Product catalogue", href: "/admin?tab=products", icon: Package },
  { label: "Add a fragrance", href: "/admin?tab=new-product", icon: Sparkles },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-shell min-h-screen bg-[#F6F7F9] text-[#20242B]">
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-[258px] flex-col border-r border-[#E7E9EE] bg-white lg:flex">
        <Link href="/admin" className="flex h-[86px] items-center gap-3 border-b border-[#ECEEF2] px-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#20242B] text-white"><Sparkles size={19} /></span>
          <span>
            <span className="block text-sm font-bold tracking-tight">Aura &amp; Aether</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#858B96]">Store management</span>
          </span>
        </Link>
        <div className="px-4 pt-7">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9AA0AA]">Workspace</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = item.href.startsWith("/admin/content")
                ? pathname.startsWith("/admin/content")
                : pathname === "/admin" && item.label === "Overview & orders";
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className={`admin-nav-link flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-200 ${active ? "bg-[#F0F2F6] text-[#20242B]" : "text-[#747B87] hover:bg-[#F7F8FA] hover:text-[#20242B]"}`}>
                  <Icon size={17} strokeWidth={1.8} />
                  {item.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#B77F60]" />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-[#F7F3EF] p-4">
            <p className="text-xs font-bold text-[#34302D]">Need to check the shop?</p>
            <p className="mt-1 text-[11px] leading-5 text-[#77716C]">Open the customer-facing website in a new tab.</p>
            <Link href="/" target="_blank" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#8B5D45] hover:gap-3 transition-all">View live store <ExternalLink size={13} /></Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[258px]">
        <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-[#E7E9EE] bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9AA0AA]">Aura &amp; Aether / Admin</p>
            <p className="mt-1 text-sm font-bold">{pathname.startsWith("/admin/content") ? "Website editor" : "Store management"}</p>
          </div>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-[#E2E5EA] px-3 py-2 text-xs font-semibold text-[#5E6571] transition-colors hover:border-[#C7A48F] hover:text-[#8B5D45]"><ExternalLink size={14} /> View storefront</Link>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-[#E7E9EE] bg-white px-4 py-3 lg:hidden">
          {navigation.map((item) => <Link key={item.label} href={item.href} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${pathname.startsWith("/admin/content") === item.href.startsWith("/admin/content") ? "bg-[#20242B] text-white" : "bg-[#F3F4F6] text-[#626976]"}`}>{item.label}</Link>)}
        </nav>
        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
