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
import { initialMembers, initialRoles } from "./organization-data";
import type { Role, TeamMember } from "./organization-types";

type OrganizationDataContextValue = {
  items: EquipmentItem[];
  setItems: Dispatch<SetStateAction<EquipmentItem[]>>;
  members: TeamMember[];
  setMembers: Dispatch<SetStateAction<TeamMember[]>>;
  roles: Role[];
  setRoles: Dispatch<SetStateAction<Role[]>>;
};

const OrganizationDataContext =
  createContext<OrganizationDataContextValue | null>(null);

export function OrganizationDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState(initialEquipmentItems);
  const [members, setMembers] = useState(initialMembers);
  const [roles, setRoles] = useState(initialRoles);

  return (
    <OrganizationDataContext.Provider
      value={{ items, setItems, members, setMembers, roles, setRoles }}
    >
      {children}
    </OrganizationDataContext.Provider>
  );
}

export function useOrganizationData() {
  const context = useContext(OrganizationDataContext);
  if (!context) {
    throw new Error(
      "Organization data must be used inside OrganizationDataProvider.",
    );
  }
  return context;
}

export function useOrganizationEquipmentItems() {
  const { items, setItems } = useOrganizationData();
  return { items, setItems };
}
