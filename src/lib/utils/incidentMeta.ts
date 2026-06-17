import type { Incident } from "@/lib/api";

export const titleToType: Record<string, string> = {
  "Impossible Travel Login": "Identity",
  "Multiple Failed Logins": "Authentication",
  "Privilege Escalation": "Privilege Abuse",
  "Unusual Data Download": "Data Exfiltration",
  "New Device Login": "Suspicious Login",
  "Malware Detected": "Malware",
  "Suspicious API Activity": "API Abuse",
  "Phishing Email Reported": "Phishing",
};

export const incidentDetails: Record<
  string,
  {
    display_id: string;
    status: Incident["status"];
    owner: string;
    description: string;
    city: string;
    isp: string;
    department: string;
    role: string;
  }
> = {
  inc_1001: {
    display_id: "INC-2024-0001",
    status: "Open",
    owner: "Unassigned",
    description:
      "User admin.finance logged in from Saudi Arabia and Russia within 4 minutes. This behavior is considered impossible travel.",
    city: "Moscow",
    isp: "Rostelecom",
    department: "Finance",
    role: "System Administrator",
  },
  inc_1002: {
    display_id: "INC-2024-0002",
    status: "Investigating",
    owner: "SOC Team A",
    description:
      "More than 12 failed authentication attempts detected within 10 minutes from a single source IP.",
    city: "Singapore",
    isp: "Singtel",
    department: "Operations",
    role: "Analyst",
  },
  inc_1003: {
    display_id: "INC-2024-0003",
    status: "Under Review",
    owner: "Unassigned",
    description:
      "User added to privileged security group outside normal change window.",
    city: "Riyadh",
    isp: "STC",
    department: "IT",
    role: "Developer",
  },
  inc_1004: {
    display_id: "INC-2024-0004",
    status: "Investigating",
    owner: "SOC Team B",
    description:
      "Large outbound data transfer to external cloud storage detected during off-hours.",
    city: "Dubai",
    isp: "Etisalat",
    department: "Sales",
    role: "Manager",
  },
  inc_1005: {
    display_id: "INC-2024-0005",
    status: "Resolved",
    owner: "Automated",
    description:
      "First-time device fingerprint observed for user login. Verified with user via MFA challenge.",
    city: "Berlin",
    isp: "Deutsche Telekom",
    department: "HR",
    role: "Staff",
  },
  inc_1006: {
    display_id: "INC-2024-0006",
    status: "Open",
    owner: "Unassigned",
    description:
      "Endpoint protection flagged malicious executable quarantined on workstation.",
    city: "Riyadh",
    isp: "STC",
    department: "Finance",
    role: "Analyst",
  },
  inc_1007: {
    display_id: "INC-2024-0007",
    status: "Under Review",
    owner: "SOC Team A",
    description:
      "Unusual volume of API calls to admin endpoints from non-admin service account.",
    city: "Jeddah",
    isp: "Mobily",
    department: "Engineering",
    role: "DevOps",
  },
  inc_1008: {
    display_id: "INC-2024-0008",
    status: "Resolved",
    owner: "SOC Team B",
    description:
      "User-reported phishing email with malicious link blocked at mail gateway.",
    city: "Riyadh",
    isp: "STC",
    department: "Legal",
    role: "Counsel",
  },
};

export function enrichIncident(inc: Incident): Incident {
  const meta = incidentDetails[inc.id];
  return {
    ...inc,
    incident_type: inc.incident_type ?? titleToType[inc.title] ?? "Security",
    status: inc.status ?? meta?.status ?? "Open",
    owner: inc.owner ?? meta?.owner ?? "Unassigned",
    display_id: inc.display_id ?? meta?.display_id ?? inc.id,
    description: inc.description ?? meta?.description ?? "",
    city: inc.city ?? meta?.city ?? inc.country,
    isp: inc.isp ?? meta?.isp ?? "—",
    department: inc.department ?? meta?.department ?? "—",
    role: inc.role ?? meta?.role ?? "—",
  };
}
