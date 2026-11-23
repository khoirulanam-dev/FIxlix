import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCount?: boolean;
}

export function StarRating({
  rating,
  totalReviews,
  size = "md",
  className,
  showCount = true,
}: StarRatingProps) {
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const roundedRating = Number(rating || 0).toFixed(1);

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              iconSizes[size],
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-500"
                : "text-slate-200 fill-slate-100"
            )}
          />
        ))}
      </div>
      <span className={cn("font-semibold text-slate-900", textSizes[size])}>
        {roundedRating}
      </span>
      {showCount && totalReviews !== undefined && (
        <span className={cn("text-slate-500 font-normal", textSizes[size])}>
          ({totalReviews} ulasan)
        </span>
      )}
    </div>
  );
}

