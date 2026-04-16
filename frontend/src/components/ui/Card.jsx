function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;