import { cn } from "@/utils/cn";
import { Skeleton, Card, CardBody } from "@/components/ui";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatVariant = "brand" | "success" | "warning" | "danger" | "neutral";

interface StatCardProps {
  title:       string;
  value:       string | number;
  icon?:       LucideIcon;
  trend?:      { value: number; label: string };
  isLoading?:  boolean;
  className?:  string;
  variant?:    StatVariant;
  interactive?: boolean;
}

const variantStyles: Record<StatVariant, { bg: string; text: string }> = {
  brand:   { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-900 dark:text-white" },
  success: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  warning: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  danger:  { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400" },
  neutral: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400" },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading = false,
  className,
  variant = "brand",
  interactive = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card padding className={cn("space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800", className)}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </Card>
    );
  }

  const trendPositive = (trend?.value ?? 0) >= 0;
  const styles = variantStyles[variant];

  return (
    <Card 
      interactive={interactive}
      className={cn("relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800", className)}
    >
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          </div>
          {Icon && (
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", styles.bg)}>
              <Icon size={20} className={styles.text} />
            </div>
          )}
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            {trendPositive ? (
              <TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown size={13} className="text-rose-600 dark:text-rose-400" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {trendPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{trend.label}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}