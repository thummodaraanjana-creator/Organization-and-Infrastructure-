"use client";

import { OrganizationTabs } from "./organization-tabs";
import type { Role, TeamMember } from "./organization-types";

type RolesTableProps = {
  members: TeamMember[];
  roles: Role[];
  search: string;
  onAddRole: () => void;
  onAddMember: () => void;
  onConfirmAssignment: () => void;
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
  onConfirmAssignment,
}: RolesTableProps) {
  const filteredRoles = roles.filter((role) =>
    `${role.title} ${role.requiredSkills} ${role.assignedTo}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="min-w-0">
      <OrganizationTabs active="Roles & Team" />
      <div className="mb-[18px] flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-[18px] font-bold leading-[23px] text-[#223f30]">
            Roles &amp; team members
          </h2>
          <p className="mt-[3px] text-[13px] leading-[18px] text-[#61776a]">
            Each role lists required skills. Each team member lists their own
            skills and weekly workload.
          </p>
        </div>
        <div className="flex shrink-0 gap-[10px]">
          <button
            className="h-[41px] rounded-[11px] border border-[#4b7f5b] bg-white px-[13px] text-[16px] font-semibold text-[#305f49] hover:bg-[#e1eee5]"
            onClick={onAddMember}
            type="button"
          >
            Add team member
          </button>
          <button
            className="h-[41px] rounded-[9px] border border-[#4b7f5b] bg-[#4b7f5b] px-[17px] text-[16px] font-semibold text-white hover:bg-[#3f704f]"
            onClick={onAddRole}
            type="button"
          >
            Add role
          </button>
        </div>
      </div>

      <div className="grid items-start gap-[12px] xl:grid-cols-[minmax(0,684fr)_minmax(360px,428fr)] xl:gap-[18px]">
        <section className="min-h-[522px] min-w-0 overflow-hidden rounded-[16px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="px-5 pt-5">
            <h3 className="text-[19px] font-bold leading-6 text-[#223f30]">
              Roles
            </h3>
          </div>
          <div className="overflow-x-auto px-5 pb-5 pt-[10px]">
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
                    className="h-[44px] border-t border-[#e5ebdf] text-[13px] leading-[19px] sm:text-[14px]"
                    key={role.id}
                  >
                    <td className="truncate pl-[9px] text-[#223f30]">
                      {role.title}
                    </td>
                    <td className="truncate pl-2 text-[#61776a]">
                      {role.requiredSkills}
                    </td>
                    <td className="truncate pl-2 text-[#223f30]">
                      {role.assignedTo}
                    </td>
                    <td className="overflow-hidden pl-2">
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
                      No roles match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-[18px]">
          <WorkloadPanel members={members} search={search} />
          <AssignmentPanel onConfirm={onConfirmAssignment} />
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
    `${member.name} ${member.roleCount}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="min-h-[232px] rounded-[16px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <h3 className="text-[19px] font-bold leading-6 text-[#223f30]">
        Team workload
      </h3>
      <div className="mt-[15px] space-y-[27px]">
        {filteredMembers.map((member) => (
          <div className="space-y-[1px]" key={member.id}>
            <div className="flex items-center justify-between gap-3 text-[15px] leading-6 text-[#223f30]">
              <span className="truncate">
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

function AssignmentPanel({ onConfirm }: { onConfirm: () => void }) {
  return (
    <section className="min-h-[272px] rounded-[16px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <h3 className="text-[19px] font-bold leading-6 text-[#223f30]">
        Assign member to role
      </h3>
      <p className="mt-[14px] text-[14px] leading-4 text-[#61776a]">
        Bookkeeper ← Dilini M.
      </p>
      <div className="mt-[11px] min-h-[59px] rounded-[9px] bg-[#fff1d4] px-3 py-[10px] text-[14px] leading-[18px] text-[#674200]">
        Skill check: Dilini has Accounting basics. Match is good.
      </div>
      <div className="mt-[18px] min-h-[38px] rounded-[9px] bg-[#e1eee5] px-3 py-[10px] text-[13px] leading-[18px] text-[#305f49]">
        Workload check: she would be at 55%. No overload.
      </div>
      <button
        className="mt-[11px] h-[41px] rounded-[11px] bg-[#4b7f5b] px-[17px] text-[16px] font-semibold text-white hover:bg-[#3f704f]"
        onClick={onConfirm}
        type="button"
      >
        Confirm assignment
      </button>
    </section>
  );
}
