"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  initialEquipmentItems,
  type EquipmentItem,
} from "./organization-equipment-data";

type EquipmentItemsContextValue = {
  items: EquipmentItem[];
  setItems: Dispatch<SetStateAction<EquipmentItem[]>>;
};

const EquipmentItemsContext =
  createContext<EquipmentItemsContextValue | null>(null);

export function OrganizationEquipmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState(initialEquipmentItems);

  return (
    <EquipmentItemsContext.Provider value={{ items, setItems }}>
      {children}
    </EquipmentItemsContext.Provider>
  );
}

export function useOrganizationEquipmentItems() {
  const context = useContext(EquipmentItemsContext);
  if (!context) {
    throw new Error(
      "Organization equipment must be used inside OrganizationEquipmentProvider.",
    );
  }
  return context;
}
