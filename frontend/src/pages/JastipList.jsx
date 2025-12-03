  import React, { useContext, useState, useEffect } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { DataContext } from '../contexts/DataContext'
  import { MapPin, Phone, Clock, Box, Inbox } from 'lucide-react'

  // --- 1. HELPER: FUNGSI CEK KEDALUWARSA (Dipakai Parent & Child) ---
  const checkIsExpired = (item) => {
    if (!item.created_at || !item.waktu_tunggu) return true // Anggap expired jika data rusak
    
    const parts = item.waktu_tunggu.split(':')
    const hours = parseInt(parts[0]) || 0
    const minutes = parseInt(parts[1]) || 0
    const seconds = parseInt(parts[2]) || 0
    
    const startDate = new Date(item.created_at)
    const expiryDate = new Date(startDate)
    
    expiryDate.setHours(startDate.getHours() + hours)
    expiryDate.setMinutes(startDate.getMinutes() + minutes)
    expiryDate.setSeconds(startDate.getSeconds() + seconds)
    
    return (expiryDate - new Date()) <= 0
  }

  // --- 2. KOMPONEN ITEM (LOGIKA TIMER & ANTI-FLASH) ---
  const JastipItem = ({ item, onClick }) => {
    // Hitung ulang target spesifik untuk item ini
    const getExpiryDate = () => {
      const parts = item.waktu_tunggu.split(':')
      const startDate = new Date(item.created_at)
      const expiryDate = new Date(startDate)
      expiryDate.setHours(startDate.getHours() + (parseInt(parts[0])||0))
      expiryDate.setMinutes(startDate.getMinutes() + (parseInt(parts[1])||0))
      expiryDate.setSeconds(startDate.getSeconds() + (parseInt(parts[2])||0))
      return expiryDate
    }

    // State Inisialisasi Lazy (Anti-Flash)
    const [isExpired, setIsExpired] = useState(() => checkIsExpired(item))

    const [timeLeft, setTimeLeft] = useState(() => {
      const expiryDate = getExpiryDate()
      const diff = expiryDate - new Date()
      if (diff <= 0) return "00:00:00"
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / 1000 / 60) % 60)
      const s = Math.floor((diff / 1000) % 60)
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    })

    useEffect(() => {
      if (isExpired) return 

      const expiryDate = getExpiryDate()
      const interval = setInterval(() => {
        const now = new Date()
        const diff = expiryDate - now

        if (diff <= 0) {
          setIsExpired(true)
          clearInterval(interval)
        } else {
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
          const m = Math.floor((diff / 1000 / 60) % 60)
          const s = Math.floor((diff / 1000) % 60)
          setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }, [item, isExpired])

    if (isExpired) return null

    return (
      <div 
        className="list-item" 
        onClick={() => onClick(item)} 
        role="button" 
        tabIndex={0} 
        onKeyDown={(e) => { if (e.key === 'Enter') onClick(item) }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{item.nama}</div>
            <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <MapPin size={14} /> {item.lokasi_jastip}
            </div>
          </div>
          <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#dc2626', fontWeight: 'bold' }}>
            <Box size={14} /> {timeLeft}
          </div>
        </div>
        <div className="muted" style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
          <Clock size={14} /> {new Date(item.created_at).toLocaleString()}
        </div>
      </div>
    )
  }

  // --- 3. KOMPONEN UTAMA ---
  export default function JastipList() {
    const { jastip: data, loading, error } = useContext(DataContext)
    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)

    // FILTER DATA DULU: Hanya ambil yang BELUM expired
    // Ini penting agar kita tahu persis berapa jumlah item yang akan tampil
    const activeData = data ? data.filter(item => !checkIsExpired(item)) : []

    const toWaNumber = (raw) => {
      if (!raw) return ''
      const s = String(raw).trim()
      const onlyDigits = s.replace(/[^+0-9]/g, '')
      if (onlyDigits.startsWith('+')) return onlyDigits.replace(/^\+/, '')
      const digits = onlyDigits.replace(/\D/g, '')
      if (digits.startsWith('0')) return '62' + digits.slice(1)
      return digits
    }

    return (
      <div className="app-shell">
        <div className="card header-row">
          <h2>Daftar Jasa Titip</h2>
          <button onClick={() => navigate('/add?type=jastip')}>Tambah</button>
        </div>

        <div style={{ marginTop: 12 }} className="card">
          {loading?.jastip && (
              <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">
                  Memuat data...
              </div>
          )}
          
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="list">
            {/* LOGIKA EMPTY STATE */}
            {/* Jika tidak loading DAN (data kosong ATAU data aktif kosong) */}
            {!loading?.jastip && (!data || activeData.length === 0) ? (
              <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
              }}>
                  <div style={{ 
                      background: '#f1f5f9', 
                      padding: '20px', 
                      borderRadius: '50%',
                      marginBottom: '8px' 
                  }}>
                      <Inbox size={40} color="#94a3b8" />
                  </div>
                  <h3 style={{ margin: 0, color: '#334155' }}>Belum ada titipan aktif</h3>
                  <p className="muted" style={{ margin: 0, maxWidth: '300px' }}>
                      Saat ini tidak ada jasa titip yang tersedia. Jadilah yang pertama membuatnya!
                  </p>
              </div>
            ) : null}
            
            {/* RENDER DATA AKTIF */}
            {activeData.map((item) => (
              <JastipItem key={item.id} item={item} onClick={setSelected} />
            ))}

            {/* MODAL POPUP */}
            {selected && (
              <div className="modal-overlay" onClick={() => setSelected(null)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <div style={{ fontWeight: 800 }}>{selected.nama}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {selected.nomor_hp && (
                        <a href={`https://wa.me/${toWaNumber(selected.nomor_hp)}`} target="_blank" rel="noreferrer">
                          <button type="button" style={{ background: '#25D366', color: '#042A1F' }}>Chat WA</button>
                        </a>
                      )}
                      <button onClick={() => setSelected(null)}>Tutup</button>
                    </div>
                  </div>
                  <div className="modal-body">
                    <div style={{ marginBottom: 8 }}><strong>Lokasi jastip:</strong> {selected.lokasi_jastip}</div>
                    <div style={{ marginBottom: 8 }}><strong>Waktu tunggu:</strong> {selected.waktu_tunggu}</div>
                    <div style={{ marginTop: 12 }} className="muted">Dibuat: {new Date(selected.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }