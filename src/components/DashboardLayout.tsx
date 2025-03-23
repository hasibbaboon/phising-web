"use client";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Layout, theme, ThemeConfig } from "antd";
import { useSession } from "next-auth/react";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppHeader from "@/layout/AppHeader";
import { useSidebar } from "@/context/SidebarContext";

import LoginForm from "@/components/LoginForm";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { data: session, update } = useSession();
  const user: any = session?.user;
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const theme: ThemeConfig = {
    token: {
      fontFamily: "Outline",
      colorPrimary: "#1DE4D3",
    },
  };
  return (
    <>
      <ConfigProvider theme={theme}>
        {user && user.access ? (
          <>
            <AppSidebar />
            <Backdrop />
            <div
              className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
            >
              <AppHeader />

              <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                {children}
              </div>
            </div>
          </>
        ) : (
          !loading && <LoginForm />
        )}
      </ConfigProvider>
    </>
  );
}
