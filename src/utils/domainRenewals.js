// Clamp month-end dates: March 31 starts reminding on February 28 (29 in leap years).
export function expirationReminderStart(day) {
  const expiration = new Date(`${day}T12:00:00Z`);
  if (!Number.isFinite(expiration.getTime())) return "";
  const start = new Date(expiration);
  start.setUTCDate(1);
  start.setUTCMonth(start.getUTCMonth() - 1);
  const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
  start.setUTCDate(Math.min(expiration.getUTCDate(), lastDay));
  return start.toISOString().slice(0, 10);
}

export function domainRenewals(records, today) {
  const midnight = Date.parse(`${today}T00:00:00Z`);
  return records.filter((record) => record.status === "Active client" && record.services?.includes("Website") && record.domainExpiresOn)
    .map((record) => ({ record, days: Math.round((Date.parse(`${record.domainExpiresOn}T00:00:00Z`) - midnight) / 86400000), start: expirationReminderStart(record.domainExpiresOn) }))
    .filter(({ days, start }) => Number.isFinite(days) && start && today >= start)
    .sort((a, b) => a.days - b.days);
}

export function newestAcquiredFirst(a, b) {
  return (b.dateAcquired || "").localeCompare(a.dateAcquired || "")
    || (b.created_at || "").localeCompare(a.created_at || "");
}
