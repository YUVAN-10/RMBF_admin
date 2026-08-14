import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { subscribeToPointTransactions } from "../../services/pointsService";
import { formatDate } from "../../utils/formatDate";

function formatActivityType(activityType) {
  if (!activityType) return "Activity";
  return activityType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PointTransactionHistory({ memberUid, month }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPointTransactions(memberUid, month, (items) => {
      setTransactions(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [memberUid, month]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 border-b border-border p-5">
        <History size={16} className="text-primary" />
        <h2 className="text-sm font-semibold text-secondary">Point Transaction History</h2>
      </div>

      {loading ? (
        <div className="p-6 text-center text-sm text-text-secondary">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="p-6 text-center text-sm text-text-secondary">No point transactions for this month yet.</div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Activity</th>
                <th className="px-4 py-3 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-border transition-colors last:border-0 hover:bg-bg">
                  <td className="px-4 py-3 text-text-secondary">{formatDate(txn.createdAt)}</td>
                  <td className="px-4 py-3 text-text">{formatActivityType(txn.activityType)}</td>
                  <td className="px-4 py-3 font-medium text-success">+{txn.points.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
