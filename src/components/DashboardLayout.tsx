"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Button, ConfigProvider, Layout, Menu, theme } from "antd";
import { signOut, useSession } from "next-auth/react";
import {
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import type { GetProp, MenuProps } from "antd";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import Link from "next/link";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppHeader from "@/layout/AppHeader";
import { useSidebar } from "@/context/SidebarContext";
import { AuthApi } from "@/lib/fetchApi";

const { Header, Footer, Sider, Content } = Layout;
type MenuItem = GetProp<MenuProps, "items">[number];
const items: MenuItem[] = [
  {
    key: "1",
    label: <Link href="/">Dashboard</Link>,
    icon: <HomeOutlined />,
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const user: any = session?.user;
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  useEffect(() => {
    if (user?.email && user?.access) {
      AuthApi("/api/process", "POST").then((res) => {
        console.log(res);
      });
      AuthApi("/api/scan", "POST").then((res) => {
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
            fontFamily: "Inter",
            colorPrimary: "#1DE4D3",
          },
        }}
      >
        {user && user.email ? (
          <>
            <AppSidebar />
            <Backdrop />
            <div
              className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
            >
              {user && user.email && <AppHeader />}

              <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                {children}
              </div>
            </div>
          </>
        ) : (
          children
        )}
      </ConfigProvider>
    </>
  );
}
