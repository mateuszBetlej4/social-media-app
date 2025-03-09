"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { updateDocument } from "@/lib/firebase/firebaseUtils";
import { useAuth } from "@/lib/hooks/useAuth";

interface PostProps {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  createdAt: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: number;
}

export default function Post({
  id,
  userId,
  userName,
  userImage,
  content,
  imageUrl,
  likes,
  comments,
  createdAt,
}: PostProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localLikes, setLocalLikes] = useState(likes);
  const [localComments, setLocalComments] = useState(comments);

  const isLiked = user ? localLikes.includes(user.uid) : false;
  
  const handleLike = async () => {
    if (!user) return;
    
    let updatedLikes = [...localLikes];
    
    if (isLiked) {
      updatedLikes = updatedLikes.filter(id => id !== user.uid);
    } else {
      updatedLikes.push(user.uid);
    }
    
    setLocalLikes(updatedLikes);
    await updateDocument("posts", id, { likes: updatedLikes });
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      content: newComment,
      createdAt: Date.now(),
    };
    
    const updatedComments = [...localComments, comment];
    setLocalComments(updatedComments);
    setNewComment("");
    
    await updateDocument("posts", id, { comments: updatedComments });
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full overflow-hidden relative mr-3">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-500 text-xl">{userName.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{userName}</h3>
            <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
          </div>
        </div>
        
        <p className="mb-3">{content}</p>
        
        {imageUrl && (
          <div className="relative h-64 w-full mb-3 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between border-t pt-3">
          <button 
            onClick={handleLike}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500 mr-1" />
            ) : (
              <HeartIcon className="h-5 w-5 mr-1" />
            )}
            <span>{localLikes.length}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
            <span>{localComments.length}</span>
          </button>
        </div>
      </div>
      
      {showComments && (
        <div className="bg-gray-50 p-4 border-t">
          {localComments.length > 0 ? (
            <div className="mb-4 space-y-3">
              {localComments.map(comment => (
                <div key={comment.id} className="flex">
                  <div className="font-medium mr-2">{comment.userName}:</div>
                  <div>{comment.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">No comments yet</p>
          )}
          
          {user && (
            <form onSubmit={handleAddComment} className="flex">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}