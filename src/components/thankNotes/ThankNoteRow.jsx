import { formatCurrency } from "../../utils/formatCurrency";

export default function ThankNoteRow({ note, serialNo, onView }) {
  return (
    <tr className="border-b border-border transition-colors last:border-0 hover:bg-bg">
      <td className="px-4 py-3 text-text-secondary">{serialNo}</td>
      <td className="px-4 py-3 text-text">{note.fromName}</td>
      <td className="px-4 py-3 text-text">{note.toName}</td>
      <td className="px-4 py-3 font-medium text-success">{formatCurrency(note.value)}</td>
    </tr>
  );
}
