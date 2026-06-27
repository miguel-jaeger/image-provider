import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NavBar } from './components/layout/NavBar'
import { Footer } from './components/layout/Footer'
import { FAB } from './components/layout/FAB'
import { DashboardHeader } from './components/dashboard/DashboardHeader'
import { CategoryFilters } from './components/dashboard/CategoryFilters'
import { ImageGrid } from './components/dashboard/ImageGrid'
import { Modal } from './components/modal/Modal'
import { ImageUploadForm } from './components/modal/ImageUploadForm'
import { initDatabase, getAllImages, getImagesByCategory, addImage, deleteImage } from './data/db'
import type { Image } from './types/image'
import './App.css'

function Dashboard() {
  const [images, setImages] = useState<Image[]>([])
  const [activeCategory, setActiveCategory] = useState('All Assets')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dbReady, setDbReady] = useState(false)

  const loadImages = useCallback(() => {
    if (!dbReady) return
    if (activeCategory === 'All Assets') {
      setImages(getAllImages())
    } else {
      setImages(getImagesByCategory(activeCategory))
    }
  }, [activeCategory, dbReady])

  useEffect(() => {
    initDatabase().then(() => {
      setDbReady(true)
    })
  }, [])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const handleDelete = (id: number) => {
    deleteImage(id)
    loadImages()
  }

  const handleAddImage = (imageData: {
    title: string
    description: string
    category: string
    url: string
    cdnLink: string
  }) => {
    addImage({
      ...imageData,
      createdAt: new Date().toISOString()
    })
    setIsModalOpen(false)
    loadImages()
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <NavBar onRegisterClick={() => setIsModalOpen(true)} />

      <main className="pt-xxl pb-xxl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto min-h-screen mt-16">
        <DashboardHeader />
        <CategoryFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <ImageGrid
          images={images}
          onDelete={handleDelete}
          onAddNew={() => setIsModalOpen(true)}
        />
      </main>

      <Footer />

      <FAB onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Image"
      >
        <ImageUploadForm
          onSubmit={handleAddImage}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

function Library() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
      <h1 className="text-display-md font-display-md text-on-surface">Library - Coming Soon</h1>
    </div>
  )
}

function Analytics() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
      <h1 className="text-display-md font-display-md text-on-surface">Analytics - Coming Soon</h1>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
