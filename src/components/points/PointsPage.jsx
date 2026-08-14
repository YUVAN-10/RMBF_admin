import { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import PointsHeader from "./PointsHeader";
import PointCategoryCards from "./PointCategoryCards";
import MonthSelector from "./MonthSelector";
import PointsSearch from "./PointsSearch";
import PointsTable from "./PointsTable";
import EditPointsModal from "./EditPointsModal";
import EmptyPointsState from "./EmptyPointsState";
import Pagination from "../rtor/Pagination";
import TermSelector from "../terms/TermSelector";
import { usePoints } from "../../context/PointsContext";
import { useMembers } from "../../context/MembersContext";
import { useTerms } from "../../context/TermsContext";
import { getCurrentMonthId, formatMonthLabel, pointsPercent, MONTHLY_POINT_LIMIT } from "../../utils/pointsMonth";
import { getMonthsInTerm } from "../../utils/termPeriod";
import { POINT_CATEGORIES, getPointCategory } from "../../utils/pointCategory";
import { exportToExcel } from "../../utils/exportExcel";

const EXPORT_COLUMNS = [
  { key: "serialNo", header: "S.No" },
  { key: "memberName", header: "Member" },
  { key: "ridNo", header: "RID No" },
  { key: "monthLabel", header: "Month" },
  { key: "points", header: "Points" },
  { key: "remaining", header: "Remaining" },
  { key: "progress", header: "Progress" },
];

const CATEGORY_EXPORT_COLUMNS = [
  { key: "serialNo", header: "S.No" },
  { key: "memberName", header: "Member Name" },
  { key: "ridNo", header: "RID No" },
  { key: "phone", header: "Phone" },
  { key: "month", header: "Month" },
  { key: "points", header: "Points" },
  { key: "remaining", header: "Remaining Points" },
  { key: "category", header: "Category" },
];

const PAGE_SIZE = 8;

export default function PointsPage() {
  const { members, loading: membersLoading } = useMembers();
  const { monthlyPoints, loading: pointsLoading } = usePoints();
  const { terms, activeTerm, loading: termsLoading } = useTerms();

  const currentMonth = useMemo(() => getCurrentMonthId(), []);
  const [selectedTermNumber, setSelectedTermNumber] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    if (activeTerm && selectedTermNumber === null) {
      setSelectedTermNumber(activeTerm.termNumber);
    }
  }, [activeTerm, selectedTermNumber]);

  const selectedTerm = terms.find((t) => t.termNumber === selectedTermNumber) || activeTerm;

  const monthsInTerm = useMemo(() => getMonthsInTerm(selectedTerm), [selectedTerm]);

  useEffect(() => {
    if (monthsInTerm.length === 0) return;
    if (monthsInTerm.includes(selectedMonth)) return;
    setSelectedMonth(monthsInTerm.includes(currentMonth) ? currentMonth : monthsInTerm[monthsInTerm.length - 1]);
    setPage(1);
  }, [monthsInTerm, selectedMonth, currentMonth]);

  const pointsByMemberUid = useMemo(() => {
    const map = new Map();
    for (const entry of monthlyPoints) {
      if (entry.month === selectedMonth) map.set(entry.memberUid, entry);
    }
    return map;
  }, [monthlyPoints, selectedMonth]);

  const allEntries = useMemo(() => {
    return members.map((member) => {
      const record = pointsByMemberUid.get(member.uid);
      return {
        member,
        points: record?.points ?? 0,
        maxPoints: record?.maxPoints ?? MONTHLY_POINT_LIMIT,
        month: selectedMonth,
      };
    });
  }, [members, pointsByMemberUid, selectedMonth]);

  const hasFilters = search.trim() !== "";

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = allEntries.filter((entry) => {
      if (query === "") return true;
      return (
        entry.member.fullName.toLowerCase().includes(query) ||
        (entry.member.ridNo || "").toLowerCase().includes(query)
      );
    });

    return [...result].sort((a, b) => b.points - a.points);
  }, [allEntries, search]);

  // Categories reflect every member for the selected term+month, independent
  // of the search box — matching how the cards this replaces always counted
  // allEntries rather than the filtered/paginated list.
  const categorizedEntries = useMemo(() => {
    const grouped = { gray: [], red: [], orange: [], green: [] };
    for (const entry of allEntries) {
      const category = getPointCategory(entry.points);
      if (category in grouped) grouped[category].push(entry);
    }
    return grouped;
  }, [allEntries]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const handleExport = () => {
    exportToExcel({
      filename: `points-${selectedMonth}`,
      sheetName: "Points",
      columns: EXPORT_COLUMNS,
      rows: filteredEntries.map((entry, index) => ({
        serialNo: index + 1,
        memberName: entry.member.fullName,
        ridNo: entry.member.ridNo || "",
        monthLabel: formatMonthLabel(entry.month),
        points: entry.points,
        remaining: Math.max(0, entry.maxPoints - entry.points),
        progress: `${pointsPercent(entry.points, entry.maxPoints)}%`,
      })),
    });
  };

  const handleExportCategory = (categoryKey) => {
    const category = POINT_CATEGORIES.find((c) => c.key === categoryKey);
    const entries = categorizedEntries[categoryKey] || [];
    if (!category || entries.length === 0) return;

    exportToExcel({
      filename: `RMBF-Points-${category.label}-Term-${selectedTerm.termNumber}-${formatMonthLabel(selectedMonth).replace(" ", "-")}`,
      sheetName: category.label,
      columns: CATEGORY_EXPORT_COLUMNS,
      rows: entries.map((entry, index) => ({
        serialNo: index + 1,
        memberName: entry.member.fullName,
        ridNo: entry.member.ridNo || "",
        phone: entry.member.phone || "",
        month: formatMonthLabel(selectedMonth),
        points: entry.points,
        remaining: Math.max(0, entry.maxPoints - entry.points),
        category: category.label,
      })),
    });
  };

  const loading = membersLoading || pointsLoading || termsLoading;

  return (
    <div className="space-y-6">
      <PointsHeader />
      <PointCategoryCards categorizedEntries={categorizedEntries} onExport={handleExportCategory} />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <PointsSearch
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
          {terms.length > 0 && (
            <TermSelector
              terms={terms}
              value={selectedTerm?.termNumber}
              onChange={(value) => {
                setSelectedTermNumber(value);
                setPage(1);
              }}
            />
          )}
          <MonthSelector
            months={monthsInTerm}
            value={selectedMonth}
            onChange={(value) => {
              setSelectedMonth(value);
              setPage(1);
            }}
          />
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredEntries.length === 0}
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={15} />
            Export .xlsx
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-text-secondary">Loading points...</div>
      ) : allEntries.length === 0 ? (
        <EmptyPointsState hasFilters={false} onClearFilters={handleClearFilters} />
      ) : filteredEntries.length === 0 ? (
        <EmptyPointsState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <PointsTable
            entries={paginatedEntries}
            startSerialNo={(currentPage - 1) * PAGE_SIZE + 1}
            onEdit={setEditingEntry}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredEntries.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      {editingEntry && (
        <EditPointsModal
          member={editingEntry.member}
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
}
