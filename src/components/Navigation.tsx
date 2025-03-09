"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { HomeIcon, PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  if (!user) return null;

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Create Post", href: "/create", icon: PlusCircleIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}