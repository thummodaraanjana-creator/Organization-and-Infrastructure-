"use client";

import { useEffect, useState, type FormEvent } from "react";
import { OrganizationHeader } from "./organization-header";
import { OrganizationSidebar } from "./organization-sidebar";
import { OrganizationTabs } from "./organization-tabs";
import {
  formatLkr,
  type EquipmentItem,
} from "./organization-equipment-data";
import { useOrganizationData } from "./use-organization-data";
import type { Role } from "./organization-types";

type GapRow = {
  id: string;
  description: string;
  type: "Role" | "Equipment";
  priority: "Urgent" | "Medium" | "Low";
  estimatedCost: number | null;
};

type ExportOptions = {
  unassignedRoles: boolean;
  missingEquipment: boolean;
  priorityRanking: boolean;
  costTotals: boolean;
};

const priorityClasses = {
  Urgent: "bg-[#fbe3df] text-[#b3261e]",
  Medium: "bg-[#fff1d4] text-[#885400]",
  Low: "bg-[#e1eee5] text-[#305f49]",
};

function getGapRows(equipmentItems: EquipmentItem[], roles: Role[]): GapRow[] {
  const unassignedRoles: GapRow[] = roles
    .filter((role) => role.assignedTo === "Unassigned")
    .map((role) => ({
      id: `role-${role.id}`,
      description: `No one is assigned to ${role.title}`,
      type: "Role",
      priority: role.priority,
      estimatedCost: null,
    }));
  const missingEquipment: GapRow[] = equipmentItems
    .filter((item) => item.status === "Missing")
    .map((item) => ({
      id: `equipment-${item.id}`,
      description: `Missing equipment: ${item.name}`,
      type: "Equipment",
      priority: item.priority,
      estimatedCost: item.estimatedCost * item.quantity,
    }));
  const rank = { Urgent: 0, Medium: 1, Low: 2 };
  return [...unassignedRoles, ...missingEquipment].sort(
    (first, second) =>
      rank[first.priority] - rank[second.priority] ||
      (first.type === second.type ? 0 : first.type === "Role" ? -1 : 1) ||
      first.description.localeCompare(second.description),
  );
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function ExportDialog({
  onClose,
  onExport,
  gapCount,
  moneyNeeded,
}: {
  onClose: () => void;
  onExport: (format: "PDF" | "CSV", options: ExportOptions) => void;
  gapCount: number;
  moneyNeeded: number;
}) {
  const [format, setFormat] = useState<"PDF" | "CSV">("CSV");
  const [options, setOptions] = useState<ExportOptions>({
    unassignedRoles: true,
    missingEquipment: true,
    priorityRanking: true,
    costTotals: true,
  });
  const includeOptions: { key: keyof ExportOptions; label: string }[] = [
    { key: "unassignedRoles", label: "Unassigned roles" },
    { key: "missingEquipment", label: "Missing equipment" },
    { key: "priorityRanking", label: "Priority ranking" },
    { key: "costTotals", label: "Cost totals" },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onExport(format, options);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/45 p-4">
      <button
        aria-label="Close export dialog"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <section
        aria-labelledby="export-gap-title"
        aria-modal="true"
        className="relative z-10 my-auto w-full max-w-[390px] rounded-[12px] bg-white px-4 pb-4 pt-4 shadow-2xl"
        role="dialog"
      >
        <h2 className="text-[16px] font-bold text-[#223f30]" id="export-gap-title">
          Export gap report
        </h2>
        <p className="mt-1 border-b border-[#e5ebdf] pb-3 text-[11px] text-[#61776a]">
          {gapCount} gaps · Total money needed LKR {formatLkr(moneyNeeded)}
        </p>
        <form onSubmit={submit}>
          <label className="mt-3 block text-[11px] font-semibold text-[#61776a]">
            Format
            <select
              autoFocus
              className="mt-1 h-[36px] w-full rounded-[7px] border border-[#d6dfd8] bg-white px-2 text-[12px] font-normal text-[#223f30]"
              onChange={(event) =>
                setFormat(event.target.value as "PDF" | "CSV")
              }
              value={format}
            >
              <option>PDF</option>
              <option>CSV</option>
            </select>
          </label>
          <fieldset className="mt-3 border-t border-[#e5ebdf] pt-3">
            <legend className="text-[11px] font-semibold text-[#61776a]">
              Include
            </legend>
            <div className="mt-2 space-y-2">
              {includeOptions.map(({ key, label }) => (
                <label
                  className="flex items-center gap-2 text-[12px] text-[#405a4b]"
                  key={key}
                >
                  <input
                    checked={options[key]}
                    className="size-3.5 accent-[#305f49]"
                    onChange={(event) =>
                      setOptions((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }))
                    }
                    type="checkbox"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="h-[37px] rounded-[8px] border border-[#91af9a] px-4 text-[12px] font-medium text-[#305f49] hover:bg-[#f5f8f6]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-[37px] rounded-[8px] bg-[#305f49] px-4 text-[12px] font-semibold text-white hover:bg-[#254d3a]"
              type="submit"
            >
              Export
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  detail,
  emphasis = false,
}: {
  title: string;
  value: string;
  detail: string;
  emphasis?: boolean;
}) {
  return (
    <section
      className={`min-h-[92px] rounded-[12px] px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] ${
        emphasis ? "bg-[#305f49] text-white" : "bg-white text-[#305f49]"
      }`}
    >
      <p className={`text-[12px] ${emphasis ? "text-white/90" : "text-[#61776a]"}`}>
        {title}
      </p>
      <p className="text-[24px] font-bold leading-8">{value}</p>
      <p className={`text-[12px] leading-[16px] ${emphasis ? "text-white/90" : "text-[#61776a]"}`}>
        {detail}
      </p>
    </section>
  );
}

export default function OrganizationGapReport() {
  const { items, roles } = useOrganizationData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [printOptions, setPrintOptions] = useState<ExportOptions>({
    unassignedRoles: true,
    missingEquipment: true,
    priorityRanking: true,
    costTotals: true,
  });
  const rows = getGapRows(items, roles);
  const filteredRows = rows.filter((row) =>
    `${row.description} ${row.type} ${row.priority}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const visibleRows = filteredRows.filter(
    (row) =>
      (row.type === "Role" && printOptions.unassignedRoles) ||
      (row.type === "Equipment" && printOptions.missingEquipment),
  );
  const unassignedRoleCount = roles.filter(
    (role) => role.assignedTo === "Unassigned",
  ).length;
  const missingEquipmentCount = items.filter(
    (item) => item.status === "Missing",
  ).length;
  const totalMoney = rows.reduce(
    (sum, row) => sum + (row.estimatedCost ?? 0),
    0,
  );
  const urgentCount = rows.filter((row) => row.priority === "Urgent").length;

  function exportReport(format: "PDF" | "CSV", options: ExportOptions) {
    setDialogOpen(false);
    if (format === "PDF") {
      setPrintOptions(options);
      window.setTimeout(() => window.print(), 50);
      return;
    }

    const exportRows = filteredRows.filter(
      (row) =>
        (row.type === "Role" && options.unassignedRoles) ||
        (row.type === "Equipment" && options.missingEquipment),
    );
    const headings = [
      "#",
      "Gap",
      "Type",
      ...(options.priorityRanking ? ["Priority"] : []),
      ...(options.costTotals ? ["Estimated total (LKR)"] : []),
    ];
    const exportTotal = exportRows.reduce(
      (sum, row) => sum + (row.estimatedCost ?? 0),
      0,
    );
    const csvRows = exportRows.map((row, index) => [
      String(index + 1),
      row.description,
      row.type,
      ...(options.priorityRanking ? [row.priority] : []),
      ...(options.costTotals
        ? [row.estimatedCost === null ? "N/A" : String(row.estimatedCost)]
        : []),
    ]);
    if (options.costTotals) {
      csvRows.push([
        "",
        "Total money needed",
        "",
        ...(options.priorityRanking ? [""] : []),
        String(exportTotal),
      ]);
    }
    const csv = [headings, ...csvRows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const download = document.createElement("a");
    download.href = url;
    download.download = "ASARA-Gap-Report.csv";
    document.body.append(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Gap report CSV downloaded.");
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
        onUnavailable={(feature) => setNotice(`${feature} is not available in this local screen.`)}
        searchPlaceholder="Search gaps"
        search={search}
        title="Organization"
      />
      <main className="ml-0 min-w-0 px-4 pb-8 pt-4 lg:ml-[232px] lg:px-5 lg:pt-5">
        <div className="mx-auto max-w-[1120px]">
          <div className="print:hidden">
            <OrganizationTabs active="Gap Report" />
          </div>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-[18px] font-bold leading-6">Gap Report</h2>
              <p className="mt-0.5 text-[13px] leading-4 text-[#61776a]">
                Unassigned roles and missing equipment, ranked by priority.
              </p>
            </div>
            <button
              className="h-10 rounded-[9px] border border-[#91af9a] bg-white px-4 text-sm font-semibold text-[#305f49] hover:bg-[#f5f8f6] print:hidden"
              onClick={() => setDialogOpen(true)}
              type="button"
            >
              Export
            </button>
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              title="Total gaps"
              value={String(rows.length)}
              detail={`${unassignedRoleCount} roles · ${missingEquipmentCount} equipment items`}
            />
            <SummaryCard
              title="Urgent gaps"
              value={String(urgentCount)}
              detail="Address these first"
            />
            <div className={printOptions.costTotals ? "" : "print:hidden"}>
              <SummaryCard
                emphasis
                title="Money needed"
                value={`LKR ${formatLkr(totalMoney)}`}
                detail="for missing tools and equipment"
              />
            </div>
          </div>
          <section className="overflow-hidden rounded-[12px] bg-white px-3 pb-3 pt-2 shadow-[0_1px_3px_rgba(0,0,0,0.12)] sm:px-4">
            <div className="flex items-center justify-between border-b border-[#edf1ec] px-1 pb-2">
              <h3 className="text-[14px] font-bold text-[#223f30]">Gap details</h3>
              <span className="text-[11px] font-medium text-[#61776a]">
                {visibleRows.length} {visibleRows.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div aria-label="Gap report details" className="overflow-x-auto pt-1" tabIndex={0}>
              <table className="w-full min-w-[600px] border-collapse text-left text-[12px]">
                <thead className="h-[32px] border-b border-[#e5ebdf] text-[10px] font-bold text-[#61776a]">
                  <tr>
                    <th className="w-[5%] px-1">#</th>
                    <th className="w-[49%] px-1">Gap</th>
                    <th className="w-[14%] px-1">Type</th>
                    {printOptions.priorityRanking && (
                      <th className="w-[17%] px-1">Priority</th>
                    )}
                    {printOptions.costTotals && (
                      <th className="w-[15%] px-1 text-right">Est. cost (LKR)</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, index) => (
                      <tr
                        className="h-[31px] border-b border-[#eef1ed]"
                        key={row.id}
                      >
                        <td className="px-1">{index + 1}</td>
                        <td className="px-1">{row.description}</td>
                        <td className="px-1">{row.type}</td>
                        {printOptions.priorityRanking && (
                          <td className="px-1">
                            <span className={`rounded-full px-2 py-1 text-[10px] ${priorityClasses[row.priority]}`}>
                              {row.priority}
                            </span>
                          </td>
                        )}
                        {printOptions.costTotals && (
                          <td className="px-1 text-right text-[#405a4b]">
                            {row.estimatedCost === null
                              ? "N/A"
                              : formatLkr(row.estimatedCost)}
                          </td>
                        )}
                      </tr>
                    ))}
                  {visibleRows.length === 0 && (
                    <tr>
                      <td
                        className="h-16 px-1 text-[#61776a]"
                        colSpan={
                          3 +
                          Number(printOptions.priorityRanking) +
                          Number(printOptions.costTotals)
                        }
                      >
                        {rows.length === 0
                          ? "There are no current gaps."
                          : "No gaps match your search."}
                      </td>
                    </tr>
                  )}
                  {printOptions.costTotals && (
                    <tr className="h-[34px] font-bold">
                      <td
                        className="px-1"
                        colSpan={printOptions.priorityRanking ? 4 : 3}
                      >
                        Total money needed
                      </td>
                      <td
                        className="px-1 text-right"
                        colSpan={1}
                      >
                        {formatLkr(totalMoney)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <p className="sr-only" aria-live="polite">
            {rows.length} total gaps and LKR {formatLkr(totalMoney)} needed.
          </p>
        </div>
      </main>
      {dialogOpen && (
        <ExportDialog
          gapCount={rows.length}
          moneyNeeded={totalMoney}
          onClose={() => setDialogOpen(false)}
          onExport={exportReport}
        />
      )}
      {notice && (
        <div
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[80] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-[#223f30] px-4 py-3 text-center text-sm text-white shadow-lg print:hidden"
          role="status"
        >
          {notice}
        </div>
      )}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          aside,
          header {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
