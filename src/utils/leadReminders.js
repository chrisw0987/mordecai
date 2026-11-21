export function localDay(date = new Date()) {
  return date.toLocaleDateString("sv-SE");
}

export function addBusinessDays(day, count) {
  const date = new Date(`${day}T12:00:00Z`);
  while (count > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (![0, 6].includes(date.getUTCDay())) count--;
  }
  return date.toISOString().slice(0, 10);
}

export function suggestedReminder(status, today) {
  const suggestions = {
    "New Lead": ["Review this lead", 2],
    Researching: ["Check research progress", 3],
    Pitching: ["Prepare or deliver pitch", 2],
    "Waiting for Response Back": ["Follow up on your last message", 4],
  };
  const entry = suggestions[status];
  return entry ? { nextAction: entry[0], followUp: addBusinessDays(today, entry[1]) } : { nextAction: "", followUp: "" };
}

export function daysBetween(start, end) {
  return Math.floor((Date.parse(`${end.slice(0, 10)}T00:00:00Z`) - Date.parse(`${start.slice(0, 10)}T00:00:00Z`)) / 86400000);
}

export function reminderGroups(records, today) {
  const active = records.filter((record) => !["Active client", "Rejected"].includes(record.status));
  const scheduled = active.filter((record) => record.followUp).sort((a, b) => a.followUp.localeCompare(b.followUp));
  return [
    ["Overdue", scheduled.filter((record) => record.followUp < today)],
    ["Today", scheduled.filter((record) => record.followUp === today)],
    ["Upcoming", scheduled.filter((record) => record.followUp > today)],
  ];
}
