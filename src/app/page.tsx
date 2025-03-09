import { Suspense } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import PostFeed from "@/components/PostFeed";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Home Feed</h1>
        <Suspense fallback={<div className="text-center py-10">Loading posts...</div>}>
          <PostFeed />
        </Suspense>
      </main>
      <Navigation />
    </div>
  );
}