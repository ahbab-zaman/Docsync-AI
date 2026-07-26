import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export default function LoadingSpinner({ className, label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2" role="status" aria-live="polite">
      <div
        className={cn("h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent", className)}
      />
      {label && <span className="text-xs text-text-muted">{label}</span>}
    </div>
  );
}
