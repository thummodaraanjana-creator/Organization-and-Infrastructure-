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
      className="mb-3 flex max-w-full gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]"
    >
      {tabs.map((tab) => {
        const selected = tab.label === active;
        const className = `inline-flex h-[34px] shrink-0 items-center rounded-full px-3 text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4b7f5b] focus-visible:ring-offset-2 ${
          selected
            ? "bg-[#305f49] font-semibold text-white"
            : "bg-white text-[#305f49] hover:bg-[#e1eee5]"
        }`;

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
