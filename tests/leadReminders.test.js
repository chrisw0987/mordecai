import test from "node:test";
import assert from "node:assert/strict";
import { addBusinessDays, suggestedReminder, reminderGroups, daysBetween } from "../src/utils/leadReminders.js";

test("business-day suggestions cross weekends and year boundaries", () => {
  assert.equal(addBusinessDays("2026-11-20", 1), "2026-11-23");
  assert.equal(addBusinessDays("2026-12-31", 2), "2027-01-04");
  assert.equal(suggestedReminder("Waiting for Response Back", "2026-11-20").followUp, "2026-11-26");
  assert.equal(suggestedReminder("Rejected", "2026-11-20").followUp, "");
  assert.equal(daysBetween("2026-11-19", "2026-11-20"), 1);
});

test("queue includes overdue leads and excludes rejected, clients and unscheduled leads", () => {
  const rows = [
    { id: 1, status: "New Lead", followUp: "2026-11-19" },
    { id: 2, status: "Researching", followUp: "2026-11-20" },
    { id: 3, status: "Pitching", followUp: "2026-11-23" },
    { id: 4, status: "Rejected", followUp: "2026-11-19" },
    { id: 5, status: "Active client", followUp: "2026-11-19" },
    { id: 6, status: "New Lead", followUp: "" },
  ];
  assert.deepEqual(reminderGroups(rows, "2026-11-20").map(([label, records]) => [label, records.map(r => r.id)]), [["Overdue", [1]], ["Today", [2]], ["Upcoming", [3]]]);
});
