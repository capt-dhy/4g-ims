'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  Loader2,
  X,
  Upload
} from 'lucide-react'
import { apiFetch, apiUpload, getUser } from '@/lib/api'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  lowStockThreshold: number
  description?: string
  imageUrl?: string
  createdAt: string
}

export default function InventoryPage() {
  return (
    <React.Suspense fallback={
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Loader2 className="animate-spin text-ims-primary" size={40} />
      </div>
    }>
      <InventoryContent />
    </React.Suspense>
  )
}

function InventoryContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [userRole, setUserRole] = useState('staff')
  const searchParams = useSearchParams()

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state (using strings for inputs to avoid NaN issues)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    stock: '',
    lowStockThreshold: '5',
    description: '',
    imageUrl: ''
  })

  useEffect(() => {
    fetchProducts()
    const user = getUser()
    if (user) setUserRole(user.role)
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const companyCode = searchParams.get('companyCode')
      const path = companyCode ? `/api/products?companyCode=${companyCode}` : '/api/products'
      const data = await apiFetch(path)
      setProducts(data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load inventory')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleOpenModal = (product: Product | null = null) => {
    setImageFile(null)
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        description: product.description || '',
        imageUrl: product.imageUrl || ''
      })
      setImagePreview(product.imageUrl || null)
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        sku: '',
        category: 'Electronics',
        price: '',
        stock: '',
        lowStockThreshold: '5',
        description: '',
        imageUrl: ''
      })
      setImagePreview(null)
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let finalImageUrl = formData.imageUrl

      // Handle image upload if a new file is selected
      if (imageFile) {
        const uploadRes = await apiUpload('/api/upload', imageFile)
        finalImageUrl = uploadRes.url
      }

      const body = { 
        ...formData, 
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 0,
        imageUrl: finalImageUrl 
      }

      if (editingProduct) {
        await apiFetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(body)
        })
        toast.success('Product updated successfully')
      } else {
        await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(body)
        })
        toast.success('Product added to inventory')
      }
      setShowModal(false)
      fetchProducts()
    } catch (error: any) {
      toast.error(error.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name} permanently?`)) return
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' })
      toast.success('Product removed')
      setProducts(products.filter(p => p._id !== id))
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete')
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-5">
      <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Inventory Management</h1>
          <p className="text-muted small mb-0">Track stock levels, SKUs, and pricing across your company.</p>
        </div>
        {(userRole === 'admin' || userRole === 'superadmin') && (
          <button 
            onClick={() => handleOpenModal()}
            className="btn btn-ims d-flex align-items-center gap-2 shadow-sm px-4 py-2"
          >
            <Plus size={20} />
            <span className="fw-bold">Add Product</span>
          </button>
        )}
      </header>

      {/* Toolbar */}
      <div className="ims-card p-3 mb-4 bg-light border-0 shadow-sm">
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input 
                type="text" 
                placeholder="Search products or SKUs..." 
                className="form-control border-start-0 py-2 shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-8 d-flex justify-content-md-end gap-2">
            <button className="btn btn-white border d-flex align-items-center gap-2 small fw-bold">
              <Filter size={16} />
              Filter
            </button>
            <button className="btn btn-white border d-flex align-items-center gap-2 small fw-bold">
              <Upload size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ims-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0">Product Info</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0">SKU</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0">Price</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0 text-center">Stock</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-5 text-center">
                    <Loader2 size={32} className="animate-spin text-ims-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-5 text-center text-muted">
                    <Package size={40} className="mb-3 opacity-25" />
                    <p className="mb-0">No products found in your inventory.</p>
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-3 d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: '48px', height: '48px' }}>
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <Package size={20} className="text-muted" />
                        )}
                      </div>
                      <div>
                        <p className="fw-bold mb-0 text-dark">{product.name}</p>
                        <p className="small text-muted mb-0">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted font-monospace small">{product.sku}</td>
                  <td className="px-4 py-3 fw-bold">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex flex-column align-items-center">
                      <span className={`badge rounded-pill px-3 py-2 ${
                        product.stock <= product.lowStockThreshold 
                          ? 'bg-danger text-white' 
                          : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
                      }`} style={{ minWidth: '60px' }}>
                        {product.stock}
                      </span>
                      {product.stock <= product.lowStockThreshold && (
                        <span className="text-danger mt-1" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                          LOW STOCK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    {(userRole === 'admin' || userRole === 'superadmin') ? (
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="btn btn-sm btn-outline-primary border-0"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id, product.name)}
                          className="btn btn-sm btn-outline-danger border-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-muted small">Read Only</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="ims-card shadow-lg" 
              style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                <h2 className="h5 fw-bold mb-0">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className="btn btn-light btn-sm border-0">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label small fw-bold">Product Name</label>
                    <input 
                      type="text" 
                      className="form-control py-2 shadow-none" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">SKU</label>
                    <input 
                      type="text" 
                      className="form-control py-2 shadow-none font-monospace" 
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Category</label>
                    <select 
                      className="form-select py-2 shadow-none"
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
                    <label className="form-label small fw-bold">Unit Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-control py-2 shadow-none" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Opening Stock</label>
                    <input 
                      type="number" 
                      className="form-control py-2 shadow-none" 
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Low Stock Threshold</label>
                    <input 
                      type="number" 
                      className="form-control py-2 shadow-none" 
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Product Description</label>
                    <textarea 
                      className="form-control shadow-none" 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  
                  {/* Image Upload Area */}
                  <div className="col-12">
                    <label className="form-label small fw-bold">Product Image</label>
                    <input 
                      type="file"
                      id="modal-image-upload"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="modal-image-upload"
                      className="w-100 border rounded-3 d-flex flex-column align-items-center justify-content-center p-4 text-center position-relative overflow-hidden cursor-pointer bg-light"
                      style={{ borderStyle: 'dashed !important', minHeight: '160px' }}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />
                      ) : (
                        <>
                          <Upload size={24} className="text-muted mb-2" />
                          <p className="small fw-bold mb-1">Click or drag to upload image</p>
                          <p className="text-muted" style={{ fontSize: '10px' }}>PNG, JPG or WebP (max. 5MB)</p>
                        </>
                      )}
                    </label>
                    {imagePreview && (
                      <button 
                        type="button" 
                        onClick={() => { setImageFile(null); setImagePreview(null); setFormData({...formData, imageUrl: ''}); }}
                        className="btn btn-link btn-sm text-danger text-decoration-none mt-1 fw-bold p-0"
                        style={{ fontSize: '11px' }}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4 pt-3 border-top">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-light border fw-bold flex-grow-1 py-2">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-ims fw-bold flex-grow-1 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2">
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : (editingProduct ? 'Update Product' : 'Save Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
