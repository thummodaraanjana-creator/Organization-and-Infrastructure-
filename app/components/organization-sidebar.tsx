"use client";

import Image from "next/image";
import Link from "next/link";

type OrganizationSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onUnavailable: (feature: string) => void;
};

const workspaceLinks = [
  { label: "Dashboard", icon: "6581a.svg", width: 18, height: 18 },
  { label: "Tasks", icon: "9db70.svg", width: 18, height: 18 },
  { label: "Money", icon: "16e68.svg", width: 12, height: 12 },
  { label: "Marketing", icon: "7a28c.svg", width: 17, height: 12 },
  {
    label: "Organization",
    icon: "fdd07.svg",
    width: 20,
    height: 20,
    active: true,
  },
  { label: "Legal", icon: "3926b.svg", width: 18, height: 13 },
];

export function OrganizationSidebar({
  isOpen,
  onClose,
  onUnavailable,
}: OrganizationSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
          type="button"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col overflow-y-auto rounded-r-[10px] border-r border-white bg-white px-6 pb-8 pt-[72px] shadow-[6px_4px_4px_rgba(0,0,0,0.25)] transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-[42px] text-center text-[21px] font-black tracking-[0.01em] text-[#245d45]">
          ASARA
        </div>
        <p className="mb-[12px] pl-4 text-[11px] font-bold text-[#6b7772]">
          CURRENT BUSINESS
        </p>
        <button
          className="relative ml-[17px] flex h-[74px] w-[222px] flex-col justify-center px-[18px] text-left"
          onClick={() => onUnavailable("Business profile")}
          type="button"
        >
          <Image
            alt=""
            className="absolute inset-0"
            height={74}
            src="/figma/organization-overview/4ef55.svg"
            width={222}
          />
          <span className="relative text-[15px] font-bold leading-5 text-white">
            Willow &amp; Co.
          </span>
          <span className="relative text-[12px] leading-4 text-white">
            Business profile
          </span>
        </button>

        <Image
          alt=""
          className="ml-[12px] mt-[69px]"
          height={1}
          src="/figma/organization-overview/df04b.svg"
          width={202}
        />
        <p className="mb-[18px] mt-[62px] pl-[19px] text-[18px] font-bold text-[#7f8d8c]">
          WORKSPACE
        </p>
        <nav aria-label="Workspace" className="flex flex-col gap-[5px]">
          {workspaceLinks.map(({ label, icon, width, height, active }) => {
            const contents = (
              <>
                {active && (
                  <>
                    <Image
                      alt=""
                      className="absolute left-[13px] top-[-5px]"
                      height={56}
                      src="/figma/organization-overview/5b06f.svg"
                      width={217}
                    />
                    <Image
                      alt=""
                      className="absolute left-[9px] top-[-5px]"
                      height={56}
                      src="/figma/organization-overview/7bdf1.svg"
                      width={12}
                    />
                  </>
                )}
                <Image
                  alt=""
                  className="relative"
                  height={height}
                  src={`/figma/organization-overview/${icon}`}
                  width={width}
                />
                <span className="relative">{label}</span>
              </>
            );
            const className = `relative flex h-[46px] items-center gap-[10px] rounded-[7px] px-[28px] text-left text-[16px] transition-colors ${
              active
                ? "font-bold text-white"
                : "text-[#245d45] hover:bg-[#e1eee5]"
            }`;

            if (active) {
              return (
                <Link
                  aria-current="page"
                  className={className}
                  href="/organization/overview"
                  key={label}
                >
                  {contents}
                </Link>
              );
            }

            return (
              <button
                className={className}
                key={label}
                onClick={() => onUnavailable(label)}
                type="button"
              >
                {contents}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto mb-[48px]">
          <Image
            alt=""
            height={1}
            src="/figma/organization-overview/fa1c8.svg"
            width={202}
          />
          <div className="pt-[76px]">
            <button
              className="flex h-[32px] items-center gap-[10px] px-[12px] text-[16px] text-[#245d45] hover:text-[#173f2d]"
              onClick={() => onUnavailable("Settings")}
              type="button"
            >
              <Image
                alt=""
                height={20}
                src="/figma/organization-overview/d9800.svg"
                width={20}
              />
              Settings
            </button>
            <button
              className="mt-[4px] flex h-[32px] items-center gap-[10px] px-[12px] text-[16px] text-[#245d45] hover:text-[#173f2d]"
              onClick={() => onUnavailable("Log out")}
              type="button"
            >
              <Image
                alt=""
                height={18}
                src="/figma/organization-overview/a7816.svg"
                width={20}
              />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
