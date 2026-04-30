import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title:       string;
  value:       string | number;
  icon?:       LucideIcon;
  trend?:      { value: number; label: string };
  isLoading?:  boolean;
  className?:  string;
  iconColor?:  string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading = false,
  className,
  iconColor = "text-brand",
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className={cn("card p-5 space-y-3", className)}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  const trendPositive = (trend?.value ?? 0) >= 0;

  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          {trendPositive ? (
            <TrendingUp size={13} className="text-success" />
          ) : (
            <TrendingDown size={13} className="text-danger" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trendPositive ? "text-success" : "text-danger"
            )}
          >
            {trendPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-neutral-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}