import { useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import RToRRow from "./RToRRow";
import MemberMiniProfile from "./MemberMiniProfile";

export default function RToRTable({ records, startSerialNo, getMember }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">From Member</th>
              <th className="px-4 py-3 font-medium">To Member</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <RToRRow key={record.id} record={record} serialNo={startSerialNo + index} getMember={getMember} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {records.map((record) => {
          const fromMember = getMember(record.fromUserId);
          const toMember = getMember(record.toUserId);
          return (
            <div
              key={record.id}
              onClick={() => navigate(`/r-to-r/${record.id}`)}
              className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-bg"
            >
              <div className="flex flex-col items-center gap-1.5">
                <MemberMiniProfile
                  name={record.fromName}
                  ridNo={fromMember?.ridNo}
                  image={fromMember?.profileImage}
                  layout="column"
                  size="md"
                />
                <ArrowDown size={16} className="text-border" />
                <MemberMiniProfile
                  name={record.toName}
                  ridNo={toMember?.ridNo}
                  image={toMember?.profileImage}
                  layout="column"
                  size="md"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
