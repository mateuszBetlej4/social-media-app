"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import CreatePostForm from "@/components/CreatePostForm";
import { useAuth } from "@/lib/hooks/useAuth";
import { signInWithGoogle } from "@/lib/firebase/firebaseUtils";

export default function CreatePostPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        
        {user ? (
          <CreatePostForm />
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="mb-4">Please sign in to create a post</p>
            <button
              onClick={signInWithGoogle}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </main>
      <Navigation />
    </div>
  );
}