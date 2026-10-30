"use client";

import Link from "next/link";

const tabs = [
  { label: "Overview", href: "/organization/overview" },
  { label: "Roles & Team", href: "/" },
  { label: "Equipment & Costs", href: "/organization/equipment" },
  { label: "Gap Report", href: "/organization/gap-report" },
];

type OrganizationTabsProps = {
  active: "Overview" | "Roles & Team" | "Equipment & Costs" | "Gap Report";
};

export function OrganizationTabs({ active }: OrganizationTabsProps) {
  return (
    <nav
      aria-label="Organization sections"
      className="mb-[21px] flex gap-[6px] overflow-x-auto pb-1"
    >
      {tabs.map((tab) => {
        const selected = tab.label === active;
        const className = `inline-flex h-[37px] shrink-0 items-center rounded-full px-[15px] text-[16px] ${
          selected
            ? "bg-[#305f49] font-semibold text-white"
            : "bg-white text-[#305f49] hover:bg-[#e1eee5]"
        }`;

        if (tab.href) {
          return (
            <Link
              aria-current={selected ? "page" : undefined}
              className={className}
              href={tab.href}
              key={tab.label}
            >
              {tab.label}
            </Link>
          );
        }

        return (
          <Link
            aria-current={selected ? "page" : undefined}
            className={className}
            href={tab.href}
            key={tab.label}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
