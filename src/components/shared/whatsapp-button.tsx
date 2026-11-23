import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  phone: string;
  technicianName: string;
  serviceName?: string;
  variant?: "default" | "outline" | "whatsapp";
  size?: "default" | "sm" | "lg";
  className?: string;
  text?: string;
}

export function WhatsAppButton({
  phone,
  technicianName,
  serviceName,
  variant = "whatsapp",
  size = "default",
  className,
  text = "Konsultasi WhatsApp",
}: WhatsAppButtonProps) {
  const message = serviceName
    ? `Halo Mas/Pak ${technicianName}, saya melihat layanan "${serviceName}" di Fixlix dan ingin berkonsultasi mengenai perbaikan perangkat elektronik saya.`
    : `Halo Mas/Pak ${technicianName}, saya menemukan profil Anda di Fixlix dan ingin berkonsultasi mengenai servis elektronik.`;

  const url = buildWhatsAppUrl(phone, message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-block", className)}
    >
      <Button variant={variant} size={size} className="w-full gap-2">
        <MessageCircle className="w-4 h-4 fill-white text-white" />
        <span>{text}</span>
      </Button>
    </a>
  );
}

