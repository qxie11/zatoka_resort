"use client";

import { useState, useEffect } from "react";
import { Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleMetricsProps {
  postId: string;
  initialViews: number;
  initialLikes: number;
  className?: string;
  variant?: "hero" | "bottom";
}

export function ArticleMetrics({
  postId,
  initialViews,
  initialLikes,
  className,
  variant = "bottom",
}: ArticleMetricsProps) {
  const [views, setViews] = useState(initialViews || 0);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    // Check if liked previously
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    if (likedPosts.includes(postId)) {
      setIsLiked(true);
    }

    // Handle views
    const viewedPosts = JSON.parse(localStorage.getItem("viewed_posts") || "[]");
    if (!viewedPosts.includes(postId)) {
      // Record view
      fetch(`/api/blog/${postId}/view`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.views) {
            setViews(data.views);
            viewedPosts.push(postId);
            localStorage.setItem("viewed_posts", JSON.stringify(viewedPosts));
          }
        })
        .catch(console.error);
    }
  }, [postId]);

  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const action = isLiked ? "unlike" : "like";
    
    // Optimistic update
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);

    try {
      const res = await fetch(`/api/blog/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      
      if (data.success && typeof data.likes === "number") {
        setLikes(data.likes);
        
        // Update local storage
        const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        if (action === "like") {
          likedPosts.push(postId);
        } else {
          const index = likedPosts.indexOf(postId);
          if (index > -1) likedPosts.splice(index, 1);
        }
        localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
      } else {
        // Revert on failure
        setLikes((prev) => (isLiked ? prev + 1 : prev - 1));
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error(error);
      // Revert on failure
      setLikes((prev) => (isLiked ? prev + 1 : prev - 1));
      setIsLiked(!isLiked);
    } finally {
      setIsLiking(false);
    }
  };

  if (variant === "hero") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 backdrop-blur-sm border border-white/10 text-slate-300 text-sm font-medium">
          <Eye className="w-4 h-4 text-teal-400" />
          <span>{views}</span>
        </div>
        <button
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all duration-300 text-sm font-medium",
            isLiked
              ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
              : "bg-slate-900/50 border-white/10 text-slate-300 hover:bg-white/10"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-transform duration-300", isLiked ? "fill-rose-400 text-rose-400 scale-110" : "")} />
          <span>{likes}</span>
        </button>
      </div>
    );
  }

  // Bottom variant
  return (
    <div className={cn("flex items-center justify-between p-4 md:p-6 rounded-2xl glass-card-dark border border-white/10", className)}>
      <div className="flex items-center gap-2 text-slate-300">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-white/5">
          <Eye className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Просмотры</p>
          <p className="font-bold text-white text-lg leading-none">{views}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <p className="hidden md:block text-sm text-slate-400">Понравилась статья?</p>
        <button
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl border shadow-lg transition-all duration-300",
            isLiked
              ? "bg-rose-500/20 border-rose-500/40 hover:bg-rose-500/30 text-rose-100"
              : "bg-slate-800 border-white/10 hover:border-teal-400/40 hover:bg-slate-700 text-white"
          )}
        >
          <Heart 
            className={cn("w-5 h-5 transition-all duration-500", isLiked ? "fill-rose-500 text-rose-500 scale-125" : "text-slate-300")} 
          />
          <span className="font-bold">{likes}</span>
        </button>
      </div>
    </div>
  );
}
