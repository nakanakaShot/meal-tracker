"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/capture", label: "記録", icon: "📸" },
  { href: "/history", label: "履歴", icon: "📊" },
  { href: "/settings", label: "設定", icon: "⚙️" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 min-w-[64px] ${
                isActive ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
