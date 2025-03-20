"use client";

import { signIn, useSession } from "next-auth/react";
import axios from "@/lib/axios";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post("/api/refresh", {
      refresh: session?.user.refresh,
    });

    if (session) session.user.access = res.data.access;
    else signIn();
  };
  return refreshToken;
};
