import { useState, useRef, type FormEvent } from 'react'
import axios from 'axios'

interface ImageUploadFormProps {
  onSubmit: (image: {
    title: string
    description: string
    category: string
    url: string
    cdnLink: string
    publicId: string
    deleteToken: string
  }) => void
  onCancel: () => void
}

const categories = ['Nature', 'Technology', 'Architecture', 'People', 'Abstract']

const CLOUD_NAME = 'dhecags26'
const UPLOAD_PRESET = 'preset_react'

export function ImageUploadForm({ onSubmit, onCancel }: ImageUploadFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setStatus('idle')
      setErrorMsg('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || !title || !category) return

    setStatus('uploading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', 'image-provider')

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      )

      if (response.data && response.data.secure_url) {
        const rawUrl: string = response.data.secure_url
        const url = rawUrl.replace(/^(https?:)?\/\//, 'https://')

        onSubmit({
          title,
          description,
          category,
          url,
          cdnLink: url,
          publicId: response.data.public_id || '',
          deleteToken: ''
        })
      } else {
        setStatus('error')
        setErrorMsg('No se recibió URL de Cloudinary.')
      }
    } catch (error) {
      console.error('Error al subir a Cloudinary:', error)
      setStatus('error')
      setErrorMsg('Error al subir la imagen. Verifica tu conexión y configuración de Cloudinary.')
    }
  }

  const isSubmitDisabled = !file || !title || !category || status === 'uploading'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
      <div className="p-xl overflow-y-auto flex-1 flex flex-col gap-lg">
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

        {/* Error message */}
        {status === 'error' && (
          <div className="p-md bg-error-container text-on-error-container rounded-lg text-body-sm">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-xl py-lg bg-surface-container-low/30 border-t border-outline-variant/20 flex justify-end gap-md">
        <button
          type="button"
          onClick={onCancel}
          disabled={status === 'uploading'}
          className="px-lg py-sm rounded-lg text-on-surface font-label-md hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-xs"
        >
          {status === 'uploading' ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              Uploading...
            </>
          ) : (
            'Save Image'
          )}
        </button>
      </div>
    </form>
  )
}
