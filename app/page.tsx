'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Boxes, Shield, Zap, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src="/logo.png" alt="4G-IMS Logo" className="ims-logo" />
            <span className="fw-bold fs-4 text-ims-primary">4G-IMS</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link href="/login" className="nav-link fw-bold text-ims-primary me-3">Sign In</Link>
            <Link href="/signup" className="btn btn-ims">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-5 text-center bg-white border-bottom">
          <div className="container py-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-lg-8 mx-auto"
            >
              <div className="badge rounded-pill bg-light text-ims-primary border mb-4 py-2 px-3 fw-bold text-uppercase tracking-wider">
                Enterprise Inventory System
              </div>
              <h1 className="display-4 fw-bold text-dark mb-4">
                Manage your stock with <br />
                <span className="text-ims-primary">Absolute Precision.</span>
              </h1>
              <p className="lead text-muted mb-5">
                Real-time inventory tracking, team collaboration, and global logistics management in one professional platform.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link href="/signup" className="btn btn-ims btn-lg px-5 py-3 shadow">
                  Start Free Trial <ArrowRight className="ms-2" size={20} />
                </Link>
                <Link href="/login" className="btn btn-outline-dark btn-lg px-5 py-3">
                  Watch Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-5 bg-light" id="features">
          <div className="container py-5">
            <div className="row g-4">
              {[
                { title: 'Real-time Sync', icon: Zap, desc: 'Instant updates across all devices with our secure cloud architecture.' },
                { title: 'Team Security', icon: Shield, desc: 'Granular permissions for Admins and Staff to ensure data integrity.' },
                { title: 'Smart Analytics', icon: BarChart3, desc: 'Deep insights into your inventory performance and restocking needs.' },
              ].map((f, i) => (
                <div key={i} className="col-md-4">
                  <div className="ims-card p-5 h-100 transition-all">
                    <div className="bg-light text-ims-primary rounded-3 d-inline-flex p-3 mb-4 border">
                      <f.icon size={28} />
                    </div>
                    <h3 className="h4 fw-bold mb-3">{f.title}</h3>
                    <p className="text-muted mb-0">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-5 bg-white border-top" id="pricing">
          <div className="container py-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold">SaaS Plans</h2>
              <p className="text-muted">Scalable solutions for every business size.</p>
            </div>
            <div className="row g-4 justify-content-center">
              {[
                { name: 'Starter', price: '$0', features: ['Up to 100 Products', 'Single User', 'Basic Logs'] },
                { name: 'Professional', price: '$29', features: ['Unlimited Products', 'Unlimited Staff', 'Smart Analytics'], popular: true },
                { name: 'Enterprise', price: 'Custom', features: ['SLA Support', 'Custom Branding', 'API Access'] },
              ].map((plan, i) => (
                <div key={i} className="col-md-4">
                  <div className={`ims-card p-5 h-100 ${plan.popular ? 'border-ims-primary border-2 shadow-lg' : ''}`}>
                    <h3 className="h5 fw-bold mb-4">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="display-5 fw-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-muted">/mo</span>}
                    </div>
                    <ul className="list-unstyled mb-5 flex-grow-1">
                      {plan.features.map((feat, j) => (
                        <li key={j} className="mb-3 d-flex align-items-center gap-2">
                          <CheckCircle2 className="text-success" size={18} />
                          <span className="text-muted small fw-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className={`btn w-100 py-3 fw-bold ${plan.popular ? 'btn-ims' : 'btn-light'}`}>
                      Choose {plan.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-5 bg-light border-top">
          <div className="container text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
              <img src="/logo.png" alt="4G-IMS Logo" className="ims-logo" />
              <span className="h4 fw-bold text-ims-primary mb-0">4G-IMS</span>
            </div>
            <p className="text-muted small mb-0">&copy; 2026 4G-IMS. Precise Inventory Intelligence.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}