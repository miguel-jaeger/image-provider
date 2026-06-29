export function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant w-full py-xl mt-xxl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-md px-margin-desktop w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-xs items-center md:items-start">
          <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Image Provider
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant opacity-70">
            &copy; 2024 Image Provider. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-lg items-center">
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all hover:underline" href="#">
            Términos
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all hover:underline" href="#">
            Privacidad
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all hover:underline" href="#">
            Soporte
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all hover:underline" href="#">
            API
          </a>
        </div>
      </div>
    </footer>
  )
}
