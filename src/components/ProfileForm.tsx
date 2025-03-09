"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { updateDocument, uploadFile } from "@/lib/firebase/firebaseUtils";
import Image from "next/image";

interface UserProfile {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  photoURL: string;
}

export default function ProfileForm() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    photoURL: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      // Initialize with user data
      setProfile({
        displayName: user.displayName || "",
        bio: "",
        location: "",
        website: "",
        photoURL: user.photoURL || "",
      });
      
      // Try to fetch additional profile data from Firestore
      const fetchProfile = async () => {
        try {
          const profilesCollection = await fetch(`/api/profile?userId=${user.uid}`);
          const data = await profilesCollection.json();
          
          if (data.profile) {
            setProfile(prev => ({
              ...prev,
              ...data.profile,
            }));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      setSaveMessage(null);

      let photoURL = profile.photoURL;
      
      if (profileImage) {
        const path = `profiles/${user.uid}/${Date.now()}_${profileImage.name}`;
        photoURL = await uploadFile(profileImage, path);
      }

      const updatedProfile = {
        ...profile,
        photoURL,
      };

      // Save to Firestore
      await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          profile: updatedProfile,
        }),
      });

      setProfile(updatedProfile);
      setProfileImage(null);
      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-6">Please sign in to view your profile</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="mb-6 flex flex-col items-center">
        <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
          <Image
            src={imagePreview || profile.photoURL || "/default-avatar.png"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <label className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
          Change Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Display Name</label>
        <input
          type="text"
          name="displayName"
          value={profile.displayName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Bio</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Location</label>
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Website</label>
        <input
          type="url"
          name="website"
          value={profile.website}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {saveMessage && (
        <div 
          className={`mb-4 p-3 rounded-lg ${
            saveMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className={`px-6 py-2 rounded-lg ${
            isSaving
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}