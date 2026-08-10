import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MemberMiniProfile from "./MemberMiniProfile";

export default function RToRRow({ record, serialNo, getMember }) {
  const navigate = useNavigate();
  const fromMember = getMember(record.fromUserId);
  const toMember = getMember(record.toUserId);

  return (
    <tr
      onClick={() => navigate(`/r-to-r/${record.id}`)}
      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-bg"
    >
      <td className="px-4 py-3 text-text-secondary">{serialNo}</td>
      <td className="px-4 py-3">
        <MemberMiniProfile name={record.fromName} ridNo={fromMember?.ridNo} image={fromMember?.profileImage} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <ArrowRight size={14} className="shrink-0 text-border" />
          <MemberMiniProfile name={record.toName} ridNo={toMember?.ridNo} image={toMember?.profileImage} />
        </div>
      </td>
    </tr>
  );
}
