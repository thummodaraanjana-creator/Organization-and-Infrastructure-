"use client";

import Image from "next/image";

type OrganizationHeaderProps = {
  title?: string;
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  onUnavailable: (feature: string) => void;
};

export function OrganizationHeader({
  title = "Dashboard",
  search,
  onSearchChange,
  onMenuClick,
  onUnavailable,
}: OrganizationHeaderProps) {
  return (
    <header className="relative ml-0 flex h-[130px] items-center justify-between overflow-x-clip overflow-y-visible bg-white px-6 md:ml-[286px] md:pl-[62px] md:pr-[42px]">
      <Image
        alt=""
        className="pointer-events-none absolute left-0 top-0 hidden max-w-none md:block"
        height={138}
        src="/figma/organization-overview/308fb.svg"
        width={1450}
      />
      <div className="flex min-w-0 items-center gap-4">
        <button
          aria-label="Open navigation"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-[#245d45] hover:bg-[#e1eee5] md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <span className="flex w-5 flex-col gap-1">
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
          </span>
        </button>
        <h1 className="relative truncate text-[27px] font-bold leading-none text-[#295f5c] md:text-[32px]">
          {title}
        </h1>
      </div>
      <div className="relative flex items-center gap-3 md:gap-[25px]">
        <label className="relative hidden h-[68px] w-[338px] shrink-0 md:block">
          <Image
            alt=""
            className="absolute inset-0"
            height={68}
            src="/figma/organization-overview/af739.svg"
            width={338}
          />
          <span className="sr-only">Search roles and members</span>
          <input
            aria-label="Search roles and members"
            className="absolute left-[58px] top-[13px] h-[38px] w-[245px] rounded-full border-0 bg-transparent text-[15px] text-[#223f30] outline-none placeholder:text-transparent focus:placeholder:text-[#61776a]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            type="search"
            value={search}
          />
        </label>
        <button
          aria-label="Account menu"
          className="relative grid size-[54px] shrink-0 place-items-center md:size-[60px]"
          onClick={() => onUnavailable("Account menu")}
          type="button"
        >
          <Image
            alt=""
            className="absolute"
            height={69}
            src="/figma/organization-overview/75efc.svg"
            width={71}
          />
          <span className="relative text-[29px] font-bold text-[#245d45]">U</span>
        </button>
        <button
          aria-label="Notifications"
          className="relative grid size-[54px] shrink-0 place-items-center md:size-[60px]"
          onClick={() => onUnavailable("Notifications")}
          type="button"
        >
          <Image
            alt=""
            className="absolute"
            height={68}
            src="/figma/organization-overview/ed96c.svg"
            width={70}
          />
          <Image
            alt=""
            className="relative"
            height={29}
            src="/figma/organization-overview/dd74b.svg"
            width={26}
          />
        </button>
      </div>
      <div className="fixed left-6 right-6 top-[132px] z-10 md:hidden">
        <input
          aria-label="Search roles and members"
          className="h-11 w-full rounded-full border border-[#9fb5a7] bg-[#e1eee5] px-4 text-[15px] text-[#223f30] outline-none focus:ring-2 focus:ring-[#4b7f5b]"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search roles and members"
          type="search"
          value={search}
        />
      </div>
    </header>
  );
}
