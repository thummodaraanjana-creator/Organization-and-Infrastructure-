export type EquipmentPriority = "Urgent" | "Medium" | "Low";
export type EquipmentStatus = "Missing" | "Owned";

export type EquipmentItem = {
  id: string;
  name: string;
  category: string;
  priority: EquipmentPriority;
  status: EquipmentStatus;
  estimatedCost: number;
  notes: string;
};

export const initialEquipmentItems: EquipmentItem[] = [
  {
    id: "pos-tablet",
    name: "POS tablet",
    category: "Sales",
    priority: "Urgent",
    status: "Missing",
    estimatedCost: 60000,
    notes: "",
  },
  {
    id: "display-shelves",
    name: "Display shelves",
    category: "Sales",
    priority: "Medium",
    status: "Missing",
    estimatedCost: 45000,
    notes: "",
  },
  {
    id: "packing-table",
    name: "Packing table",
    category: "Operations",
    priority: "Low",
    status: "Missing",
    estimatedCost: 25000,
    notes: "",
  },
  {
    id: "laptop",
    name: "Laptop",
    category: "Operations",
    priority: "Medium",
    status: "Owned",
    estimatedCost: 150000,
    notes: "",
  },
  {
    id: "barcode-scanner",
    name: "Barcode scanner",
    category: "Sales",
    priority: "Low",
    status: "Owned",
    estimatedCost: 18000,
    notes: "",
  },
  {
    id: "receipt-printer",
    name: "Receipt printer",
    category: "Sales",
    priority: "Medium",
    status: "Owned",
    estimatedCost: 32000,
    notes: "",
  },
  {
    id: "shop-signage",
    name: "Shop signage",
    category: "Marketing",
    priority: "Low",
    status: "Owned",
    estimatedCost: 20000,
    notes: "",
  },
];

export const suggestedEquipment = [
  { name: "Cash drawer", category: "Sales" },
  { name: "Security camera", category: "Operations" },
  { name: "Shopping bags", category: "Sales" },
] as const;

export function formatLkr(amount: number) {
  return new Intl.NumberFormat("en-LK").format(amount);
}
