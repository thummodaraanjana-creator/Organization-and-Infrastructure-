"use client";

import Sidebar from "./Sidebar";

type OrganizationSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function OrganizationSidebar({
  isOpen,
  onClose,
}: OrganizationSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation backdrop"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-40 overflow-y-auto transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          aria-label="Close navigation"
          className="absolute right-3 top-3 z-50 grid size-9 place-items-center rounded-lg text-[#436E58] hover:bg-[#e1eee5] lg:hidden"
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true" className="text-2xl leading-none">×</span>
        </button>
        <Sidebar activeItem="Organization" />
      </div>
    </>
  );
}
