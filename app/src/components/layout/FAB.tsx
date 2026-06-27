interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-md right-md w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50 active:scale-95 transition-transform"
    >
      <span className="material-symbols-outlined text-[24px]">add</span>
    </button>
  )
}
