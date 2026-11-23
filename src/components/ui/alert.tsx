import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-2xl border border-l-4 p-4 text-xs sm:text-sm transition-all duration-200 shadow-xs flex items-start gap-3.5 backdrop-blur-xs",
  {
    variants: {
      variant: {
        default:
          "bg-slate-50/90 text-slate-800 border-slate-200/90 border-l-slate-600",
        info: "bg-blue-50/70 text-blue-950 border-blue-200/80 border-l-blue-600",
        success:
          "bg-emerald-50/70 text-emerald-950 border-emerald-200/80 border-l-emerald-600",
        warning:
          "bg-amber-50/70 text-amber-950 border-amber-200/80 border-l-amber-500",
        destructive:
          "bg-red-50/70 text-red-950 border-red-200/80 border-l-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconWrapperVariants = cva(
  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform duration-200",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700 border-slate-200",
        info: "bg-blue-100 text-blue-700 border-blue-200/80",
        success: "bg-emerald-100 text-emerald-700 border-emerald-200/80",
        warning: "bg-amber-100 text-amber-800 border-amber-200/80",
        destructive: "bg-red-100 text-red-700 border-red-200/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: boolean | React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      icon = true,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      if (onDismiss) onDismiss();
    };

    const renderIcon = () => {
      if (icon === false) return null;
      if (typeof icon === "object" && icon !== null && React.isValidElement(icon)) {
        return (
          <div className={cn(iconWrapperVariants({ variant }))}>
            {icon}
          </div>
        );
      }

      const iconClass = "w-4 h-4";
      let IconComponent = Info;
      if (variant === "success") IconComponent = CheckCircle2;
      else if (variant === "warning") IconComponent = AlertTriangle;
      else if (variant === "destructive") IconComponent = AlertCircle;
      else if (variant === "info") IconComponent = Info;

      return (
        <div className={cn(iconWrapperVariants({ variant }))}>
          <IconComponent className={iconClass} />
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {renderIcon()}

        <div className="flex-1 min-w-0 pt-0.5 space-y-1">{children}</div>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0 -mr-1 -mt-1"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "font-bold leading-tight tracking-tight text-slate-900 text-sm",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs sm:text-sm leading-relaxed text-slate-700 font-normal", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
