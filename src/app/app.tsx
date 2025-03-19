"use client";
import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AppSidebar from "@/layout/AppSidebar";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider refetchOnWindowFocus={true}>
        <DashboardLayout>{children}</DashboardLayout>
      </SessionProvider>
    </>
  );
}
