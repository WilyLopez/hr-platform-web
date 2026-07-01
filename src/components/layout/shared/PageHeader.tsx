import { cn } from "@/utils/cn";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title:        string;
  description?: string;
  action?:      ReactNode;
  badge?:       ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?:   string;
}

export function PageHeader({
  title,
  description,
  action,
  badge,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight size={14} className="mx-2 flex-shrink-0" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-[300px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[300px]">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {badge && <div className="mt-1">{badge}</div>}
          </div>
          {description && (
            <p className="text-base text-muted-foreground mt-1 max-w-2xl">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}