import { useState, useRef, type FormEvent } from 'react'

interface ImageUploadFormProps {
  onSubmit: (image: {
    title: string
    description: string
    category: string
    url: string
    cdnLink: string
  }) => void
  onCancel: () => void
}

const categories = ['Nature', 'Technology', 'Architecture', 'People', 'Abstract']

export function ImageUploadForm({ onSubmit, onCancel }: ImageUploadFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title || !category) return

    onSubmit({
      title,
      description,
      category,
      url: preview || 'https://via.placeholder.com/400x300',
      cdnLink: `cdn.imageprovider.com/custom/${title.toLowerCase().replace(/\s+/g, '_')}`
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
      <div className="p-xl overflow-y-auto flex-1 space-y-lg">
        {/* Image Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group border-2 border-dashed border-outline-variant rounded-xl p-xxl text-center hover:border-primary transition-colors cursor-pointer bg-surface-container-low/50"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-cover"
            />
          ) : (
            <>
              <span className="material-symbols-outlined text-primary text-[48px] mb-sm">
                cloud_upload
              </span>
              <div className="font-headline-sm text-headline-sm mb-xs">
                Choose File
              </div>
              <p className="text-on-surface-variant text-body-sm">
                High-resolution JPG, PNG or TIFF up to 25MB
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Title Field */}
        <div>
          <label className="block text-on-surface font-label-md mb-xs">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-body-md text-on-surface"
            placeholder="e.g. Minimalist Urban Architecture"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-on-surface font-label-md mb-xs">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-body-md text-on-surface"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-on-surface font-label-md mb-xs">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-body-md text-on-surface resize-none"
            placeholder="Provide a detailed description of the image content and lighting..."
            rows={4}
          />
        </div>
      </div>

      {/* Modal Footer */}
      <div className="px-xl py-lg bg-surface-container-low/30 border-t border-outline-variant/20 flex justify-end gap-md">
        <button
          type="button"
          onClick={onCancel}
          className="px-lg py-sm rounded-lg text-on-surface font-label-md hover:bg-surface-container-high transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          Save Image
        </button>
      </div>
    </form>
  )
}
