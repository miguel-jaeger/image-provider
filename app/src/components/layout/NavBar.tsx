import { Link } from 'react-router-dom'

interface NavBarProps {
  onRegisterClick: () => void
}

export function NavBar({ onRegisterClick }: NavBarProps) {

 
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 glass-nav shadow-sm">
      <div className="flex justify-between items-center h-16 px-margin-desktop w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-md">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary">
            Image Provider
          </Link>
        </div>

        

        <button
          onClick={onRegisterClick}
          className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-label-md flex items-center gap-xs hover:bg-primary/90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Register New Image
        </button>
      </div>
    </nav>
  )
}
