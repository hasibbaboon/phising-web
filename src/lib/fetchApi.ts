"use server";
import { getServerSession } from "next-auth";
import { BASE_URL } from "@/lib/common";
import { authOptions } from "@/lib/authOptions";

export async function AuthApi(url: string, method) {
  const session = await getServerSession(authOptions);
  console.log("before: ", session?.user?.access);
  // if (session?.user?.access) {
  let res = await fetch(BASE_URL + url, {
    method: method,
    headers: {
      Authorization: `Bearer ${session?.user?.access}`,
    },
  });
  return await res.json();
  // }
}
