'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { apiFetch, apiUpload } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    stock: '',
    lowStockThreshold: '5',
    description: ''
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      let finalImageUrl = ''
      
      // Upload image first if selected
      if (imageFile) {
        const uploadRes = await apiUpload('/api/upload', imageFile)
        finalImageUrl = uploadRes.url
      }

      await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          stock: parseInt(formData.stock) || 0,
          lowStockThreshold: parseInt(formData.lowStockThreshold) || 0,
          imageUrl: finalImageUrl
        })
      })
      
      toast.success('Product created successfully')
      router.push('/success?action=add')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product')
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <header className="mb-5">
        <Link href="/inventory" className="d-inline-flex align-items-center gap-2 text-muted text-decoration-none mb-3">
          <ArrowLeft size={16} />
          <span className="small fw-bold">Back to Inventory</span>
        </Link>
        <h1 className="h3 fw-bold mb-1">Add New Product</h1>
        <p className="text-muted small mb-0">Fill in the details to add a new item to your stock.</p>
      </header>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="ims-card p-5"
      >
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <label className="form-label small fw-bold text-dark">Product Name</label>
            <input 
              required
              className="form-control bg-light py-2"
              placeholder="e.g. MacBook Pro M3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-dark">SKU (Stock Keeping Unit)</label>
            <input 
              required
              className="form-control bg-light py-2"
              placeholder="e.g. LAP-001"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-dark">Category</label>
            <select 
              className="form-select bg-light py-2"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Hardware</option>
              <option>Furniture</option>
              <option>Food & Beverage</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-dark">Price ($)</label>
            <input 
              required
              type="number"
              step="0.01"
              className="form-control bg-light py-2"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-dark">Initial Stock Level</label>
            <input 
              required
              type="number"
              className="form-control bg-light py-2"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-dark">Low Stock Threshold</label>
            <input 
              type="number"
              className="form-control bg-light py-2"
              placeholder="5"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold text-dark">Description</label>
          <textarea 
            rows={4}
            className="form-control bg-light py-2 resize-none"
            placeholder="Provide a detailed description of the product..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="mb-5">
          <label className="form-label small fw-bold text-dark">Product Image</label>
          <input 
            type="file"
            id="image-upload"
            className="d-none"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label 
            htmlFor="image-upload"
            className="w-100 border rounded-4 d-flex flex-column align-items-center justify-content-center p-5 text-center position-relative overflow-hidden cursor-pointer shadow-sm"
            style={{ borderStyle: 'dashed !important', backgroundColor: '#f8f9fa', minHeight: '200px', cursor: 'pointer' }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />
            ) : (
              <>
                <div className="bg-white p-3 rounded-3 shadow-sm mb-3 border">
                  <Upload size={24} className="text-muted" />
                </div>
                <p className="fw-bold mb-1">Click to upload product image</p>
                <p className="small text-muted mb-0">PNG, JPG or WebP (max. 5MB)</p>
              </>
            )}
          </label>
          {imagePreview && (
            <button 
              type="button" 
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="btn btn-link btn-sm text-danger text-decoration-none mt-2 fw-bold"
            >
              Remove Image
            </button>
          )}
        </div>

        <div className="d-flex gap-3">
          <Link 
            href="/inventory"
            className="btn btn-light border flex-grow-1 py-3 fw-bold"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isLoading}
            className="btn btn-ims flex-grow-1 py-3 d-flex align-items-center justify-content-center"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Product'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
