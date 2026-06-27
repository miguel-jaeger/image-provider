import type { Image } from '../../types/image'

interface ImageCardProps {
  image: Image
  onDelete: (id: number) => void
}

export function ImageCard({ image, onDelete }: ImageCardProps) {
  return (
    <div className="image-card bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image.url}
          alt={image.title}
        />
        <div className="absolute top-md right-md">
          <span className="bg-surface/90 backdrop-blur-sm px-sm py-xs rounded font-label-md text-on-surface shadow-sm">
            {image.category}
          </span>
        </div>
      </div>
      <div className="p-md flex flex-col gap-sm">
        <p className="font-body-sm text-on-surface-variant line-clamp-2">
          {image.description}
        </p>
        <a
          className="font-label-md text-primary flex items-center gap-xs truncate hover:underline"
          href={`https://${image.cdnLink}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
          {image.cdnLink}
        </a>
        <button
          onClick={() => onDelete(image.id)}
          className="delete-btn mt-base w-full py-sm bg-error-container text-on-error-container rounded-lg font-label-md flex items-center justify-center gap-xs hover:bg-error hover:text-on-error transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Delete Asset
        </button>
      </div>
    </div>
  )
}
