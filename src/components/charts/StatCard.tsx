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
  brand:   { bg: "bg-primary/10", text: "text-primary" },
  success: { bg: "bg-success/15", text: "text-success-dark" },
  warning: { bg: "bg-warning/15", text: "text-warning-dark" },
  danger:  { bg: "bg-danger/10", text: "text-danger" },
  neutral: { bg: "bg-muted", text: "text-muted-foreground" },
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
      <Card padding className={cn("space-y-3", className)}>
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
      className={cn("relative", className)}
    >
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
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
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}