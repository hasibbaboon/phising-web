"use client";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Layout, theme } from "antd";
import { useSession } from "next-auth/react";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppHeader from "@/layout/AppHeader";
import { useSidebar } from "@/context/SidebarContext";

import LoginForm from "@/components/LoginForm";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const user: any = session?.user;
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";
  const axiosAuth = useAxiosAuth();

  useEffect(() => {
    if (user?.email && user?.access) {
      axiosAuth.post("/api/process").then((res) => {
        console.log(res);
      });
      axiosAuth.post("/api/scan").then((res) => {
        console.log(res);
      });
    }
  }, [user?.email, user?.access]);
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            fontFamily: "Outline",
            colorPrimary: "#1DE4D3",
          },
        }}
      >
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
          <LoginForm />
        )}
      </ConfigProvider>
    </>
  );
}
