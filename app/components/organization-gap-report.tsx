"use client";

import { useState, type FormEvent } from "react";
import { OrganizationHeader } from "./organization-header";
import { OrganizationSidebar } from "./organization-sidebar";
import { OrganizationTabs } from "./organization-tabs";
import {
  formatLkr,
  type EquipmentItem,
} from "./organization-equipment-data";
import { initialRoles } from "./organization-data";
import { useOrganizationEquipmentItems } from "./use-organization-equipment-items";

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

function getGapRows(equipmentItems: EquipmentItem[]): GapRow[] {
  const unassignedRoles: GapRow[] = initialRoles
    .filter((role) => role.assignedTo === "Unassigned")
    .map((role) => ({
      id: `role-${role.id}`,
      description: `${role.title} has nobody assigned`,
      type: "Role",
      priority:
        role.title === "Bookkeeper"
          ? "Urgent"
          : role.title === "Marketing Lead"
            ? "Medium"
            : "Low",
      estimatedCost: null,
    }));
  const missingEquipment: GapRow[] = equipmentItems
    .filter((item) => item.status === "Missing")
    .map((item) => ({
      id: `equipment-${item.id}`,
      description: `${item.name} is missing`,
      type: "Equipment",
      priority: item.priority,
      estimatedCost: item.estimatedCost,
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
  const [format, setFormat] = useState<"PDF" | "CSV">("PDF");
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
        className="relative z-10 my-auto w-full max-w-[390px] rounded-[12px] bg-white px-5 pb-5 pt-5 shadow-2xl"
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
      className={`min-h-[82px] rounded-[12px] px-4 py-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] ${
        emphasis ? "bg-[#305f49] text-white" : "bg-white text-[#305f49]"
      }`}
    >
      <p className={`text-[11px] ${emphasis ? "text-white/90" : "text-[#61776a]"}`}>
        {title}
      </p>
      <p className="text-[24px] font-bold leading-[27px]">{value}</p>
      <p className={`text-[11px] ${emphasis ? "text-white/90" : "text-[#61776a]"}`}>
        {detail}
      </p>
    </section>
  );
}

export default function OrganizationGapReport() {
  const { items } = useOrganizationEquipmentItems();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [printOptions, setPrintOptions] = useState<ExportOptions>({
    unassignedRoles: true,
    missingEquipment: true,
    priorityRanking: true,
    costTotals: true,
  });
  const rows = getGapRows(items);
  const unassignedRoleCount = initialRoles.filter(
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

    const filteredRows = rows.filter(
      (row) =>
        (row.type === "Role" && options.unassignedRoles) ||
        (row.type === "Equipment" && options.missingEquipment),
    );
    const headings = [
      "#",
      "Gap",
      "Type",
      ...(options.priorityRanking ? ["Priority"] : []),
      ...(options.costTotals ? ["Estimated cost (LKR)"] : []),
    ];
    const csvRows = filteredRows.map((row, index) => [
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
        String(totalMoney),
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
    download.download = "asara-gap-report.csv";
    download.click();
    URL.revokeObjectURL(url);
    setNotice("Gap report CSV downloaded.");
  }

  return (
    <div className="min-h-screen bg-[#e5ebdf] text-[#223f30]">
      <OrganizationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onUnavailable={(feature) => setNotice(`${feature} is not available in this local screen.`)}
      />
      <OrganizationHeader
        onMenuClick={() => setSidebarOpen(true)}
        onSearchChange={() => undefined}
        onUnavailable={(feature) => setNotice(`${feature} is not available in this local screen.`)}
        search=""
        title="Organization"
      />
      <main className="ml-0 px-4 pb-8 pt-[66px] md:ml-[286px] md:pl-3 md:pr-[10px] md:pt-[32px]">
        <div className="mx-auto max-w-[1192px]">
          <div className="print:hidden">
            <OrganizationTabs active="Gap Report" />
          </div>
          <div className="mb-[11px] flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold leading-[23px]">Gap report</h2>
              <p className="text-[13px] text-[#61776a]">
                Everything missing in your organisation, ranked by priority.
              </p>
            </div>
            <button
              className="h-[37px] rounded-[8px] border border-[#91af9a] bg-white px-[14px] text-[12px] font-semibold text-[#305f49] hover:bg-[#f5f8f6] print:hidden"
              onClick={() => setDialogOpen(true)}
              type="button"
            >
              Export
            </button>
          </div>
          <div className="mb-[13px] grid gap-3 sm:grid-cols-3">
            <SummaryCard
              title="Total gaps"
              value={String(rows.length)}
              detail={`${unassignedRoleCount} roles · ${missingEquipmentCount} items`}
            />
            <SummaryCard
              title="Urgent"
              value={String(urgentCount)}
              detail="fix first"
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
          <section className="overflow-hidden rounded-[12px] bg-white px-3 pb-3 pt-3 shadow-[0_1px_3px_rgba(0,0,0,0.12)] sm:px-4">
            <div className="overflow-x-auto">
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
                  {rows
                    .filter(
                      (row) =>
                        (row.type === "Role" && printOptions.unassignedRoles) ||
                        (row.type === "Equipment" && printOptions.missingEquipment),
                    )
                    .map((row, index) => (
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
            {rows.length} gaps and LKR {formatLkr(totalMoney)} needed.
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
          className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-lg bg-[#223f30] px-4 py-3 text-sm text-white shadow-lg print:hidden"
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
