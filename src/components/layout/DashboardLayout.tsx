import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Outlet } from "react-router";
import { Button } from "../ui/button";
import { Sidebar, SidebarNavigation } from "./Sidebar";
import ThemeMenu from "./ThemeMenu";
import UserMenu from "./UserMenu";

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="bg-background border-border relative z-30 flex shrink-0 items-center justify-between border-b px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* Mobile Sheet Sidebar Toggle */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="border-border border-b px-6 py-5">
                  <SheetTitle className="text-left text-xl font-semibold">
                    Dashboard
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 p-4">
                  <SidebarNavigation onNavigate={() => setSidebarOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-foreground truncate text-base font-semibold sm:text-lg">
              Mini Dashboard
            </h1>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeMenu />
            <UserMenu user={user} logout={logout} />
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
