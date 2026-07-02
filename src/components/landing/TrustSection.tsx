export function TrustSection() {
  return (
    <section className="py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
          Empresas que confían en NexusRH
        </p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale font-bold text-slate-400 text-xl">
          {["TechSolutions", "Logística Perú", "Finanzas S.A.", "Retail Innova"].map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
