export interface OrganizationMember {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "developer";
  avatar?: string;
  joinedAt: string;
}