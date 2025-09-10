import { cn } from "@/lib/utils";
import { LayoutDashboard, Newspaper, Users } from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Posts", href: "/posts", icon: Newspaper },
];

interface SidebarNavigationProps {
  onNavigate?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  onNavigate,
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const itemIsActive = isActive(item.href);

        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={() =>
              cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                itemIsActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )
            }
            onClick={onNavigate}
          >
            <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className="bg-sidebar border-sidebar-border flex h-full w-52 flex-col border-r">
      {/* Header */}
      <div className="border-sidebar-border border-b px-6 py-5">
        <h2 className="text-sidebar-foreground text-2xl font-semibold">
          Dashboard
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <SidebarNavigation />
      </div>
    </div>
  );
};
