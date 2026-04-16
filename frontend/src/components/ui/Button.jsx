function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const styles = {
    primary:
      "bg-orange-500 text-white hover:bg-orange-600 shadow-[0_8px_20px_rgba(249,115,22,0.25)]",
    secondary:
      "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
    ghost:
      "bg-transparent text-slate-300 hover:bg-slate-800/80 border border-slate-700",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-[0_8px_20px_rgba(239,68,68,0.2)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;