import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media App",
  description: "Connect with friends and share your moments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}