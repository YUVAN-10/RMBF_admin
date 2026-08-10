import { useRef } from "react";
import { Camera } from "lucide-react";
import MemberAvatar from "./MemberAvatar";

export default function ProfileImageUpload({ image, onChange, name }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <MemberAvatar name={name} image={image} size="lg" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-dark"
          aria-label="Upload profile image"
        >
          <Camera size={13} />
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
        >
          {image ? "Replace Image" : "Upload Image"}
        </button>
        <p className="mt-1.5 text-xs text-text-secondary">JPG or PNG, up to 2MB.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
