"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addDocument, uploadFile } from "@/lib/firebase/firebaseUtils";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";

export default function CreatePostForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <p>Please sign in to create a post</p>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    if (!user) return;

    try {
      setIsSubmitting(true);

      let imageUrl = "";
      if (image) {
        const path = `posts/${user.uid}/${Date.now()}_${image.name}`;
        imageUrl = await uploadFile(image, path);
      }

      await addDocument("posts", {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userImage: user.photoURL || "",
        content,
        imageUrl: imageUrl || "",
        likes: [],
        comments: [],
        createdAt: Date.now(),
      });

      setContent("");
      setImage(null);
      setImagePreview(null);
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
        />
      </div>

      {imagePreview && (
        <div className="relative mb-4 h-64 w-full rounded-lg overflow-hidden">
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Add Image
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || (!content.trim() && !image)}
          className={`px-4 py-2 rounded-lg ${
            isSubmitting || (!content.trim() && !image)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}