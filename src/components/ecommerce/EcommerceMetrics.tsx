"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

export const EcommerceMetrics = ({ dashboardData }: { dashboardData: any }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 mb-4">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Email
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {dashboardData?.total_email?.toLocaleString() ?? 0}
              </h4>
            </div>
            <Badge>
              Scanned: {dashboardData?.total_scanned?.toLocaleString() ?? 0}
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Safe Email
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {dashboardData?.safe_email?.toLocaleString() ?? 0}
              </h4>
            </div>

            <Badge color="error">
              Flagged:{dashboardData?.flag_email?.length ?? 0}
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}
      </div>

      <div className="grid grid-cols-1">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Flagged Email
              </span>
              <h4 className="mt-2 font-bold text-error-700 text-title-sm dark:text-white/90">
                {dashboardData?.flag_email?.length ?? 0}
              </h4>
            </div>
            <div className={"flex flex-wrap gap-3"}>
              <Badge color={"success"}>
                Low:{" "}
                {dashboardData?.flag_email.filter((f) => f.probability <= 60)
                  ?.length ?? 0}
              </Badge>
              <Badge>
                Medium:{" "}
                {dashboardData?.flag_email.filter(
                  (f) => f.probability <= 70 && f.probability > 60,
                )?.length ?? 0}
              </Badge>
              <Badge color={"warning"}>
                High:{" "}
                {dashboardData?.flag_email.filter(
                  (f) => f.probability <= 80 && f.probability > 70,
                )?.length ?? 0}
              </Badge>
              <Badge color={"error"}>
                Critical:{" "}
                {dashboardData?.flag_email.filter(
                  (f) => f.probability <= 100 && f.probability > 80,
                )?.length ?? 0}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
