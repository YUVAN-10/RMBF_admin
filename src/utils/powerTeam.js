/** Power Teams have no real Firestore ID today (masters.powerTeams is a flat
 * name list) — this derives a stable, machine-safe id from the name so a
 * meeting can record a powerTeamId without inventing a new collection. */
export function slugifyPowerTeamName(name) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
