"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Hamburger from "@/components/Hamburger";
import AuthLoading from "@/components/AuthLoading";
import { useAuth } from "@/Auth";
import { deleteSession } from "@/app/lib/actions";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import NavigationHistory from "@/components/ui/NavigationHistory";
import PageTransition from "@/components/ui/PageTransition";

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSidebarState = localStorage.getItem("sidebarCollapsed");
      if (savedSidebarState !== null) {
        setSidebarCollapsed(JSON.parse(savedSidebarState));
      }
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setSidebarCollapsed(newState);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isMobileMenuOpen) {
        document.body.classList.add("mobile-menu-open");
      } else {
        document.body.classList.remove("mobile-menu-open");
      }

      return () => {
        document.body.classList.remove("mobile-menu-open");
      };
    }

    // Return undefined for server-side rendering
    return undefined;
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await deleteSession();
  };

  const getPageTitle = () => {
    const routeTitles: { [key: string]: string } = {
      "/dashboard": "Dashboard",
      "/dashboard/employee-management/lists": "Employee Lists",
      "/dashboard/employee-management/birthday": "Employee Birthday",
      "/dashboard/employee-management/leave": "Annual Leave",
      "/dashboard/user-management/list": "User List",
      "/dashboard/user-management/roles": "User Roles",
      "/dashboard/system-management/broadcast": "Broadcast",
      "/dashboard/system-management/logs": "View System Logs",
    };
    if (typeof pathname === "string") {
      return routeTitles[pathname] || "Dashboard";
    }
    return "Dashboard";
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <AuthLoading />;
  }

  return (
    <div
      className={`flex h-screen bg-secondary ${
        isMobileMenuOpen ? "mobile-menu-open" : ""
      }`}
    >
      <Sidebar
        isCollapsed={isMobileMenuOpen ? false : isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isMobileMenuOpen ? "main-content-mobile" : ""
        }`}
      >
        <header
          className={`main-header flex items-center justify-between h-16 px-4 ${
            isMobileMenuOpen ? "mobile-blur" : ""
          }`}
        >
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="toggle-button hidden md:flex relative p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-100"
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <div
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-200 ${
                    isSidebarCollapsed ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-200 ${
                    isSidebarCollapsed ? "opacity-0 scale-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-200 ${
                    isSidebarCollapsed ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></div>
              </div>
              <div
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-200 border border-white shadow-sm ${
                  isSidebarCollapsed
                    ? "bg-red-500 scale-110"
                    : "bg-green-500 scale-100"
                }`}
              ></div>
            </button>
            <div className="mobile-menu-button md:hidden">
              <Hamburger
                isActive={isMobileMenuOpen}
                onClick={toggleMobileMenu}
              />
            </div>
            <h1 className="ml-4 text-xl font-semibold text-gray-700">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <NavigationHistory />
            <div className="text-sm text-gray-600 hidden sm:block">
              Welcome back, {user}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
            <div className="user-avatar w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium">
                {user ? user.charAt(0).toUpperCase() : "A"}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AppContent;
