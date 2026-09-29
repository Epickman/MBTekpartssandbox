const pillars = [
  {
    id: 'precision',
    label: 'PRECISIÓN',
    description: 'Cada pieza dimensionada y verificada para tu vehículo.',
    icon: '◎',
  },
  {
    id: 'resistencia',
    label: 'RESISTENCIA',
    description: 'Materiales seleccionados para condiciones extremas.',
    icon: '⬡',
  },
  {
    id: 'performance',
    label: 'PERFORMANCE',
    description: 'Componentes que maximizan el potencial de tu ATV.',
    icon: '▲',
  },
  {
    id: 'compatibilidad',
    label: 'COMPATIBILIDAD',
    description: 'Verificamos la compatibilidad con tu vehículo antes de recomendar.',
    icon: '◉',
  },
]

export default function WhyMBTEK() {
  return (
    <section
      className="bg-zinc-950 py-20 px-4 border-t border-zinc-900"
      aria-labelledby="why-mbtek-heading"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-3">
            Por qué elegirnos
          </p>
          <h2
            id="why-mbtek-heading"
            className="text-white text-3xl sm:text-5xl font-black tracking-tight uppercase"
          >
            ENGINEERED FOR
          </h2>
          <h2 className="text-[var(--accent)] text-3xl sm:text-5xl font-black tracking-tight uppercase">
            YOUR TERRAIN
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center group hover:border-[var(--accent)]/40 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-[var(--accent)]/15 flex items-center justify-center text-2xl text-zinc-500 group-hover:text-[var(--accent)] mx-auto mb-5 transition-all duration-300"
                aria-hidden="true"
              >
                {p.icon}
              </div>
              <h3 className="text-white font-black text-sm tracking-[0.2em] uppercase mb-3">
                {p.label}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
