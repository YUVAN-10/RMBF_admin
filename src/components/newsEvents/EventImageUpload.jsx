import { useRef } from "react";
import { ImagePlus, ImageIcon } from "lucide-react";

export default function EventImageUpload({ image, onChange, error }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div
        className={[
          "flex aspect-video w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border bg-bg",
          error ? "border-danger" : "border-border",
        ].join(" ")}
      >
        {image ? (
          <img src={image} alt="Event preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-secondary">
            <ImageIcon size={28} />
            <span className="text-xs">No image selected</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
      >
        <ImagePlus size={15} />
        {image ? "Replace Image" : "Upload Image"}
      </button>
      <p className="mt-1.5 text-xs text-text-secondary">JPG, JPEG, PNG or WEBP.</p>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
