import type { ReactNode } from "react";
import { OrganizationEquipmentProvider } from "../components/use-organization-equipment-items";

export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <OrganizationEquipmentProvider>
      {children}
    </OrganizationEquipmentProvider>
  );
}
