"use client";

import { useState } from "react";
import { OrganizationTabs } from "./organization-tabs";
import type { Role, TeamMember } from "./organization-types";

type RolesTableProps = {
  members: TeamMember[];
  roles: Role[];
  search: string;
  onAddRole: () => void;
  onAddMember: () => void;
  onAssignRole: (roleId: string, memberId: string) => void;
};

function MatchBadge({
  match,
  tone,
}: {
  match: Role["match"];
  tone: Role["matchTone"];
}) {
  const styles: Record<Role["matchTone"], string> = {
    good: "bg-[#d4edd9] text-[#2d6a3f]",
    warning: "bg-[#fff1d4] text-[#885400]",
    danger: "bg-[#fbe3df] text-[#8b1d1d]",
    neutral: "bg-[#e1eee5] text-[#305f49]",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-[11px] py-[4px] text-[12px] font-semibold leading-[17px] ${styles[tone]}`}
    >
      {match}
    </span>
  );
}

export function RolesTable({
  members,
  roles,
  search,
  onAddRole,
  onAddMember,
  onAssignRole,
}: RolesTableProps) {
  const filteredRoles = roles.filter((role) =>
    `${role.title} ${role.requiredSkills} ${role.assignedTo}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="min-w-0">
      <OrganizationTabs active="Roles & Team" />
      <div className="mb-3 flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-[18px] font-bold leading-6 text-[#223f30]">
            Roles &amp; Team
          </h2>
          <p className="mt-0.5 text-[13px] leading-4 text-[#61776a]">
            Review responsibilities, skill coverage, and team workload.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-[10px] xl:w-auto">
          <button
            className="h-10 flex-1 rounded-[9px] border border-[#4b7f5b] bg-white px-4 text-sm font-semibold text-[#305f49] hover:bg-[#e1eee5] sm:flex-none"
            onClick={onAddMember}
            type="button"
          >
            Add team member
          </button>
          <button
            className="h-10 flex-1 rounded-[9px] bg-[#4b7f5b] px-4 text-sm font-semibold text-white hover:bg-[#3f704f] sm:flex-none"
            onClick={onAddRole}
            type="button"
          >
            Add role
          </button>
        </div>
      </div>

      <div className="grid items-start gap-[12px] xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:gap-[18px]">
        <section className="min-w-0 overflow-hidden rounded-[12px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] xl:min-h-[430px]">
          <div className="px-4 pt-3">
            <h3 className="text-[16px] font-bold leading-5 text-[#223f30]">
              Roles
            </h3>
          </div>
          <div aria-label="Roles" className="overflow-x-auto px-4 pb-4 pt-2" tabIndex={0}>
            <table className="w-full min-w-[610px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[31.5%]" />
                <col className="w-[16.2%]" />
                <col className="w-[24.3%]" />
              </colgroup>
              <thead className="bg-white text-[13px] font-bold text-[#61776a]">
                <tr className="h-[40px]">
                  <th className="pl-[9px]">Role</th>
                  <th className="pl-2">Required skills</th>
                  <th className="pl-2">Assigned to</th>
                  <th className="pl-2">Skill match</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr
                    className="border-t border-[#e5ebdf] text-[13px] leading-[19px] sm:text-[14px]"
                    key={role.id}
                  >
                    <td className="break-words px-2 py-3 text-[#223f30]">
                      {role.title}
                    </td>
                    <td className="break-words px-2 py-3 text-[#61776a]">
                      {role.requiredSkills}
                    </td>
                    <td className="break-words px-2 py-3 text-[#223f30]">
                      {role.assignedTo}
                    </td>
                    <td className="px-2 py-3">
                      <MatchBadge match={role.match} tone={role.matchTone} />
                    </td>
                  </tr>
                ))}
                {filteredRoles.length === 0 && (
                  <tr>
                    <td
                      className="h-16 px-2 text-sm text-[#61776a]"
                      colSpan={4}
                    >
                      {roles.length === 0
                        ? "No roles have been added yet."
                        : "No roles match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-3">
          <WorkloadPanel members={members} search={search} />
          <AssignmentPanel
            members={members}
            onAssignRole={onAssignRole}
            roles={roles}
          />
        </div>
      </div>
    </section>
  );
}

function WorkloadPanel({
  members,
  search,
}: {
  members: TeamMember[];
  search: string;
}) {
  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.roleCount} ${member.skills.join(" ")} ${member.employmentType}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="rounded-[12px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] xl:min-h-[190px]">
      <h3 className="text-[16px] font-bold leading-5 text-[#223f30]">
        Team workload
      </h3>
      <div className="mt-3 space-y-3">
        {filteredMembers.map((member) => (
          <div className="space-y-[1px]" key={member.id}>
            <div className="flex items-center justify-between gap-3 text-[15px] leading-6 text-[#223f30]">
              <span className="min-w-0 break-words">
                {member.name} ·{" "}
                {member.roleCount === 0
                  ? "no role yet"
                  : `${member.roleCount} ${
                      member.roleCount === 1 ? "role" : "roles"
                    }`}
              </span>
              <span
                className={`shrink-0 ${
                  member.workload > 100 ? "text-[#b0272a]" : ""
                }`}
              >
                {member.workload}%
              </span>
            </div>
            <div
              aria-label={`${member.name} workload ${member.workload}%`}
              className="h-[7px] overflow-hidden rounded-full bg-[#e5ebdf]"
              role="img"
            >
              <div
                className={`h-full rounded-full ${
                  member.workload > 100 ? "bg-[#d93224]" : "bg-[#4b7f5b]"
                }`}
                style={{ width: `${Math.min(member.workload, 100)}%` }}
              />
            </div>
            <p className="break-words text-xs text-[#61776a]">
              {member.skills.length > 0
                ? member.skills.join(", ")
                : "No skills added"}
            </p>
            <p className="text-xs text-[#61776a]">
              {member.employmentType}
            </p>
          </div>
        ))}
        {filteredMembers.length === 0 && (
          <p className="pt-4 text-sm text-[#61776a]">
            No team members match your search.
          </p>
        )}
      </div>
    </section>
  );
}

