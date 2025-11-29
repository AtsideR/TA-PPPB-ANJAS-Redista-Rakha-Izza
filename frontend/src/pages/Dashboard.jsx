import React, { useEffect, useState, useContext } from 'react'
import { getSiteInfo } from '../api' 
import { DataContext } from '../contexts/DataContext'
import './Dashboard.css' 
import logo from "../assets/logo.png";


export default function Dashboard() {
  const [site, setSite] = useState({ name: 'API Anjas' })
  const { anjem, jastip } = useContext(DataContext)

  // --- 1. FUNGSI CEK KEDALUWARSA (HELPER) ---
  const isExpired = (item) => {
    if (!item.created_at || !item.waktu_tunggu) return false // Anggap aktif jika data tidak lengkap

    // Parsing waktu (HH:mm:ss)
    const parts = item.waktu_tunggu.split(':')
    const hours = parseInt(parts[0]) || 0
    const minutes = parseInt(parts[1]) || 0
    const seconds = parseInt(parts[2]) || 0
    
    // Hitung Waktu Habis
    const startDate = new Date(item.created_at)
    const expiryDate = new Date(startDate)
    expiryDate.setHours(startDate.getHours() + hours)
    expiryDate.setMinutes(startDate.getMinutes() + minutes)
    expiryDate.setSeconds(startDate.getSeconds() + seconds)

    // Cek apakah waktu sekarang sudah melewati waktu habis
    return (expiryDate - new Date()) <= 0
  }
  
  // --- 2. FILTER DATA SEBELUM DITAMPILKAN ---
  
  // Ambil 3 data anjem terbaru (Anjem tidak ada timer, jadi langsung slice)
  const anjemLatest = anjem ? anjem.slice(0, 3) : []

  // Ambil 3 data jastip terbaru YANG BELUM EXPIRED
  const jastipLatest = jastip 
    ? jastip.filter(item => !isExpired(item)).slice(0, 3) 
    : []

  useEffect(() => {
    if (typeof getSiteInfo === 'function') {
        getSiteInfo().then((s) => s && setSite(s)).catch(() => {})
    }
  }, [])

  return (
    <div className="dashboard-wrapper">
      {/* HERO SECTION */}
      <div className="card hero-card">
        <div className="hero-content">
            <img 
                src={logo}
                alt="logo"
                className="hero-logo"
                style={{
                    height: "150px",      
                    width: "auto",
                    objectFit: "contain"
                }}
            />

            <div className="hero-text">
                <h1 className="hero-title">{'ANJAS'}</h1>
                <h3 className="hero-subtitle">Antar Jemput & Jasa Titip</h3>
                <p className="muted">Sistem monitoring aktivitas antar jemput dan jasa titip terkini.</p>
            </div>
        </div>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="dashboard-grid">
        
        {/* KOLOM KIRI: Antar Jemput */}
        <div className="card grid-item">
            <div className="card-header">
                <h3>Antar Jemput (Terbaru)</h3>
                <span className="badge">Update</span>
            </div>
            
            {anjemLatest.length > 0 ? (
                <div className="list-container">
                    {anjemLatest.map((item, index) => (
                        <div key={index} className="list-item">
                            <div className="item-head">
                                <strong>{item.nama}</strong>
                                <span className="tag-location">{item.lokasi_jangkauan}</span>
                            </div>
                            <div className="muted item-details">
                                {item.tipe_kendaraan} • {item.hari_siap} • {item.waktu_siap}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="muted empty-state">Tidak ada data antar jemput.</p>
            )}
        </div>

        {/* KOLOM TENGAH: Jasa Titip */}
        <div className="card grid-item">
            <div className="card-header">
                <h3>Jasa Titip (Terbaru)</h3>
                <span className="badge">Baru</span>
            </div>

            {/* Karena sudah difilter di atas, jastipLatest hanya berisi item aktif */}
            {jastipLatest.length > 0 ? (
                <div className="list-container">
                    {jastipLatest.map((item, index) => (
                        <div key={index} className="list-item">
                            <div className="item-head">
                                <strong>{item.nama}</strong>
                                <span className="tag-location">{item.lokasi_jastip}</span>
                            </div>
                            <div className="muted item-details">
                                {/* Opsional: Tambahkan info 'Berakhir dalam...' */}
                                Waktu tunggu: {item.waktu_tunggu}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="muted empty-state">Tidak ada Jastip yang aktif.</p>
            )}
        </div>

        {/* KOLOM KANAN: Sidebar / Info */}
        <aside className="card grid-item sidebar-card">
            <h4>Ringkasan</h4>
            <p className="muted">Halo, Selamat datang kembali!</p>
            <div className="stats-box">
                <div className="stat">
                    <span className="stat-num">{anjem ? anjem.length : 0}</span>
                    <span className="stat-label">Driver Anjem</span>
                </div>
                <div className="stat">
                    {/* Tampilkan jumlah total (jastip aktif saja) */}
                    <span className="stat-num"> 
                        {jastip ? jastip.filter(item => !isExpired(item)).length : 0}
                    </span>
                    <span className="stat-label">Titipan Aktif</span>
                </div>
            </div>
            <p className="muted small-text mt-4">Gunakan tombol tambah di header untuk menambah data.</p>
        </aside>

      </div>
    </div>

  )
}