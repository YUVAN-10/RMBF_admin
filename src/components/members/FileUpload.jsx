export default function FileUpload({ fileName, onChange }) {
  return (
    <div>
      <input
        type="file"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? null)}
        className="block w-full cursor-pointer rounded-lg border border-border bg-bg text-sm text-text-secondary file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-light file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary hover:file:bg-primary hover:file:text-white"
      />
      {fileName && <p className="mt-1.5 truncate text-xs text-text-secondary">Selected: {fileName}</p>}
    </div>
  );
}
