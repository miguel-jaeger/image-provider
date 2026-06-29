interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-lg">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface-container-high rounded-2xl shadow-xl w-full max-w-sm p-xl flex flex-col gap-lg z-10">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-error text-[28px]">warning</span>
          <h2 className="font-headline-sm text-on-surface">{title}</h2>
        </div>
        <p className="font-body-md text-on-surface-variant">{message}</p>
        <div className="flex justify-end gap-md mt-sm">
          <button
            onClick={onCancel}
            className="px-lg py-sm rounded-lg text-on-surface font-label-md hover:bg-surface-container-highest transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-lg py-sm rounded-lg bg-error text-on-error font-label-md hover:shadow-lg hover:shadow-error/20 transition-all active:scale-95"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
