"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import ProfileForm from "@/components/ProfileForm";
import { useAuth } from "@/lib/hooks/useAuth";
import { signInWithGoogle } from "@/lib/firebase/firebaseUtils";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        {user ? (
          <div>
            {isEditing ? (
              <div>
                <ProfileForm />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Cancel Editing
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="flex flex-col items-center mb-6">
                  <div className="h-24 w-24 rounded-full overflow-hidden relative mb-4">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-gray-500 text-2xl">
                          {user.displayName?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold">
                    {user.displayName || "Anonymous User"}
                  </h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-gray-500 text-center">
                    Click Edit Profile to add more information about yourself
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="mb-4">Please sign in to view your profile</p>
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