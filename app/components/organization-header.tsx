"use client";

import TopNavbar from "./TopNavbar";

type OrganizationHeaderProps = {
  title?: string;
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  onUnavailable: (feature: string) => void;
  searchPlaceholder?: string;
};

export function OrganizationHeader({
  title = "Organization",
  search,
  onSearchChange,
  onMenuClick,
  onUnavailable,
  searchPlaceholder = "Search roles, people, and equipment",
}: OrganizationHeaderProps) {
  return (
    <TopNavbar
      className="sticky top-0 z-20 lg:ml-[232px] lg:w-[calc(100%-232px)]"
      title={title}
      searchPlaceholder={searchPlaceholder}
      onSearch={onSearchChange}
      searchValue={search}
      onSearchValueChange={onSearchChange}
      onMenuClick={onMenuClick}
      onProfileClick={() => onUnavailable("Account menu")}
      onNotificationsClick={() => onUnavailable("Notifications")}
    />
  );
}
