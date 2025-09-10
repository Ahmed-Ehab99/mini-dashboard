import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActionButton from "@/components/ui/custom/action-button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService } from "@/services/api";
import { Activity, Newspaper, TrendingUp, UserPlus, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await apiService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        toast.error("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
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
            onClick={() => navigate("/users")}
            className="w-fit"
            Icon={UserPlus}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            description="All registered users"
            icon={Users}
            trend={{
              value: stats?.userGrowth || "+0%",
              isPositive: true,
            }}
          />
          <StatsCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            description="Currently active"
            icon={Activity}
            trend={{
              value: "+5.2%",
              isPositive: true,
            }}
          />
          <StatsCard
            title="New This Month"
            value={stats?.newUsersThisMonth || 0}
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
                onClick={() => navigate("/users")}
              >
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/posts")}
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
};

export default Dashboard;
