"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { OrganizationHeader } from "./organization-header";
import { initialMembers, initialRoles } from "./organization-data";
import { OrganizationSidebar } from "./organization-sidebar";
import { OrganizationTabs } from "./organization-tabs";
import { formatLkr } from "./organization-equipment-data";
import { useOrganizationEquipmentItems } from "./use-organization-equipment-items";

type SummaryCardProps = {
  title: string;
  value: string;
  detail: string;
};

function SummaryCard({ title, value, detail }: SummaryCardProps) {
  return (
    <section className="min-h-[115px] rounded-[16px] bg-white px-5 py-[17px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
      <p className="text-[15px] leading-[19px] text-[#61776a]">{title}</p>
      <p className="mt-[-1px] truncate text-[31px] font-bold leading-[39px] text-[#305f49]">
        {value}
      </p>
      <p className="text-[15px] leading-[18px] text-[#61776a]">{detail}</p>
    </section>
  );
}

function OrganizationChart() {
  return (
    <section className="min-h-[310px] rounded-[16px] bg-white px-5 pb-5 pt-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <h2 className="text-[19px] font-bold leading-6 text-[#223f30]">
        Organisation chart
      </h2>
      <div className="mt-[7px] flex flex-col items-center">
        <Link
          className="min-h-[45px] rounded-[12px] bg-[#4b7f5b] px-4 text-[15px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
          href="/"
        >
          Store Manager · Kavindi P.
        </Link>
        <div
          aria-hidden="true"
          className="h-[17px] w-px bg-[#a5beac]"
        />
        <div className="flex w-full flex-wrap justify-center gap-[10px]">
          <ChartNode name="Sales Associate" person="Sahan R." />
          <ChartNode name="Inventory Clerk" person="Kavindi P." />
          <ChartNode name="Bookkeeper" person="Unassigned" unassigned />
          <ChartNode name="Marketing Lead" person="Unassigned" unassigned />
        </div>
      </div>
    </section>
  );
}

function ChartNode({
  name,
  person,
  unassigned = false,
}: {
  name: string;
  person: string;
  unassigned?: boolean;
}) {
  return (
    <Link
      className={`flex min-h-[66px] min-w-[136px] flex-col justify-center rounded-[13px] border bg-white px-[12px] text-left shadow-[0_1px_2px_rgba(0,0,0,0.08)] sm:px-[15px] ${
        unassigned
          ? "border-dashed border-[#d93224]"
          : "border-[#a5beac]"
      }`}
      href="/"
    >
      <span className="text-[14px] font-semibold leading-[20px] text-[#223f30]">
        {name}
      </span>
      <span className="text-[13px] leading-[18px] text-[#61776a]">
        {person}
      </span>
    </Link>
  );
}

function NeedsAttention() {
  return (
    <section className="min-h-[310px] rounded-[16px] bg-white px-5 pb-[14px] pt-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <h2 className="mb-[15px] text-[19px] font-bold leading-6 text-[#223f30]">
        Needs attention
      </h2>
      <div className="space-y-[12px]">
        <p className="flex min-h-[41px] items-center rounded-[9px] bg-[#fbe3df] px-[11px] py-2 text-[13px] font-bold leading-[17px] text-[#8b1d1d]">
          Overloaded: Kavindi P. is at 120% of weekly capacity.
        </p>
        <p className="flex min-h-[58px] items-center rounded-[9px] bg-[#fff1d4] px-[11px] py-2 text-[13px] font-bold leading-[17px] text-[#674200]">
          Skill mismatch: Sahan R. is missing Customer Service for Sales
          Associate.
        </p>
        <p className="flex min-h-[41px] items-center rounded-[9px] bg-[#fbe3df] px-[11px] py-2 text-[13px] font-bold leading-[17px] text-[#8b1d1d]">
          Urgent gap: Bookkeeper role has nobody assigned.
        </p>
        <Link
          className="inline-flex h-[41px] w-full items-center justify-center rounded-[9px] border border-[#4b7f5b] bg-white text-[14px] text-[#305f49] hover:bg-[#e1eee5]"
          href="/organization/gap-report"
        >
          View gap report
        </Link>
      </div>
    </section>
  );
}

export default function OrganizationDashboard() {
  const { items } = useOrganizationEquipmentItems();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [notice, setNotice] = useState("");
  const missingItems = items.filter((item) => item.status === "Missing");
  const moneyNeeded = missingItems.reduce(
    (total, item) => total + item.estimatedCost,
    0,
  );

  const showNotice = useCallback((feature: string) => {
    setNotice(`${feature} is not implemented yet.`);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  return (
    <div className="min-h-screen bg-[#e5ebdf] text-[#223f30]">
      <OrganizationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onUnavailable={showNotice}
      />
      <OrganizationHeader
        onMenuClick={() => setSidebarOpen(true)}
        onSearchChange={() => undefined}
        onUnavailable={showNotice}
        search=""
        title="Organization"
      />
      <main className="ml-0 px-4 pb-8 pt-[66px] md:ml-[286px] md:pl-3 md:pr-[10px] md:pt-[32px]">
        <div className="mx-auto max-w-[1192px]">
          <OrganizationTabs active="Overview" />
          {bannerVisible && (
            <section className="mb-[20px] flex flex-col gap-3 rounded-[16px] bg-[#dde9dc] px-4 py-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] sm:px-5 lg:min-h-[83px] lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <div>
                <h2 className="text-[16px] font-bold leading-[22px] text-[#223f30]">
                  Suggested starting setup for Retail · One-time sale
                </h2>
                <p className="max-w-[770px] text-[13px] leading-[18px] text-[#61776a]">
                  We pre-filled common roles and equipment for your business
                  type. Edit them instead of starting from scratch.
                </p>
              </div>
              <div className="flex shrink-0 gap-[10px]">
                <button
                  className="h-[41px] rounded-[10px] border border-[#4b7f5b] bg-white px-[17px] text-[14px] text-[#305f49] hover:bg-[#f5f8f6]"
                  onClick={() => setBannerVisible(false)}
                  type="button"
                >
                  Skip
                </button>
                <button
                  className="h-[41px] rounded-[10px] bg-[#4b7f5b] px-[14px] text-[14px] font-semibold text-white hover:bg-[#3f704f]"
                  onClick={() => {
                    setBannerVisible(false);
                    setNotice(
                      "Suggestions are shown in this sample screen; applying them is not persisted.",
                    );
                  }}
                  type="button"
                >
                  Apply suggestions
                </button>
              </div>
            </section>
          )}

          <div className="mb-[20px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard title="Roles" value="6" detail="3 assigned" />
            <SummaryCard title="Team members" value="3" detail="1 overloaded" />
            <SummaryCard
              title="Tools & equipment"
              value={String(items.length)}
              detail={`${missingItems.length} still missing`}
            />
            <SummaryCard
              title="Money needed"
              value={`LKR ${formatLkr(moneyNeeded)}`}
              detail="for missing items"
            />
          </div>

          <div className="grid gap-[12px] xl:grid-cols-[1.2fr_1fr]">
            <OrganizationChart />
            <NeedsAttention />
          </div>
        </div>
      </main>
      {notice && (
        <div
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-[#223f30] px-4 py-3 text-center text-sm text-white shadow-lg"
          role="status"
        >
          {notice}
        </div>
      )}
      <span className="sr-only">
        {initialRoles.length} roles and {initialMembers.length} team members
      </span>
    </div>
  );
}
