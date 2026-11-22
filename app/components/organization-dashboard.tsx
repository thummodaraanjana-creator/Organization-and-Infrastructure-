"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OrganizationHeader } from "./organization-header";
import { OrganizationSidebar } from "./organization-sidebar";
import { OrganizationTabs } from "./organization-tabs";
import {
  formatLkr,
  initialEquipmentItems,
} from "./organization-equipment-data";
import { initialRoles } from "./organization-data";
import { useOrganizationData } from "./use-organization-data";
import type { Role, TeamMember } from "./organization-types";

type SummaryCardProps = {
  title: string;
  value: string;
  detail: string;
};

function SummaryCard({ title, value, detail }: SummaryCardProps) {
  return (
    <section className="min-h-[92px] rounded-[12px] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
      <p className="text-[13px] leading-[17px] text-[#61776a]">{title}</p>
      <p className="break-words text-[26px] font-bold leading-[32px] text-[#305f49]">
        {value}
      </p>
      <p className="text-[12px] leading-[16px] text-[#61776a]">{detail}</p>
    </section>
  );
}

function OrganizationChart({
  roles,
  search,
}: {
  roles: Role[];
  search: string;
}) {
  const filteredRoles = roles.filter((role) =>
    `${role.title} ${role.assignedTo} ${role.requiredSkills}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="rounded-[12px] bg-white px-4 pb-4 pt-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] xl:min-h-[260px]">
      <h2 className="text-[16px] font-bold leading-5 text-[#223f30]">
        Organization chart
      </h2>
      <div className="mt-[7px] flex min-w-0 flex-col items-center">
        {filteredRoles.length > 0 ? (
          <div className="grid w-full grid-cols-1 justify-items-stretch gap-[10px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
            {filteredRoles.map((role) => (
              <ChartNode
                key={role.id}
                name={role.title}
                person={role.assignedTo}
                unassigned={role.assignedTo === "Unassigned"}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-sm text-[#61776a]">
            No roles match your search.
          </p>
        )}
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
      className={`flex min-h-[66px] w-full flex-col justify-center rounded-[13px] border bg-white px-[12px] text-left shadow-[0_1px_2px_rgba(0,0,0,0.08)] sm:px-[15px] ${
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

function NeedsAttention({
  members,
  roles,
  search,
}: {
  members: TeamMember[];
  roles: Role[];
  search: string;
}) {
  const attentionItems = [
    ...members
      .filter((member) => member.workload > 100)
      .map((member) => ({
        id: `workload-${member.id}`,
        text: `Overloaded: ${member.name} is at ${member.workload}% of weekly capacity.`,
      })),
    ...roles
      .filter((role) => role.assignedTo !== "Unassigned" && role.match !== "Good match")
      .map((role) => ({
        id: `skills-${role.id}`,
        text: `Skill mismatch: ${role.assignedTo} does not meet all skills for ${role.title}.`,
      })),
    ...roles
      .filter((role) => role.assignedTo === "Unassigned")
      .map((role) => ({
        id: `gap-${role.id}`,
        text: `${role.priority} gap: ${role.title} has nobody assigned.`,
      })),
  ].filter((item) => item.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="rounded-[12px] bg-white px-4 pb-3 pt-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] xl:min-h-[260px]">
      <h2 className="mb-3 text-[16px] font-bold leading-5 text-[#223f30]">
        Needs attention
      </h2>
      <div className="space-y-[12px]">
        {attentionItems.length > 0 ? (
          attentionItems.slice(0, 3).map((item) => (
            <p
              className="flex min-h-[41px] items-center rounded-[9px] bg-[#fff1d4] px-[11px] py-2 text-[13px] font-bold leading-[17px] text-[#674200]"
              key={item.id}
            >
              {item.text}
            </p>
          ))
        ) : (
          <p className="rounded-[9px] bg-[#e1eee5] px-[11px] py-3 text-[13px] text-[#305f49]">
            No items need attention.
          </p>
        )}
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
  const { items, roles, members, setItems, setRoles } = useOrganizationData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const suggestionActionTaken = useRef(false);
  const missingItems = items.filter((item) => item.status === "Missing");
  const moneyNeeded = missingItems.reduce(
    (total, item) => total + item.estimatedCost * item.quantity,
    0,
  );
  const assignedRoleCount = roles.filter(
    (role) => role.assignedTo !== "Unassigned",
  ).length;
  const overloadedCount = members.filter(
    (member) => member.workload > 100,
  ).length;

  function applySuggestedSetup() {
    if (suggestionActionTaken.current) return;
    suggestionActionTaken.current = true;

    const newRoles = initialRoles.filter(
      (suggestedRole) =>
        !roles.some((role) => role.id === suggestedRole.id),
    );
    const newEquipment = initialEquipmentItems.filter(
      (suggestedItem) =>
        !items.some((item) => item.id === suggestedItem.id),
    );
    if (newRoles.length > 0) setRoles((current) => [...current, ...newRoles]);
    if (newEquipment.length > 0) {
      setItems((current) => [...current, ...newEquipment]);
    }
    setBannerVisible(false);
    setNotice(
      newRoles.length + newEquipment.length > 0
        ? "Suggested setup applied."
        : "Your setup already includes the suggestions.",
    );
  }

  function skipSuggestedSetup() {
    if (suggestionActionTaken.current) return;
    suggestionActionTaken.current = true;
    setBannerVisible(false);
  }

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
      />
      <OrganizationHeader
        onMenuClick={() => setSidebarOpen(true)}
        onSearchChange={setSearch}
        onUnavailable={showNotice}
        searchPlaceholder="Search roles and team"
        search={search}
        title="Organization"
      />
      <main className="ml-0 min-w-0 px-4 pb-8 pt-4 lg:ml-[232px] lg:px-5 lg:pt-5">
        <div className="mx-auto max-w-[1120px]">
          <OrganizationTabs active="Overview" />
          <div className="mb-3">
            <h2 className="text-[18px] font-bold leading-6 text-[#223f30]">
              Organization Overview
            </h2>
            <p className="mt-0.5 text-[13px] leading-4 text-[#61776a]">
              Review your team, equipment, and current organization gaps.
            </p>
          </div>
          {bannerVisible && (
            <section className="mb-3 flex flex-col gap-2 rounded-[12px] bg-[#dde9dc] px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.1)] lg:min-h-[68px] lg:flex-row lg:items-center lg:justify-between lg:gap-3">
              <div>
                <h2 className="text-[16px] font-bold leading-[22px] text-[#223f30]">
                  Suggested starting setup for Retail · One-time sale
                </h2>
                <p className="max-w-[770px] text-[13px] leading-[18px] text-[#61776a]">
                  We pre-filled common roles and equipment for your business
                  type. Edit them instead of starting from scratch.
                </p>
              </div>
              <div className="flex w-full flex-wrap gap-[10px] sm:w-auto sm:flex-nowrap sm:shrink-0">
                <button
                  className="h-[41px] flex-1 rounded-[10px] border border-[#4b7f5b] bg-white px-[17px] text-[14px] text-[#305f49] hover:bg-[#f5f8f6] sm:flex-none"
                  onClick={skipSuggestedSetup}
                  type="button"
                >
                  Skip
                </button>
                <button
                  className="h-[41px] flex-1 rounded-[10px] bg-[#4b7f5b] px-[14px] text-[14px] font-semibold text-white hover:bg-[#3f704f] sm:flex-none"
                  onClick={applySuggestedSetup}
                  type="button"
                >
                  Apply suggestions
                </button>
              </div>
            </section>
          )}

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Roles"
              value={String(roles.length)}
              detail={`${assignedRoleCount} assigned`}
            />
            <SummaryCard
              title="Team members"
              value={String(members.length)}
              detail={`${overloadedCount} overloaded`}
            />
            <SummaryCard
              title="Equipment"
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
            <OrganizationChart roles={roles} search={search} />
            <NeedsAttention members={members} roles={roles} search={search} />
          </div>
        </div>
      </main>
      {notice && (
        <div
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-[#223f30] px-4 py-3 text-center text-sm text-white shadow-lg"
          role="status"
        >
          {notice}
        </div>
      )}
      <span className="sr-only">
        {roles.length} roles and {members.length} team members
      </span>
    </div>
  );
}
