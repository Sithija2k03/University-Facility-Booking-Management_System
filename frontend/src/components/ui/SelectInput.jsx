function SelectInput({ label, name, value, onChange, options = [] }) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      ) : null}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;