import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/DataContext';
import { MapPin, Phone, Truck, Clock, Heart } from 'lucide-react';

export default function AnjemList() {
  const { anjem: data, loading, error } = useContext(DataContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  // --- STATE FAVORITE & FILTER ---
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('anjem_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavOnly, setShowFavOnly] = useState(false);

  // --- FUNGSI TOGGLE FAVORITE ---
  const toggleFavorite = (id) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(favId => favId !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem('anjem_favorites', JSON.stringify(newFavs));
  };

  const toWaNumber = (raw) => {
    if (!raw) return ''
    const s = String(raw).trim()
    const onlyDigits = s.replace(/[^+0-9]/g, '')
    if (onlyDigits.startsWith('+')) {
      return onlyDigits.replace(/^\+/, '')
    }
    const digits = onlyDigits.replace(/\D/g, '')
    if (digits.startsWith('0')) return '62' + digits.slice(1)
    return digits
  }

  // --- FILTER DATA ---
  const displayData = showFavOnly 
    ? (data ? data.filter(item => favorites.includes(item.id)) : [])
    : (data || []);

  return (
    <div className="app-shell">
      {/* HEADER ROW */}
      <div className="card header-row" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>Daftar Antar Jemput</h2>
        <button onClick={() => navigate('/add?type=anjem')}>Tambah</button>
      </div>

      <div style={{ marginTop: 12 }} className="card">
        
        {/* --- TOMBOL FAVORITE DENGAN BACKGROUND --- */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 12, marginBottom: 12 }}>
            <button 
                onClick={() => setShowFavOnly(!showFavOnly)}
                style={{
                    // Style Dasar
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.2s',
                    width: 'fit-content',
                    transform: 'none', 

                    // Style Kondisional (Berubah Warna)
                    background: showFavOnly ? '#db2777' : '#f1f5f9', // Pink vs Abu Muda
                    color: showFavOnly ? 'white' : '#475569',       // Putih vs Abu Tua
                    border: 'none',
                    boxShadow: showFavOnly ? '0 4px 12px rgba(219, 39, 119, 0.25)' : 'none'
                }}
            >
                <Heart size={16} fill={showFavOnly ? "white" : "none"} strokeWidth={2.5} />
                {showFavOnly ? "Sedang Menampilkan Favorit" : "Filter: Favorit Saya"}
            </button>
        </div>

        {loading?.anjem && <p className="muted">Memuat...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="list">
          {(!loading?.anjem && displayData.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
                 <p className="muted">
                    {showFavOnly ? "Belum ada driver yang difavoritkan." : "Tidak ada data."}
                </p>
            </div>
          ) : null}

          {/* LIST ITEM */}
          {displayData.map((item) => (
            <div 
                className="list-item" 
                key={item.id} 
                onClick={() => setSelected(item)} 
                role="button" 
                tabIndex={0} 
                onKeyDown={(e) => { if (e.key === 'Enter') setSelected(item) }}
                style={{ position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontWeight: 700 }}>{item.nama}</div>
                      {/* INDIKATOR HEART DI LIST */}
                      {favorites.includes(item.id) && <Heart size={14} fill="#ef4444" color="#ef4444" />}
                  </div>
                  <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <MapPin size={14} /> {item.lokasi_jangkauan}
                  </div>
                </div>
                <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Truck size={14} /> {item.tipe_kendaraan}
                </div>
              </div>
              <div className="muted" style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={14} /> {item.nomor_telepon}
                <Clock size={14} /> {item.waktu_siap}
              </div>
            </div>
          ))}

          {/* MODAL POPUP */}
          {selected && (
            <div className="modal-overlay" onClick={() => setSelected(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ fontWeight: 800 }}>{selected.nama}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      
                      {/* TOMBOL FAVORITE DI POPUP */}
                      <button 
                        onClick={() => toggleFavorite(selected.id)}
                        style={{
                            background: 'white',
                            border: '1px solid #ddd',
                            color: favorites.includes(selected.id) ? '#ef4444' : '#666',
                            padding: '0 10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                         <Heart size={18} fill={favorites.includes(selected.id) ? "#ef4444" : "none"} />
                      </button>

                      {selected.nomor_telepon && (
                        <a href={`https://wa.me/${toWaNumber(selected.nomor_telepon)}`} target="_blank" rel="noreferrer">
                          <button type="button" style={{ background: '#25D366', color: '#042A1F' }}>Chat WA</button>
                        </a>
                      )}
                      <button onClick={() => setSelected(null)}>Tutup</button>
                    </div>
                </div>
                <div className="modal-body">
                  <div style={{ marginBottom: 8 }}><strong>Lokasi jangkauan:</strong> {selected.lokasi_jangkauan}</div>
                  <div style={{ marginBottom: 8 }}><strong>Nomor telepon:</strong> {selected.nomor_telepon}</div>
                  <div style={{ marginBottom: 8 }}><strong>Waktu siap:</strong> {selected.waktu_siap}</div>
                  <div style={{ marginBottom: 8 }}><strong>Tipe kendaraan:</strong> {selected.tipe_kendaraan}</div>
                  <div style={{ marginBottom: 8 }}><strong>Hari siap:</strong> {selected.hari_siap}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}