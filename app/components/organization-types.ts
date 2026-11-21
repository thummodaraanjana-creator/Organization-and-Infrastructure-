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
  priority: "Urgent" | "Medium" | "Low";
  match: "Good match" | "Partial match" | "Gap";
  matchTone: "good" | "warning" | "danger" | "neutral";
};
