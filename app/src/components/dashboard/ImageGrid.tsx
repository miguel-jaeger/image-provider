import type { Image } from '../../types/image'
import { ImageCard } from './ImageCard'

interface ImageGridProps {
  images: Image[]
  onDelete: (id: number) => void
}

export function ImageGrid({ images, onDelete }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onDelete={onDelete} />
      ))}
     
    </div>
  )
}
