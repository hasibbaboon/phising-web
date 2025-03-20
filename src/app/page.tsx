"use client";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

export default function Home() {
  const { data: session, update } = useSession();
  const user: any = session?.user;
  const [dashboardData, setDashboardData] = useState(null);
  const axiosAuth = useAxiosAuth();
  useEffect(() => {
    if (user?.email) {
      axiosAuth.get("/api/scan").then((res) => {
        setDashboardData(res?.data);
      });
    }
  }, [user?.email]);
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics dashboardData={dashboardData} />

        {/*<MonthlySalesChart dashboardData={dashboardData} />*/}
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget dashboardData={dashboardData} />
      </div>
    </div>
  );
}
