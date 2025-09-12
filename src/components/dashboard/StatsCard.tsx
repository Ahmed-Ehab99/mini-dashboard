import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(
  ({ title, value, description, icon: Icon, trend, className }) => {
    return (
      <Card
        className={cn(
          "shadow-card transition-smooth hover:shadow-lg",
          className,
        )}
      >
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-xl font-medium">
                {title}
              </p>
              <div className="mt-1 flex items-baseline">
                <p className="text-card-foreground text-2xl font-bold">
                  {value}
                </p>
                {trend && (
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      trend.isPositive ? "text-success" : "text-destructive",
                    )}
                  >
                    {trend.value}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {description}
                </p>
              )}
            </div>
            <div className="ml-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Icon className="text-primary h-6 w-6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

StatsCard.displayName = "StatsCard";
