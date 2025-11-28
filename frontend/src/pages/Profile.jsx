import React from 'react'
import rakaFoto from '../assets/raka.png' // Pastikan path ini benar

export default function Profile() {
  return (
    <div className="app-shell">
      {/* HEADER: Tetap Rata Tengah (sesuai request sebelumnya) */}
      <div className="card header-row" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h2>Profil</h2>
          <div className="muted">Informasi anggota dan deskripsi singkat proyek</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="page-grid">
        <div>
          
          {/* KARTU ANGGOTA: Dibuat Rata Kiri */}
          <div className="card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px', 
              textAlign: 'left' // KUNCI: Memastikan teks rata kiri
          }}>
            {/* Foto Profil (Tidak akan mengecil/gepeng) */}
            <img 
              src={rakaFoto} 
              alt="Profile" 
              style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '3px solid #eef2ff' 
              }} 
            />
            
            {/* Bagian Teks */}
            <div style={{ width: '100%' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#1e293b' }}>Anggota</h3>
              <div style={{ display: 'grid', gap: 6, fontSize: '0.95rem' }}>
                <div>
                    <span className="muted" style={{ width: '80px', display: 'inline-block' }}>Nama:</span> 
                    <strong>Redista Rakha Izza</strong>
                </div>
                <div>
                    <span className="muted" style={{ width: '80px', display: 'inline-block' }}>NIM:</span> 
                    <span>21120123130085</span>
                </div>
                <div>
                    <span className="muted" style={{ width: '80px', display: 'inline-block' }}>Kelompok:</span> 
                    <span>23</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }} className="card">
            <h3>Tentang Proyek</h3>
            <p className="muted">
              Proyek ini adalah antarmuka frontend sederhana yang terhubung ke API publik
              <code> https://api-anjas.vercel.app</code>. Fitur utama:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#475569' }}>
              <li style={{ marginBottom: 4 }}>Dashboard menampilkan entri terbaru untuk antar jemput dan jasa titip.</li>
              <li style={{ marginBottom: 4 }}>Halaman daftar lengkap dan form untuk menambah data.</li>
              <li>Tata letak modern, responsif, dan mudah dikembangkan.</li>
            </ul>
          </div>
        </div>

        <aside className="sidebar">
          <div className="card">
            <h4>Catatan</h4>
            <p className="muted">Projek ini merupakan projek tugas akhir dari mata kuliah praktikum pemrograman perangkat bergerak.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}