interface CategoryFiltersProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categories = ['Todos', 'Naturaleza', 'Arquitectura', 'Tecnología', 'Personas']

export function CategoryFilters({ activeCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <section className="flex flex-wrap items-center gap-sm mb-xxl">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-lg py-sm rounded-full font-label-md transition-all ${
            activeCategory === category
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/5'
          }`}
        >
          {category}
        </button>
      ))}
     
    </section>
  )
}
