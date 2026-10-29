export type TeamMember = {
  id: string;
  name: string;
  contact: string;
  skills: string[];
  weeklyCapacity: number;
  employmentType: string;
  workload: number;
  roleCount: number;
};

export type Role = {
  id: string;
  title: string;
  requiredSkills: string;
  assignedTo: string;
  match: "Good match" | "Partial: missing 1" | "Gap";
  matchTone: "good" | "warning" | "danger" | "neutral";
};
