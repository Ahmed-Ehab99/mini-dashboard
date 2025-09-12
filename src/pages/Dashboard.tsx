import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActionButton from "@/components/ui/custom/action-button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Activity, Newspaper, TrendingUp, UserPlus, Users } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";

const Dashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();

  // Use React Query for better caching and performance
  const {
    data: stats,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: apiService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 3,
  });

  // Memoize navigation handlers
  const handleNavigateToUsers = useCallback(() => {
    navigate("/users");
  }, [navigate]);

  const handleNavigateToPosts = useCallback(() => {
    navigate("/posts");
  }, [navigate]);

  // Memoize the loading skeleton
  const loadingSkeleton = useMemo(
    () => (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-9 w-59" />
          <Skeleton className="h-9 w-36.5" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-34.5 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-59 w-full" />
          ))}
        </div>
      </div>
    ),
    [],
  );

  if (loading) {
    return loadingSkeleton;
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">Failed to load dashboard stats.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-foreground text-2xl font-bold">
            Dashboard Overview
          </h1>
          <ActionButton
            text="Manage Users"
            onClick={handleNavigateToUsers}
            className="w-fit"
            Icon={UserPlus}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={(stats as Stats)?.totalUsers || 0}
            description="All registered users"
            icon={Users}
            trend={{
              value: (stats as Stats)?.userGrowth || "+0%",
              isPositive: true,
            }}
          />
          <StatsCard
            title="Active Users"
            value={(stats as Stats)?.activeUsers || 0}
            description="Currently active"
            icon={Activity}
            trend={{
              value: "+5.2%",
              isPositive: true,
            }}
          />
          <StatsCard
            title="New This Month"
            value={(stats as Stats)?.newUsersThisMonth || 0}
            description="Recent registrations"
            icon={UserPlus}
            trend={{
              value: "+23%",
              isPositive: true,
            }}
          />
          <StatsCard
            title="Growth Rate"
            value="12.5%"
            description="Monthly growth"
            icon={TrendingUp}
            trend={{
              value: "+2.1%",
              isPositive: true,
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleNavigateToUsers}
              >
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleNavigateToPosts}
              >
                <Newspaper className="mr-2 h-4 w-4" />
                View All Posts
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-success h-2 w-2 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-muted-foreground text-xs">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User profile updated</p>
                    <p className="text-muted-foreground text-xs">
                      15 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-warning h-2 w-2 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      System maintenance scheduled
                    </p>
                    <p className="text-muted-foreground text-xs">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
