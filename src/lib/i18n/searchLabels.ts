import { translations, type Locale } from "@/lib/i18n/translations";

const en = translations.en;
const ar = translations.ar;

export const COUNTRY_AR: Record<string, string> = {
  Russia: "روسيا",
  "Saudi Arabia": "السعودية",
  Singapore: "سنغافورة",
  UAE: "الإمارات",
  Germany: "ألمانيا",
};

export const INCIDENT_TITLE_AR: Record<string, string> = {
  "Impossible Travel Login": "تسجيل دخول سفر مستحيل",
  "Multiple Failed Logins": "محاولات تسجيل دخول فاشلة متعددة",
  "Privilege Escalation": "تصعيد صلاحيات",
  "Unusual Data Download": "تنزيل بيانات غير اعتيادي",
  "New Device Login": "تسجيل دخول من جهاز جديد",
  "Malware Detected": "اكتشاف برمجيات خبيثة",
  "Suspicious API Activity": "نشاط API مشبوه",
  "Phishing Email Reported": "بلاغ بريد تصيّد",
};

export const INCIDENT_TYPE_AR: Record<string, string> = {
  Identity: "هوية",
  Authentication: "مصادقة",
  "Privilege Abuse": "إساءة صلاحيات",
  "Data Exfiltration": "تسريب بيانات",
  "Suspicious Login": "دخول مشبوه",
  Malware: "برمجيات خبيثة",
  "API Abuse": "إساءة API",
  Phishing: "تصيّد",
};

export const DEPARTMENT_AR: Record<string, string> = {
  Finance: "المالية",
  Operations: "العمليات",
  IT: "تقنية المعلومات",
  Sales: "المبيعات",
  HR: "الموارد البشرية",
  Engineering: "الهندسة",
  Legal: "القانونية",
  "Security Operations": "عمليات أمنية",
  Credit: "الائتمان",
};

export const ROLE_AR: Record<string, string> = {
  "System Administrator": "مدير نظام",
  "SOC Analyst": "محلل SOC",
  "IT Administrator": "مدير IT",
  Manager: "مدير",
  Staff: "موظف",
  Developer: "مطور",
  DevOps: "DevOps",
  Counsel: "مستشار قانوني",
  Analyst: "محلل",
};

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\u0640/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

export function severityLabels(severity: string): string {
  const s = severity as keyof typeof en.severity;
  return [en.severity[s], ar.severity[s]].filter(Boolean).join(" ");
}

export function statusLabels(status: string): string {
  const s = status as keyof typeof en.status;
  return [en.status[s], ar.status[s]].filter(Boolean).join(" ");
}

export function actionLabels(action: string): string {
  const a = action as keyof typeof en.action;
  return [en.action[a], ar.action[a]].filter(Boolean).join(" ");
}

export function verdictLabels(verdict: string): string {
  const v = verdict as keyof typeof en.verdict;
  return [en.verdict[v], ar.verdict[v]].filter(Boolean).join(" ");
}

export function buildNavSearchItems() {
  const keys = [
    ["nav_dash", "dashboard", "dashboardSub", "/"],
    ["nav_threats", "threats", "threatsSub", "/threats"],
    ["nav_inc", "incidents", "incidentsSub", "/incidents"],
    ["nav_aigov", "aiGovernance", "aiGovernanceSub", "/ai-governance"],
    ["nav_ai", "aiAssistant", "aiAssistantSub", "/ai-assistant"],
    ["nav_users", "users", "usersSub", "/users"],
    ["nav_reports", "reports", "reportsSub", "/reports"],
    ["nav_settings", "settings", "settingsSub", "/settings"],
  ] as const;

  return keys.map(([id, labelKey, subKey, href]) => ({
    id,
    titleEn: en.nav[labelKey],
    titleAr: ar.nav[labelKey],
    subtitleEn: en.nav[subKey],
    subtitleAr: ar.nav[subKey],
    href,
    category: "Pages",
    extra: [en.nav[labelKey], ar.nav[labelKey], en.nav[subKey], ar.nav[subKey]].join(" "),
  }));
}

export function pickLocalized(titleEn: string, titleAr: string, locale: Locale) {
  return locale === "ar" ? titleAr : titleEn;
}
