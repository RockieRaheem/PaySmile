"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface HeartButtonProps {
  size?: number;
  initialLiked?: boolean;
  onChange?: (liked: boolean) => void;
  ariaLabel?: string;
  variant?: "wish" | "vote";
  className?: string;
  asChild?: boolean;
}

export default function HeartButton({
  size = 20,
  initialLiked = false,
  onChange,
  ariaLabel = "Toggle like",
  variant = "wish",
  className = "",
  asChild = false,
}: HeartButtonProps) {
  const [liked, setLiked] = useState<boolean>(initialLiked);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    onChange && onChange(next);
  };

  // Colors: wish -> red, vote -> green
  const colorClass = liked
    ? variant === "vote"
      ? "text-green-500"
      : "text-red-500"
    : "text-muted-foreground";

  const heartIcon = (
    <Heart style={{ width: size, height: size }} className={`${colorClass}`} />
  );

  if (asChild) {
    // Render only the icon so parent can control layout
    return (
      <span
        role="button"
        aria-pressed={liked}
        aria-label={ariaLabel}
        onClick={handleToggle}
        className={`inline-flex items-center justify-center rounded-full p-1 transition-colors duration-150 hover:opacity-90 focus:outline-none ${className}`}
      >
        {heartIcon}
      </span>
    );
  }

  return (
    <button
      aria-pressed={liked}
      aria-label={ariaLabel}
      onClick={handleToggle}
      className={`inline-flex items-center justify-center rounded-full p-1 transition-colors duration-150 hover:opacity-90 focus:outline-none ${className}`}
    >
      {heartIcon}
    </button>
  );
}
