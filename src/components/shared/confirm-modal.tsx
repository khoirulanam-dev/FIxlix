"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "warning",
  loading = false,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const iconConfig = {
    danger: {
      icon: AlertCircle,
      bg: "bg-red-50 text-red-600 border-red-200",
      btn: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-50 text-amber-600 border-amber-200",
      btn: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    success: {
      icon: CheckCircle2,
      bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50 text-blue-600 border-blue-200",
      btn: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const current = iconConfig[variant];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200/90 z-10 animate-in zoom-in-95 duration-200 space-y-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${current.bg}`}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="space-y-1 flex-1 pr-6">
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border-slate-200 text-slate-700 text-xs font-semibold px-4"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl text-xs font-semibold px-5 shadow-xs gap-1.5 ${current.btn}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
