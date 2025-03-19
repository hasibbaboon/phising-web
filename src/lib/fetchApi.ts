import { getServerSession } from "next-auth";
import { BASE_URL } from "@/lib/common";
import { authOptions } from "@/lib/authOptions";

export async function AuthGetApi(url: string) {
  const session = await getServerSession(authOptions);
  console.log("before: ", session?.user?.accessToken);

  let res = await fetch(BASE_URL + url, {
    method: "GET",
    headers: {
      Authorization: `bearer ${session?.user?.accessToken}`,
    },
  });

  res = await fetch(BASE_URL + url, {
    method: "GET",
    headers: {
      Authorization: `bearer ${session?.user?.access}`,
    },
  });
  return await res.json();

  return await res.json();
}
