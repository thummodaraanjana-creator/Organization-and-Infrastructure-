"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  AddTeamMemberDialog,
  type NewTeamMember,
} from "./add-team-member-dialog";
import { useOrganizationData } from "./use-organization-data";
import { OrganizationHeader } from "./organization-header";
import { OrganizationSidebar } from "./organization-sidebar";
import { RolesTable } from "./roles-table";
import type { Role, TeamMember } from "./organization-types";

export default function OrganizationOverview() {
  const { members, setMembers, roles, setRoles } = useOrganizationData();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
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

  function addRole(title: string, requiredSkills: string) {
    const role: Role = {
      id: crypto.randomUUID(),
      title,
      requiredSkills,
      assignedTo: "Unassigned",
      priority: "Medium",
      match: "Gap",
      matchTone: "warning",
    };
    setRoles((current) => [...current, role]);
    setRoleDialogOpen(false);
    setNotice(`${title} was added.`);
  }

  function assignRole(roleId: string, memberId: string) {
    const member = members.find((item) => item.id === memberId);
    if (!member) return;

    const role = roles.find((item) => item.id === roleId);
    if (!role) return;

    const previousMember = members.find(
      (item) => item.name === role.assignedTo,
    );
    const requiredSkills = role.requiredSkills
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean);
    const matchedSkills = requiredSkills.filter((skill) =>
      member.skills.some((memberSkill) => memberSkill.toLowerCase() === skill),
    );

    setMembers((current) =>
      current.map((item) => {
        if (previousMember?.id === item.id && item.id !== member.id) {
          return { ...item, roleCount: Math.max(0, item.roleCount - 1) };
        }
        if (item.id === member.id && item.id !== previousMember?.id) {
          return { ...item, roleCount: item.roleCount + 1 };
        }
        return item;
      }),
    );
    setRoles((current) =>
      current.map((item) =>
        item.id === roleId
          ? {
              ...item,
              assignedTo: member.name,
              match:
                matchedSkills.length === requiredSkills.length
                  ? "Good match"
                  : "Partial match",
              matchTone:
                matchedSkills.length === requiredSkills.length
                  ? "good"
                  : "warning",
            }
          : item,
      ),
    );
    setNotice(`${member.name} was assigned to ${role.title}.`);
  }

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
      />
      <main className="ml-0 min-w-0 px-4 pb-8 pt-4 lg:ml-[232px] lg:px-5 lg:pt-5">
        <div className="mx-auto max-w-[1192px]">
          <RolesTable
            members={members}
            onAddMember={() => setModalOpen(true)}
            onAddRole={() => setRoleDialogOpen(true)}
            onAssignRole={assignRole}
            roles={roles}
            search={search}
          />
        </div>
      </main>
      <AddTeamMemberDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addMember}
      />
      {roleDialogOpen && (
        <AddRoleDialog
          onClose={() => setRoleDialogOpen(false)}
          onSave={addRole}
        />
      )}
      {notice && (
        <div
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-[#223f30] px-4 py-3 text-center text-sm text-white shadow-lg"
          role="status"
        >
          {notice}
        </div>
      )}
    </div>
  );
}

function AddRoleDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (title: string, requiredSkills: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedSkills = requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .join(", ");
    if (!trimmedTitle || !trimmedSkills) {
      setError("Enter a role title and at least one required skill.");
      return;
    }
    onSave(trimmedTitle, trimmedSkills);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="add-role-title"
        aria-modal="true"
        className="w-full max-w-[440px] rounded-[16px] bg-white p-5 shadow-2xl"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <h2 className="text-lg font-bold text-[#305f49]" id="add-role-title">
          Add role
        </h2>
        <form className="mt-4 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold text-[#223f30]">
            Role title
            <input
              autoFocus
              className="mt-1 h-10 w-full rounded-lg border border-[#cbd7d0] px-3 font-normal outline-none focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>
          <label className="block text-sm font-semibold text-[#223f30]">
            Required skills
            <input
              className="mt-1 h-10 w-full rounded-lg border border-[#cbd7d0] px-3 font-normal outline-none focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
              onChange={(event) => setRequiredSkills(event.target.value)}
              placeholder="Separate skills with commas"
              value={requiredSkills}
            />
          </label>
          {error && (
            <p className="text-sm text-[#8b1d1d]" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              className="h-10 rounded-lg border border-[#cbd7d0] px-4 text-sm font-semibold text-[#305f49] hover:bg-[#f5f8f6]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-10 rounded-lg bg-[#4b7f5b] px-4 text-sm font-semibold text-white hover:bg-[#3f704f]"
              type="submit"
            >
              Save role
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
