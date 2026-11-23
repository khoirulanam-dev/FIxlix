import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 text-xs sm:text-sm [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:w-5 [&>svg]:h-5 transition-all shadow-xs",
  {
    variants: {
      variant: {
        default: "bg-slate-50 text-slate-800 border-slate-200 [&>svg]:text-slate-600",
        info: "bg-blue-50/80 text-blue-900 border-blue-200/80 [&>svg]:text-blue-600",
        success: "bg-emerald-50/80 text-emerald-900 border-emerald-200/80 [&>svg]:text-emerald-600",
        warning: "bg-amber-50/80 text-amber-900 border-amber-200/80 [&>svg]:text-amber-600",
        destructive: "bg-red-50/80 text-red-900 border-red-200/80 [&>svg]:text-red-600",
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
  icon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", icon = true, children, ...props }, ref) => {
    const defaultIcon = () => {
      switch (variant) {
        case "success":
          return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
        case "warning":
          return <AlertTriangle className="w-5 h-5 text-amber-600" />;
        case "destructive":
          return <AlertCircle className="w-5 h-5 text-red-600" />;
        case "info":
          return <Info className="w-5 h-5 text-blue-600" />;
        default:
          return <Info className="w-5 h-5 text-slate-600" />;
      }
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && defaultIcon()}
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight text-slate-900", className)}
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
    className={cn("text-xs leading-relaxed text-slate-600", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
