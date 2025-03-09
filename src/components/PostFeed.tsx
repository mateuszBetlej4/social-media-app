"use client";

import { useState, useEffect } from "react";
import { getDocuments } from "@/lib/firebase/firebaseUtils";
import Post from "./Post";
import { useAuth } from "@/lib/hooks/useAuth";

interface PostData {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: any[];
  createdAt: number;
}

export default function PostFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getDocuments("posts");
        
        // Sort by createdAt in descending order (newest first)
        const sortedPosts = postsData
          .filter((post): post is PostData => 'createdAt' in post)
          .sort((a, b) => b.createdAt - a.createdAt);
        
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">No posts yet</p>
        {user && (
          <p className="text-sm">
            Be the first to create a post! Go to the Create Post tab to get started.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          userId={post.userId}
          userName={post.userName}
          userImage={post.userImage}
          content={post.content}
          imageUrl={post.imageUrl}
          likes={post.likes || []}
          comments={post.comments || []}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}