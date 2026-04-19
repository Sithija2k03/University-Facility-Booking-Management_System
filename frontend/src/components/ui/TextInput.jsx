function TextInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      ) : null}

      <input
        className={`w-full rounded-2xl border bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 ${
          error ? "border-red-500" : "border-slate-700"
        }`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

export default TextInput;