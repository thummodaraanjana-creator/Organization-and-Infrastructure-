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
    <aside className="flex min-h-screen w-[260px] flex-col border-r border-gray-200 bg-[#F4F4F2] shadow-sm">
      {/* Logo */}
      <div className="pt-8 pb-8">
        <h1 className="text-center text-[30px] font-bold text-[#2F6B4F]">
          Nova
        </h1>
      </div>

      {/* Current Business */}
      <div className="px-6">
        <p className="text-[11px] uppercase font-semibold tracking-wide text-gray-500 mb-4">
          Current Business
        </p>

        <div className="bg-[#739472] rounded-xl px-3 py-1.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">
                Willow &amp; Co.
              </p>

              <p className="text-sm text-green-100">
                Business profile
              </p>
            </div>

            {/* <span className="text-white">⌄</span> */}
          </div>
        </div>
      </div>

      <div className="mx-8 my-4 border-t border-gray-200" />

      {/* Workspace */}
      <div className="flex-1 px-8">
        <h2 className="text-gray-500 font-bold text-xl mb-2">
          WORKSPACE
        </h2>

        <nav aria-label="Workspace" className="space-y-1">
          {workspaceItems.map(({ label, icon }) =>
            label === activeItem ? (
              <Link
                aria-current="page"
                className="relative flex items-center gap-3 rounded-xl bg-[#739472] px-4 py-3 text-white shadow-lg"
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

      <div className="mx-8 mb-10 border-t border-gray-200" />

      {/* Bottom */}
      <div className="px-8 pb-12">
        <div className="space-y-3">
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
    <div className="flex items-center gap-3 py-2 text-[#436E58]">
      {icon}
      <span>{label}</span>
    </div>
  );
}