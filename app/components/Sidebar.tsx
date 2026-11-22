import {
  LayoutDashboard,
  Circle,
  FileText,
  Wallet,
  ArrowUpRight,
  House,
  Check,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  activeItem?:
    | "Dashboard"
    | "Tasks"
    | "Products and Services"
    | "Money"
    | "Marketing"
    | "Organization"
    | "Legal";
};

export default function Sidebar({ activeItem = "Organization" }: SidebarProps) {
  const workspaceItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { label: "Tasks", icon: <Circle size={16} /> },
    { label: "Products and Services", icon: <FileText size={16} /> },
    { label: "Money", icon: <Wallet size={16} /> },
    { label: "Marketing", icon: <ArrowUpRight size={16} /> },
    { label: "Organization", icon: <House size={16} /> },
    { label: "Legal", icon: <Check size={16} /> },
  ] as const;

  return (
    <aside className="flex min-h-screen w-[232px] max-w-[calc(100vw-48px)] flex-col border-r border-gray-200 bg-[#F4F4F2] shadow-sm">
      {/* Logo */}
      <div className="py-5">
        <h1 className="text-center text-[26px] font-bold tracking-tight text-[#2F6B4F]">
          ASARA
        </h1>
      </div>

      {/* Current Business */}
      <div className="px-5">
        <p className="mb-2 text-[10px] uppercase font-semibold tracking-wide text-gray-500">
          Current Business
        </p>

        <div className="rounded-lg bg-[#739472] px-3 py-1 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">
                Willow &amp; Co.
              </p>

              <p className="text-xs text-green-100">
                Business profile
              </p>
            </div>

            {/* <span className="text-white">⌄</span> */}
          </div>
        </div>
      </div>

      <div className="mx-6 my-3 border-t border-gray-200" />

      {/* Workspace */}
      <div className="flex-1 px-5">
        <h2 className="mb-1 text-[13px] font-bold text-gray-500">
          WORKSPACE
        </h2>

        <nav aria-label="Workspace" className="space-y-1">
          {workspaceItems.map(({ label, icon }) =>
            label === activeItem ? (
              <Link
                aria-current="page"
                className="relative flex items-center gap-3 rounded-lg bg-[#739472] px-3 py-2.5 text-white shadow-sm"
                href="/organization/overview"
                key={label}
              >
                <div className="absolute bottom-2 left-0 top-2 w-1 rounded-r bg-[#2F6B4F]" />
                <span className="ml-2">{icon}</span>
                <span className="font-medium">{label}</span>
              </Link>
            ) : (
              <NavItem icon={icon} label={label} key={label} />
            ),
          )}
        </nav>
      </div>

      <div className="mx-6 mb-5 border-t border-gray-200" />

      {/* Bottom */}
      <div className="px-5 pb-6">
        <div className="space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<LogOut size={18} />} label="Log out" />
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5 text-sm text-[#436E58]">
      {icon}
      <span>{label}</span>
    </div>
  );
}