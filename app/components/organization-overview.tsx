"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AddTeamMemberDialog,
  type NewTeamMember,
} from "./add-team-member-dialog";
import { OrganizationHeader } from "./organization-header";
import { OrganizationSidebar } from "./organization-sidebar";
import { RolesTable } from "./roles-table";
import { initialMembers, initialRoles } from "./organization-data";
import type { TeamMember } from "./organization-types";

export default function OrganizationOverview() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const showNotice = useCallback((feature: string) => {
    setNotice(`${feature} is not connected in this local screen.`);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function addMember(member: NewTeamMember) {
    const newMember: TeamMember = {
      ...member,
      id: crypto.randomUUID(),
      workload: 0,
      roleCount: 0,
    };
    setMembers((current) => [...current, newMember]);
    setNotice(`${member.name} was added to the team.`);
  }

  return (
    <div className="min-h-screen bg-[#e5ebdf] text-[#223f30]">
      <OrganizationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onUnavailable={showNotice}
      />
      <OrganizationHeader
        onMenuClick={() => setSidebarOpen(true)}
        onSearchChange={setSearch}
        onUnavailable={showNotice}
        search={search}
      />
      <main className="ml-0 px-4 pb-8 pt-[66px] md:ml-[286px] md:pl-4 md:pr-2 md:pt-[28px]">
        <div className="mx-auto max-w-[1192px]">
          <RolesTable
            members={members}
            onAddMember={() => setModalOpen(true)}
            onAddRole={() => showNotice("Role creation")}
            onConfirmAssignment={() => showNotice("Assignment")}
            onTabUnavailable={(tab) => showNotice(`${tab} view`)}
            roles={initialRoles}
            search={search}
          />
        </div>
      </main>
      <AddTeamMemberDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addMember}
      />
      {notice && (
        <div
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-[#223f30] px-4 py-3 text-sm text-white shadow-lg"
          role="status"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
