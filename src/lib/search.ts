import type { ActivityItem, Incident } from "@/lib/api.types";
import {
  actionLabels,
  buildNavSearchItems,
  COUNTRY_AR,
  DEPARTMENT_AR,
  INCIDENT_TITLE_AR,
  INCIDENT_TYPE_AR,
  normalizeSearchText,
  pickLocalized,
  ROLE_AR,
  severityLabels,
  statusLabels,
  verdictLabels,
} from "@/lib/i18n/searchLabels";
import type { AiGovernanceEvent } from "@/lib/types/aiGovernance";
import type { UserRecord } from "@/lib/types/users";
import type { Locale } from "@/lib/i18n/translations";
import { labelSeverity } from "@/lib/i18n/translations";
import { enrichIncident, titleToType } from "@/lib/utils/incidentMeta";

export type SearchResultItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: string;
};

export function normalizeQuery(q: string) {
  return normalizeSearchText(q);
}

export function queryTokens(query: string): string[] {
  return normalizeQuery(query).split(/\s+/).filter(Boolean);
}

function haystack(...parts: (string | null | undefined)[]) {
  return normalizeSearchText(parts.filter(Boolean).join(" "));
}

export function textMatches(query: string, ...parts: (string | null | undefined)[]) {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  const hay = haystack(...parts);
  return tokens.every((t) => hay.includes(t));
}

export function incidentSearchText(inc: Incident): string {
  const enriched = enrichIncident(inc);
  const type = titleToType[enriched.title] ?? enriched.incident_type ?? enriched.title;
  const assessment = enriched.ai_assessment;
  return [
    enriched.id,
    enriched.display_id,
    enriched.title,
    INCIDENT_TITLE_AR[enriched.title],
    type,
    INCIDENT_TYPE_AR[type],
    enriched.user,
    enriched.source_ip,
    enriched.country,
    COUNTRY_AR[enriched.country],
    enriched.city,
    enriched.severity,
    severityLabels(enriched.severity ?? ""),
    enriched.status,
    statusLabels(enriched.status ?? ""),
    enriched.ai_verdict,
    verdictLabels(enriched.ai_verdict ?? ""),
    enriched.owner,
    enriched.description,
    enriched.department,
    DEPARTMENT_AR[enriched.department ?? ""],
    enriched.role,
    ROLE_AR[enriched.role ?? ""],
    enriched.isp,
    enriched.ai_summary,
    enriched.ai_risk_level,
    String(enriched.ai_risk_score ?? ""),
    assessment?.summary,
    assessment?.interpretation,
    assessment?.analyst_note,
    assessment?.risk_level,
    severityLabels(assessment?.risk_level ?? ""),
    ...(assessment?.recommended_actions ?? []),
    enriched.secure_layer?.label,
    enriched.secure_layer?.ai_safe_preview,
    ...(enriched.secure_layer?.steps?.map((s) => `${s.name} ${s.detail}`) ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

export function activitySearchText(act: ActivityItem): string {
  return [act.id, act.kind, act.message, act.user ?? ""].filter(Boolean).join(" ");
}

export function aiEventSearchText(ev: AiGovernanceEvent): string {
  return [
    ev.id,
    ev.user,
    ev.department,
    DEPARTMENT_AR[ev.department],
    ev.tool,
    ev.action,
    actionLabels(ev.action),
    ev.severity,
    severityLabels(ev.severity),
    ev.data_category,
    ev.prompt_preview,
    ev.policy_id,
    ev.policy_name,
    ev.dlp_rule ?? "",
    ev.status,
    statusLabels(ev.status),
    String(ev.risk_score),
  ].join(" ");
}

export function userSearchText(u: UserRecord): string {
  return [
    u.id,
    u.name,
    u.email,
    u.role,
    ROLE_AR[u.role],
    u.department,
    DEPARTMENT_AR[u.department],
    u.status,
    u.status === "Active" ? "نشط" : "معطل",
    u.lastLogin,
    u.mfa,
    u.mfa === "Enabled" ? "مفعّل" : "معطل",
    u.phone ?? "",
    u.location ?? "",
  ].join(" ");
}

export function buildSearchResults(
  query: string,
  incidents: Incident[],
  activity: ActivityItem[],
  locale: Locale = "en"
): SearchResultItem[] {
  const nq = normalizeQuery(query);
  if (!nq) return [];

  const out: SearchResultItem[] = [];

  for (const item of buildNavSearchItems()) {
    if (!textMatches(nq, item.titleEn, item.titleAr, item.subtitleEn, item.subtitleAr, item.extra)) {
      continue;
    }
    out.push({
      id: item.id,
      title: pickLocalized(item.titleEn, item.titleAr, locale),
      subtitle: pickLocalized(item.subtitleEn, item.subtitleAr, locale),
      href: item.href,
      category: item.category,
    });
  }

  for (const inc of incidents) {
    if (!textMatches(nq, incidentSearchText(inc))) continue;
    const enriched = enrichIncident(inc);
    const title =
      locale === "ar" && INCIDENT_TITLE_AR[enriched.title]
        ? INCIDENT_TITLE_AR[enriched.title]
        : enriched.title;
    out.push({
      id: `inc_${inc.id}`,
      title,
      subtitle: `${labelSeverity(locale, enriched.severity)} · ${enriched.user} · ${enriched.source_ip}`,
      href: "/incidents",
      category: "Incidents",
    });
  }

  for (const act of activity) {
    if (!textMatches(nq, activitySearchText(act))) continue;
    out.push({
      id: `act_${act.id}`,
      title: act.message,
      subtitle: act.kind,
      href: "/threats",
      category: "Activity",
    });
  }

  return out;
}

export function filterIncidents(query: string, incidents: Incident[]) {
  if (!normalizeQuery(query)) return incidents;
  return incidents.filter((inc) => textMatches(query, incidentSearchText(inc)));
}

export function filterActivity(query: string, items: ActivityItem[]) {
  if (!normalizeQuery(query)) return items;
  return items.filter((act) => textMatches(query, activitySearchText(act)));
}

export function filterAiEvents<T extends AiGovernanceEvent>(query: string, events: T[]): T[] {
  if (!normalizeQuery(query)) return events;
  return events.filter((e) => textMatches(query, aiEventSearchText(e)));
}

export function filterReports<T extends { name: string; type: string }>(query: string, items: T[]) {
  if (!normalizeQuery(query)) return items;
  return items.filter((r) => textMatches(query, r.name, r.type));
}

export function filterUsers<T extends UserRecord>(query: string, users: T[]): T[] {
  if (!normalizeQuery(query)) return users;
  return users.filter((u) => textMatches(query, userSearchText(u)));
}
