"use client";

import { useEffect, useState, type FormEvent } from "react";
import { OrganizationHeader } from "./organization-header";
import { OrganizationSidebar } from "./organization-sidebar";
import { OrganizationTabs } from "./organization-tabs";
import {
  formatLkr,
  suggestedEquipment,
  type EquipmentItem,
  type EquipmentPriority,
  type EquipmentStatus,
} from "./organization-equipment-data";
import { useOrganizationEquipmentItems } from "./use-organization-data";

function AddEquipmentDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (item: Omit<EquipmentItem, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sales");
  const [priority, setPriority] = useState<EquipmentPriority>("Urgent");
  const [status, setStatus] = useState<EquipmentStatus>("Missing");
  const [quantity, setQuantity] = useState("1");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cost = Number(estimatedCost);
    const itemQuantity = Number(quantity);
    if (!name.trim()) {
      setError("Enter an item name.");
      return;
    }
    if (!Number.isFinite(cost) || cost < 0 || !estimatedCost) {
      setError("Enter a valid estimated cost.");
      return;
    }
    if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
      setError("Enter a quantity of at least 1.");
      return;
    }
    onSave({
      name: name.trim(),
      category,
      priority,
      status,
      quantity: itemQuantity,
      estimatedCost: cost,
      notes: notes.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/45 p-4">
      <button
        aria-label="Close add item dialog"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <section
        aria-labelledby="add-equipment-title"
        aria-modal="true"
        className="relative z-10 my-auto w-full max-w-[400px] rounded-[12px] bg-white shadow-2xl"
        role="dialog"
      >
        <h2
          className="border-b border-[#e5ebdf] px-5 py-[17px] text-[16px] font-bold text-[#223f30]"
          id="add-equipment-title"
        >
          Add equipment
        </h2>
        <form className="space-y-3 px-5 pb-5 pt-4" onSubmit={submit}>
          <label className="block text-[12px] font-semibold text-[#405a4b]">
            Item name
            <input
              autoFocus
              className="mt-1 h-[38px] w-full rounded-[7px] border border-[#d6dfd8] px-3 text-[13px] font-normal outline-none focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. POS tablet"
              value={name}
            />
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="text-[12px] font-semibold text-[#405a4b]">
              Category
              <select
                className="mt-1 h-[38px] w-full rounded-[7px] border border-[#d6dfd8] bg-white px-2 text-[13px] font-normal"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                {["Sales", "Operations", "Marketing", "Finance"].map(
                  (option) => (
                    <option key={option}>{option}</option>
                  ),
                )}
              </select>
            </label>
            <label className="text-[12px] font-semibold text-[#405a4b]">
              Priority
              <select
                className="mt-1 h-[38px] w-full rounded-[7px] border border-[#d6dfd8] bg-white px-2 text-[13px] font-normal"
                onChange={(event) =>
                  setPriority(event.target.value as EquipmentPriority)
                }
                value={priority}
              >
                {(["Urgent", "Medium", "Low"] as const).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-[12px] font-semibold text-[#405a4b]">
            Quantity
            <input
              className="mt-1 h-[38px] w-full rounded-[7px] border border-[#d6dfd8] px-3 text-[13px] font-normal outline-none focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
              min="1"
              onChange={(event) => setQuantity(event.target.value)}
              type="number"
              value={quantity}
            />
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="text-[12px] font-semibold text-[#405a4b]">
              Status
              <select
                className="mt-1 h-[38px] w-full rounded-[7px] border border-[#d6dfd8] bg-white px-2 text-[13px] font-normal"
                onChange={(event) =>
                  setStatus(event.target.value as EquipmentStatus)
                }
                value={status}
              >
                <option>Missing</option>
                <option>Owned</option>
              </select>
            </label>
            <label className="text-[12px] font-semibold text-[#405a4b]">
              Unit cost (LKR)
              <input
                className="mt-1 h-[38px] w-full rounded-[7px] border border-[#d6dfd8] px-2 text-[13px] font-normal outline-none focus:border-[#4b7f5b]"
                min="0"
                onChange={(event) => setEstimatedCost(event.target.value)}
                placeholder="e.g. 60000"
                type="number"
                value={estimatedCost}
              />
            </label>
          </div>
          <p className="rounded-[7px] bg-[#e7f3ed] px-3 py-2 text-[11px] leading-[15px] text-[#476c59]">
            The total for a missing item is its quantity multiplied by its unit cost.
          </p>
          <label className="block text-[12px] font-semibold text-[#405a4b]">
            Notes (optional)
            <textarea
              className="mt-1 min-h-[58px] w-full resize-y rounded-[7px] border border-[#d6dfd8] px-3 py-2 text-[13px] font-normal outline-none focus:border-[#4b7f5b]"
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Supplier, model..."
              value={notes}
            />
          </label>
          {error && (
            <p className="text-[12px] text-[#b3261e]" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2 pt-1 sm:justify-between">
            <button
              className="h-[37px] rounded-[8px] border border-[#d6dfd8] px-4 text-[13px] text-[#405a4b] hover:bg-[#f5f8f6]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-[37px] rounded-[8px] bg-[#305f49] px-4 text-[13px] font-semibold text-white hover:bg-[#254d3a]"
              type="submit"
            >
              Save item
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function OrganizationEquipment() {
  const { items, setItems } = useOrganizationEquipmentItems();
  const missingItems = items.filter((item) => item.status === "Missing");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const missingTotal = missingItems.reduce(
    (total, item) => total + item.estimatedCost * item.quantity,
    0,
  );
  const [search, setSearch] = useState("");
  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category} ${item.priority} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function addEquipment(item: Omit<EquipmentItem, "id">) {
    setItems((current) => [
      ...current,
      { ...item, id: crypto.randomUUID() },
    ]);
    setDialogOpen(false);
    setNotice(`${item.name} was added to equipment.`);
  }

  function addSuggestion(suggestion: (typeof suggestedEquipment)[number]) {
    if (items.some((item) => item.name === suggestion.name)) return;
    setItems((current) => [
      ...current,
      {
        ...suggestion,
        id: crypto.randomUUID(),
        priority: "Medium",
        status: "Missing",
        quantity: 1,
        estimatedCost: 0,
        notes: "",
      },
    ]);
    setNotice(`${suggestion.name} was added. Add its estimated cost in the list.`);
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
        searchPlaceholder="Search equipment"
        search={search}
        title="Organization"
      />
      <main className="ml-0 min-w-0 px-4 pb-8 pt-4 lg:ml-[232px] lg:px-5 lg:pt-5">
        <div className="mx-auto max-w-[1120px]">
          <OrganizationTabs active="Equipment & Costs" />
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-[18px] font-bold leading-6">Equipment &amp; Costs</h2>
              <p className="mt-0.5 text-[13px] leading-4 text-[#61776a]">
                Track equipment, quantities, and estimated costs. Only missing items count toward the total.
              </p>
            </div>
            <button
              className="h-10 rounded-[9px] bg-[#4b7f5b] px-4 text-sm font-semibold text-white hover:bg-[#3f704f]"
              onClick={() => setDialogOpen(true)}
              type="button"
            >
              Add item
            </button>
          </div>
          <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1.58fr)_minmax(260px,0.92fr)]">
            <section className="min-w-0 overflow-hidden rounded-[12px] bg-white px-3 pb-3 pt-2 shadow-[0_1px_3px_rgba(0,0,0,0.1)] sm:px-4">
              <div aria-label="Equipment costs" className="overflow-x-auto" tabIndex={0}>
                <table className="w-full min-w-[850px] border-collapse text-left text-[12px]">
                  <thead className="h-[34px] border-b border-[#e5ebdf] text-[11px] font-semibold text-[#61776a]">
                    <tr>
                      <th className="w-[20%] px-2">Item</th>
                      <th className="w-[14%] px-2">Category</th>
                      <th className="w-[14%] px-2">Priority</th>
                      <th className="w-[14%] px-2">Status</th>
                      <th className="w-[10%] px-2 text-right">Quantity</th>
                      <th className="w-[18%] px-2 text-right">Unit cost (LKR)</th>
                      <th className="w-[10%] px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr className="h-[44px] border-b border-[#eef1ed]" key={item.id}>
                        <td className="px-2">
                          <input
                            aria-label={`Equipment name for ${item.name}`}
                            className="h-8 w-full min-w-24 rounded-md border border-[#d6dfd8] px-2 text-xs text-[#223f30] focus:border-[#4b7f5b] focus:outline-none"
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, name: event.target.value }
                                    : entry,
                                ),
                              )
                            }
                            value={item.name}
                          />
                        </td>
                        <td className="px-2">
                          <select
                            aria-label={`Category for ${item.name}`}
                            className="h-8 w-full rounded-md border border-[#d6dfd8] bg-white px-1 text-xs text-[#223f30]"
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, category: event.target.value }
                                    : entry,
                                ),
                              )
                            }
                            value={item.category}
                          >
                            {["Sales", "Operations", "Marketing", "Finance"].map(
                              (category) => (
                                <option key={category}>{category}</option>
                              ),
                            )}
                          </select>
                        </td>
                        <td className="px-2">
                          <select
                            aria-label={`Priority for ${item.name}`}
                            className="h-8 w-full rounded-md border border-[#d6dfd8] bg-white px-1 text-xs text-[#223f30]"
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        priority: event.target.value as EquipmentPriority,
                                      }
                                    : entry,
                                ),
                              )
                            }
                            value={item.priority}
                          >
                            {(["Urgent", "Medium", "Low"] as const).map(
                              (priority) => (
                                <option key={priority}>{priority}</option>
                              ),
                            )}
                          </select>
                        </td>
                        <td className="px-2">
                          <select
                            aria-label={`Status for ${item.name}`}
                            className="h-8 w-full rounded-md border border-[#d6dfd8] bg-white px-1 text-xs text-[#223f30]"
                            onChange={(event) =>
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        status: event.target.value as EquipmentStatus,
                                      }
                                    : entry,
                                ),
                              )
                            }
                            value={item.status}
                          >
                            <option>Missing</option>
                            <option>Owned</option>
                          </select>
                        </td>
                        <td className="px-2 text-right">
                          <input
                            aria-label={`Quantity for ${item.name}`}
                            className="h-8 w-16 rounded-md border border-[#91af9a] px-2 text-right text-xs"
                            min="1"
                            onBlur={() => {
                              if (item.quantity < 1) {
                                setItems((current) =>
                                  current.map((entry) =>
                                    entry.id === item.id
                                      ? { ...entry, quantity: 1 }
                                      : entry,
                                  ),
                                );
                              }
                            }}
                            onChange={(event) => {
                              const quantity = Number(event.target.value);
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        quantity: Number.isInteger(quantity)
                                          ? quantity
                                          : entry.quantity,
                                      }
                                    : entry,
                                ),
                              );
                            }}
                            type="number"
                            value={item.quantity}
                          />
                        </td>
                        <td className="px-2 text-right">
                          <input
                            aria-label={`Unit cost for ${item.name}`}
                            className="h-8 w-28 rounded-md border border-[#91af9a] bg-white px-2 text-right text-xs outline-none focus:ring-1 focus:ring-[#4b7f5b]"
                            min="0"
                            onChange={(event) => {
                              const cost = Number(event.target.value);
                              if (!Number.isFinite(cost) || cost < 0) return;
                              setItems((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? { ...entry, estimatedCost: cost }
                                    : entry,
                                ),
                              );
                            }}
                            type="number"
                            value={item.estimatedCost}
                          />
                        </td>
                        <td className="px-2 text-right">
                          <button
                            aria-label={`Remove ${item.name}`}
                            className="rounded px-2 py-1 text-xs font-semibold text-[#8b1d1d] hover:bg-[#fbe3df]"
                            onClick={() =>
                              setItems((current) =>
                                current.filter((entry) => entry.id !== item.id),
                              )
                            }
                            type="button"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td className="h-20 px-2 text-[#61776a]" colSpan={7}>
                          {items.length === 0
                            ? "No equipment has been added yet."
                            : "No equipment matches your search."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <section className="min-h-[146px] rounded-[12px] bg-[#305f49] px-4 py-[15px] text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <p className="text-[12px]">Total money needed (missing items)</p>
                <p className="mt-1 text-[25px] font-bold leading-[30px]">
                  LKR {formatLkr(missingTotal)}
                </p>
                <p className="text-[12px]">
                  {missingItems.length}{" "}
                  {missingItems.length === 1 ? "item" : "items"}{" "}
                  still to buy
                </p>
              </section>
              <section className="min-h-[146px] rounded-[12px] bg-white px-4 py-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <h3 className="text-[14px] font-bold">Suggested for Retail</h3>
                <p className="mt-0.5 text-[12px] text-[#61776a]">Select an item to add it to your list.</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {suggestedEquipment.map((suggestion) => {
                    const added = items.some((item) => item.name === suggestion.name);
                    return (
                      <button
                        className="rounded-[8px] border border-[#91af9a] px-[10px] py-1 text-[11px] text-[#305f49] hover:bg-[#e1eee5] disabled:cursor-default disabled:bg-[#e1eee5]"
                        disabled={added}
                        key={suggestion.name}
                        onClick={() => addSuggestion(suggestion)}
                        type="button"
                      >
                        {added ? `${suggestion.name} added` : suggestion.name}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      {dialogOpen && (
        <AddEquipmentDialog
          onClose={() => setDialogOpen(false)}
          onSave={addEquipment}
        />
      )}
      {notice && (
        <div
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[80] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-[#223f30] px-4 py-3 text-center text-sm text-white shadow-lg"
          role="status"
        >
          {notice}
          <button
            aria-label="Dismiss notification"
            className="ml-3 font-bold"
            onClick={() => setNotice("")}
            type="button"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
