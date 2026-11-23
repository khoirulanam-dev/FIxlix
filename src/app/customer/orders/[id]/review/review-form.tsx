"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";

interface ReviewFormProps {
  orderId: string;
}

export function ReviewForm({ orderId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      setError("Silakan tulis ulasan Anda minimal 5 karakter.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/customer/orders/${orderId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal mengirimkan ulasan.");
      }

      router.push(`/customer/orders/${orderId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Star Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-700">Rating Kepuasan *</Label>
        <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-500"
                    : "text-slate-200 fill-slate-100"
                }`}
              />
            </button>
          ))}
          <span className="ml-3 font-bold text-xs text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {hoverRating || rating} dari 5 Bintang
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="comment" className="text-xs font-semibold text-slate-700">
          Tulis Ulasan Pengalaman Anda *
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan kepuasan Anda terhadap kecepatan pengerjaan, ketelitian, dan kerapian teknisi..."
          rows={4}
          required
          className="rounded-xl border-slate-200 focus:border-emerald-500 text-xs sm:text-sm"
        />
        <p className="text-xs text-slate-500">
          Ulasan Anda akan tampil secara publik di profil teknisi untuk membantu pelanggan lainnya.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-11 rounded-xl shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Mengirimkan Ulasan...
            </>
          ) : (
            "Kirim Ulasan & Rating"
          )}
        </Button>
      </div>
    </form>
  );
}
