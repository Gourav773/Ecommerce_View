import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
];

export default function AppFooter() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-[var(--color-primary)] text-slate-200">
      <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-3 py-10 sm:px-4 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">ShopSphere</h3>
          <p className="text-sm text-slate-300">
            Premium shopping experience inspired by modern Indian marketplaces.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-100">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-100">Customer Care</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            <span>Help Center</span>
            <span>Shipping Policy</span>
            <span>Returns & Refunds</span>
            <span>Security & Payments</span>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-100">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            <span>support@shopsphere.in</span>
            <span>+91 90000 00000</span>
            <span>Mon-Sat, 9 AM - 8 PM</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-3 py-3 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
