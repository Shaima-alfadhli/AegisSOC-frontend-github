export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Disabled";
  lastLogin: string;
  mfa: "Enabled" | "Disabled";
  avatarInitials: string;
  phone?: string;
  location?: string;
};
