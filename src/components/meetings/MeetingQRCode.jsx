import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Printer } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { buildQrPayload } from "../../utils/qrToken";

export default function MeetingQRCode({ meeting, caption = "Scan this QR code to mark attendance.", payload }) {
  const wrapperRef = useRef(null);
  const qrValue = payload ?? buildQrPayload(meeting);

  const handleDownload = () => {
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${meeting.meetingName.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    link.click();
  };

  const handlePrint = () => {
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank", "width=420,height=560");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head><title>${meeting.meetingName} - QR Code</title></head>
        <body style="font-family: sans-serif; text-align:center; padding:24px;">
          <h2 style="margin-bottom:4px;">${meeting.meetingName}</h2>
          <p style="color:#64748B; margin:0;">${formatDate(meeting.meetingDate)} &bull; ${formatTime(meeting.meetingTime)}</p>
          <p style="color:#64748B; margin:0 0 16px;">${meeting.place || ""}</p>
          <img src="${dataUrl}" style="width:280px;height:280px;" />
          <p style="margin-top:16px; color:#172033;">Scan this QR code to mark attendance.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="animate-fade-in rounded-xl border border-border bg-bg p-6 text-center">
      <h3 className="text-base font-semibold text-text">{meeting.meetingName}</h3>
      <p className="mt-1 text-sm text-text-secondary">
        {formatDate(meeting.meetingDate)} &bull; {formatTime(meeting.meetingTime)}
      </p>
      {meeting.place && <p className="text-sm text-text-secondary">{meeting.place}</p>}

      <div
        ref={wrapperRef}
        className="mx-auto mt-5 flex w-fit items-center justify-center rounded-xl border border-border bg-card p-4"
      >
        <QRCodeCanvas value={qrValue} size={220} fgColor="#172033" bgColor="#FFFFFF" level="M" />
      </div>

      <p className="mt-4 text-sm text-text-secondary">{caption}</p>

      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
        >
          <Download size={16} />
          Download QR
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
        >
          <Printer size={16} />
          Print QR
        </button>
      </div>
    </div>
  );
}
