"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";

export default function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Social Media
          </Link>

          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {user.displayName?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="ml-2 text-sm hidden sm:inline">
                    {user.displayName || "User"}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}