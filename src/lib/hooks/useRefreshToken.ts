"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import axios from "@/lib/axios";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    try {
      const res = await axios.post("/api/refresh", {
        refresh: session?.user?.refresh,
      });

      if (session) session.user.access = res.data.access;
    } catch {
      signOut();
    }
  };
  return refreshToken;
};
