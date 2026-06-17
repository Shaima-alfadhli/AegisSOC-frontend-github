"use client";

import type { UserRecord } from "@/lib/types/users";
import { cn } from "@/lib/utils/cn";
import {
  KeyRound,
  MoreVertical,
  ShieldOff,
  User,
} from "lucide-react";
import { useSearch } from "@/components/providers/SearchProvider";
import { useT } from "@/components/providers/LocaleProvider";
import { filterUsers } from "@/lib/search";
import { useMemo, useState } from "react";

const users: UserRecord[] = [];

function UserOverview({ user }: { user: UserRecord }) {
  const { t } = useT();
  const statusLabel =
    user.status === "Active"
      ? t("usersPage.accountActive")
      : t("usersPage.accountDisabled");
  const mfaLabel =
    user.mfa === "Enabled"
      ? t("usersPage.mfaEnabled")
      : t("usersPage.mfaDisabled");

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-2xl aegis-panel p-4 lg:max-w-[360px] md:min-h-[420px] xl:min-h-[520px]">
      <div className="text-sm font-medium text-white">{t("usersPage.userOverview")}</div>
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="grid size-[72px] place-items-center rounded-full border border-white/15 bg-white/10 text-lg font-semibold text-white/80">
          {user.avatarInitials}
        </div>
        <div className="mt-3 font-semibold text-white">{user.name}</div>
        <div className="text-xs text-white/50">{user.email}</div>
      </div>

      <dl className="mt-6 space-y-3 text-xs">
        <div className="flex justify-between gap-2">
          <dt className="text-white/40">{t("usersPage.role")}</dt>
          <dd className="text-white/80">{user.role}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-white/40">{t("usersPage.department")}</dt>
          <dd className="text-white/80">{user.department}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-white/40">{t("common.status")}</dt>
          <dd
            className={
              user.status === "Active" ? "text-emerald-400" : "text-red-300"
            }
          >
            {statusLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-white/40">{t("usersPage.mfa")}</dt>
          <dd
            className={
              user.mfa === "Enabled" ? "text-emerald-400" : "text-amber-300"
            }
          >
            {mfaLabel}
          </dd>
        </div>
        {user.phone ? (
          <div className="flex justify-between gap-2">
            <dt className="text-white/40">{t("usersPage.phone")}</dt>
            <dd className="text-white/80">{user.phone}</dd>
          </div>
        ) : null}
        {user.location ? (
          <div className="flex justify-between gap-2">
            <dt className="text-white/40">{t("usersPage.location")}</dt>
            <dd className="text-white/80">{user.location}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-auto space-y-2 border-t border-white/8 pt-4">
        <div className="text-xs font-medium text-white/45">{t("aiGov.actions")}</div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 py-2 text-xs font-medium text-cyan-100"
        >
          <KeyRound className="size-3.5" />
          {t("usersPage.resetPassword")}
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 py-2 text-xs font-medium text-amber-100"
        >
          <ShieldOff className="size-3.5" />
          {t("usersPage.disableUser")}
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/60"
        >
          <User className="size-3.5" />
          {t("usersPage.viewActivity")}
        </button>
      </div>
    </div>
  );
}

export function UsersWorkspace() {
  const { t, rtl } = useT();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const { query } = useSearch();

  const stats = [
    { key: "usersPage.totalUsers", value: "0" },
    { key: "usersPage.activeUsers", value: "0" },
    { key: "usersPage.disabledUsers", value: "0" },
    { key: "usersPage.adminUsers", value: "0" },
  ];

  const filtered = useMemo(() => {
    let list = filterUsers(query, users);
    return list.filter((u) => {
      if (role !== "All" && u.role !== role) return false;
      if (status !== "All" && u.status !== status) return false;
      return true;
    });
  }, [role, status, query]);

  const selected = filtered.find((u) => u.id === selectedId) ?? filtered[0] ?? null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.key}
            className="rounded-2xl aegis-panel-flat px-4 py-3"
          >
            <div className="text-xs text-white/45">{t(s.key)}</div>
            <div className="mt-1 text-2xl font-semibold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl aegis-panel-flat p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {query.trim() ? (
                <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
                  {t("common.filterPrefix")}: {query}
                </span>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none"
                >
                  <option value="All">{t("usersPage.role")}</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="SOC Analyst">SOC Analyst</option>
                  <option value="Manager">Manager</option>
                </select>
                <select className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none">
                  <option>{t("usersPage.department")}</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white/70 outline-none"
                >
                  <option value="All">{t("common.status")}</option>
                  <option value="Active">{t("usersPage.accountActive")}</option>
                  <option value="Disabled">{t("usersPage.accountDisabled")}</option>
                </select>
              </div>
            </div>

            <div className="mt-3 aegis-table-scroll">
              <table className={cn("w-full min-w-[800px] text-sm", rtl ? "text-right" : "text-left")}>
                <thead>
                  <tr className="border-b border-white/8 text-xs text-white/40">
                    <th className="pb-3 pe-3 font-medium">{t("common.user")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("common.email")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("usersPage.role")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("usersPage.department")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("common.status")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("usersPage.lastLogin")}</th>
                    <th className="pb-3 pe-3 font-medium">{t("usersPage.mfa")}</th>
                    <th className={cn("pb-3 font-medium", rtl ? "text-left" : "text-right")}>
                      {t("aiGov.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-sm text-white/45">
                        {t("common.noData")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => {
                    const active = selected?.id === u.id;
                    return (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedId(u.id)}
                        className={cn(
                          "cursor-pointer border-t border-white/6 align-middle",
                          active ? "bg-cyan-400/10" : "hover:bg-white/[0.03]"
                        )}
                      >
                        <td className="py-3 pe-3">
                          <div className="flex items-center gap-2">
                            <div className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/10 text-[10px] font-semibold text-white/80">
                              {u.avatarInitials}
                            </div>
                            <span className="font-medium text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pe-3 text-white/60">{u.email}</td>
                        <td className="py-3 pe-3 text-white/70">{u.role}</td>
                        <td className="py-3 pe-3 text-white/60">{u.department}</td>
                        <td className="py-3 pe-3">
                          <span
                            className={cn(
                              "text-xs font-medium",
                              u.status === "Active"
                                ? "text-emerald-400"
                                : "text-red-300"
                            )}
                          >
                            {u.status === "Active"
                              ? t("usersPage.accountActive")
                              : t("usersPage.accountDisabled")}
                          </span>
                        </td>
                        <td className="py-3 pe-3 text-white/50">{u.lastLogin}</td>
                        <td className="py-3 pe-3">
                          <span
                            className={cn(
                              "text-xs",
                              u.mfa === "Enabled"
                                ? "text-emerald-400"
                                : "text-amber-300"
                            )}
                          >
                            {u.mfa === "Enabled"
                              ? t("usersPage.mfaEnabled")
                              : t("usersPage.mfaDisabled")}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            className={cn(
                              "grid size-8 place-items-center rounded-lg text-white/40 hover:bg-white/5",
                              rtl ? "float-left" : "float-right"
                            )}
                            aria-label={t("common.more")}
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selected ? (
          <div className="w-full shrink-0 xl:w-[360px]">
            <UserOverview user={selected} />
          </div>
        ) : null}
      </div>
    </>
  );
}