function AssignmentPanel({
  members,
  roles,
  onAssignRole,
}: {
  members: TeamMember[];
  roles: Role[];
  onAssignRole: (roleId: string, memberId: string) => void;
}) {
  const assignableRoles = roles.filter(
    (role) => role.assignedTo === "Unassigned",
  );
  const [roleId, setRoleId] = useState("");
  const [memberId, setMemberId] = useState(
    members.find((member) => member.name === "Dilini M.")?.id ?? "",
  );
  const selectedRole =
    assignableRoles.find((role) => role.id === roleId) ?? assignableRoles[0];
  const selectedMember =
    members.find((member) => member.id === memberId) ?? members[0];
  const requiredSkills =
    selectedRole?.requiredSkills.split(",").map((skill) => skill.trim()) ?? [];
  const missingSkills =
    selectedMember === undefined
      ? requiredSkills
      : requiredSkills.filter(
          (skill) =>
            !selectedMember.skills.some(
              (memberSkill) => memberSkill.toLowerCase() === skill.toLowerCase(),
            ),
        );

  return (
    <section className="rounded-[12px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <h3 className="text-[16px] font-bold leading-5 text-[#223f30]">
        Assign member to role
      </h3>
      {assignableRoles.length > 0 && members.length > 0 ? (
        <>
          <label className="mt-4 block text-sm font-semibold text-[#405a4b]">
            Role
            <select
              className="mt-1 h-10 w-full rounded-lg border border-[#cbd7d0] bg-white px-3 text-sm font-normal text-[#223f30] focus:border-[#4b7f5b] focus:outline-none focus:ring-1 focus:ring-[#4b7f5b]"
              onChange={(event) => setRoleId(event.target.value)}
              value={selectedRole?.id ?? ""}
            >
              {assignableRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm font-semibold text-[#405a4b]">
            Team member
            <select
              className="mt-1 h-10 w-full rounded-lg border border-[#cbd7d0] bg-white px-3 text-sm font-normal text-[#223f30] focus:border-[#4b7f5b] focus:outline-none focus:ring-1 focus:ring-[#4b7f5b]"
              onChange={(event) => setMemberId(event.target.value)}
              value={selectedMember?.id ?? ""}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
          <div
            className={`mt-3 rounded-[9px] px-3 py-2 text-sm leading-5 ${
              missingSkills.length === 0
                ? "bg-[#e1eee5] text-[#305f49]"
                : "bg-[#fff1d4] text-[#674200]"
            }`}
          >
            {missingSkills.length === 0
              ? "All required skills are covered."
              : `Missing skills: ${missingSkills.join(", ")}.`}
          </div>
          <p className="mt-2 text-xs leading-5 text-[#61776a]">
            Current workload: {selectedMember?.workload ?? 0}%. Role hours have
            not been estimated.
          </p>
        </>
      ) : (
        <p className="mt-4 rounded-lg bg-[#e1eee5] px-3 py-3 text-sm text-[#305f49]">
          {members.length === 0
            ? "Add a team member before assigning a role."
            : "All roles are assigned."}
        </p>
      )}
      <button
        className="mt-4 h-10 rounded-[9px] bg-[#4b7f5b] px-4 text-sm font-semibold text-white hover:bg-[#3f704f] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!selectedRole || !selectedMember}
        onClick={() => {
          if (selectedRole && selectedMember) {
            onAssignRole(selectedRole.id, selectedMember.id);
          }
        }}
        type="button"
      >
        Confirm assignment
      </button>
    </section>
  );
}
