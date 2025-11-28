import React, { useState, useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { DataContext } from '../contexts/DataContext'
import { ArrowLeft, CheckCircle, Save } from 'lucide-react'

export default function AddItem() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialType = params.get('type') === 'jastip' ? 'jastip' : 'anjem'
  const [type, setType] = useState(initialType)
  const navigate = useNavigate()

  // --- STATE ANJEM ---
  const [nama, setNama] = useState('')
  const [lokasiJangkauan, setLokasiJangkauan] = useState('')
  const [nomorTelepon, setNomorTelepon] = useState('')
  const [waktuSiap, setWaktuSiap] = useState(['pagi'])
  const [tipeKendaraan, setTipeKendaraan] = useState('motor')
  const [hariSiap, setHariSiap] = useState(['senin'])

  // --- STATE JASTIP ---
  const [lokasiJastip, setLokasiJastip] = useState('')
  // Default waktu tunggu 00:00:00 jika Jastip
  const [waktuTunggu, setWaktuTunggu] = useState('00:00:00')
  const [nomorHp, setNomorHp] = useState('')

  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})

  const { addAnjem, addJastip } = useContext(DataContext)

  const validate = () => {
    const e = {}
    if (!nama || nama.trim().length < 2) e.nama = 'Nama minimal 2 karakter'
    
    if (type === 'anjem') {
      if (!lokasiJangkauan) e.lokasiJangkauan = 'Lokasi jangkauan wajib diisi'
      if (!nomorTelepon) e.nomorTelepon = 'Nomor telepon wajib diisi'
      if (!waktuSiap || (Array.isArray(waktuSiap) && waktuSiap.length === 0)) e.waktuSiap = 'Pilih minimal satu waktu siap'
      if (!hariSiap || (Array.isArray(hariSiap) && hariSiap.length === 0)) e.hariSiap = 'Pilih minimal satu hari siap'
    } else {
      if (!lokasiJastip) e.lokasiJastip = 'Lokasi jastip wajib diisi'
      if (!nomorHp) e.nomorHp = 'Nomor HP wajib diisi'
      // Validasi format waktu
      if (!/^(\d{1,2}):(\d{2}):(\d{2})$/.test(waktuTunggu)) {
         // Jika user hanya input HH:mm, kita bantu lengkapi
         if (/^(\d{1,2}):(\d{2})$/.test(waktuTunggu)) {
             setWaktuTunggu(waktuTunggu + ":00")
         } else {
             // e.waktuTunggu = 'Format waktu harus HH:mm:ss'
         }
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')

    try {
      if (type === 'anjem') {
        const payload = {
          nama: nama || 'Anon',
          lokasi_jangkauan: lokasiJangkauan,
          nomor_telepon: nomorTelepon,
          waktu_siap: Array.isArray(waktuSiap) ? waktuSiap.join(',') : String(waktuSiap),
          tipe_kendaraan: tipeKendaraan,
          hari_siap: Array.isArray(hariSiap) ? hariSiap.join(',') : String(hariSiap),
        }
        await addAnjem(payload)
        setStatus({ ok: true, message: 'Antar jemput berhasil ditambahkan.' })
        setTimeout(() => navigate('/anjem'), 1000)
      } else {
        const payload = {
          nama: nama || 'Anon',
          lokasi_jastip: lokasiJastip,
          waktu_tunggu: waktuTunggu.length === 5 ? waktuTunggu + ":00" : waktuTunggu,
          nomor_hp: nomorHp,
        }
        await addJastip(payload)
        setStatus({ ok: true, message: 'Jasa titip berhasil ditambahkan.' })
        setTimeout(() => navigate('/jastip'), 1000)
      }
    } catch (err) {
      setStatus({ ok: false, message: err.message || 'Gagal mengirim data' })
    }
  }

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        paddingTop: '40px', 
        paddingBottom: '100px',
        width: '100%' 
    }}>
      <div className="card" style={{ 
          width: '100%', 
          maxWidth: '600px', // Batasi lebar agar rapi di tengah
          padding: '30px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}>
        
        {/* HEADER FORM */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, borderBottom: '1px solid #f1f5f9', paddingBottom: 15 }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>Tambah Data</h2>
                <p className="muted" style={{ margin: '5px 0 0 0' }}>Lengkapi form di bawah ini</p>
            </div>
            <Link to={type === 'anjem' ? '/anjem' : '/jastip'}>
                <button type="button" style={{ background: '#f8fafc', color: '#64748b', border:'1px solid #e2e8f0', boxShadow:'none' }}>
                    <ArrowLeft size={16} style={{ marginRight: 6 }} /> Kembali
                </button>
            </Link>
        </div>

        <form onSubmit={submit}>
            
            {/* ALERT SUKSES / ERROR */}
            {status && status.ok && (
                <div className="alert alert-success" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={20} /> {status.message}
                </div>
            )}
            {status && status.ok === false && (
                <div className="alert alert-error" style={{ marginBottom: 20 }}>{status.message}</div>
            )}

            {/* PILIH TIPE */}
            <div className="field" style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 600, color: '#475569', marginBottom: 6, display:'block' }}>Tipe Layanan</label>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                        type="button" 
                        onClick={() => setType('anjem')}
                        style={{ 
                            flex: 1, 
                            background: type === 'anjem' ? '#6366f1' : 'white',
                            color: type === 'anjem' ? 'white' : '#64748b',
                            border: type === 'anjem' ? 'none' : '1px solid #cbd5e1',
                            boxShadow: 'none'
                        }}
                    >
                        Antar Jemput
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setType('jastip')}
                        style={{ 
                            flex: 1, 
                            background: type === 'jastip' ? '#6366f1' : 'white',
                            color: type === 'jastip' ? 'white' : '#64748b',
                            border: type === 'jastip' ? 'none' : '1px solid #cbd5e1',
                            boxShadow: 'none'
                        }}
                    >
                        Jasa Titip
                    </button>
                </div>
            </div>

            {/* FORM INPUT VERTIKAL (LEBIH RAPI) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                
                <div className="field">
                    <label>Nama Penyedia</label>
                    <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Lengkap" />
                    {errors.nama && <small style={{ color: '#ef4444' }}>{errors.nama}</small>}
                </div>

                {type === 'anjem' ? (
                <>
                    <div className="field">
                        <label>Nomor WhatsApp</label>
                        <input type="number" value={nomorTelepon} onChange={(e) => setNomorTelepon(e.target.value)} placeholder="0812..." />
                        {errors.nomorTelepon && <small style={{ color: '#ef4444' }}>{errors.nomorTelepon}</small>}
                    </div>

                    <div className="field">
                        <label>Area Jangkauan</label>
                        <input value={lokasiJangkauan} onChange={(e) => setLokasiJangkauan(e.target.value)} placeholder="Contoh: Tembalang, Banyumanik" />
                        {errors.lokasiJangkauan && <small style={{ color: '#ef4444' }}>{errors.lokasiJangkauan}</small>}
                    </div>

                    <div className="field">
                        <label>Jenis Kendaraan</label>
                        <select value={tipeKendaraan} onChange={(e) => setTipeKendaraan(e.target.value)} style={{ width: '100%' }}>
                            <option value="motor">Motor</option>
                            <option value="mobil">Mobil</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Waktu Operasional</label>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 5 }}>
                            {['pagi', 'siang', 'sore', 'malam'].map((w) => (
                                <label key={w} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: '#f1f5f9', padding: '6px 12px', borderRadius: 20 }}>
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(waktuSiap) ? waktuSiap.includes(w) : waktuSiap === w}
                                        onChange={() => {
                                            setWaktuSiap((prev) => (Array.isArray(prev) ? (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]) : [w]))
                                        }}
                                        style={{ width: 'auto' }}
                                    />
                                    <span style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>{w}</span>
                                </label>
                            ))}
                        </div>
                        {errors.waktuSiap && <small style={{ color: '#ef4444' }}>{errors.waktuSiap}</small>}
                    </div>

                    <div className="field">
                        <label>Hari Operasional</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 5 }}>
                            {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map((d) => (
                                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: '#f1f5f9', padding: '6px 12px', borderRadius: 20 }}>
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(hariSiap) ? hariSiap.includes(d) : hariSiap === d}
                                        onChange={() => {
                                            setHariSiap((prev) => (Array.isArray(prev) ? (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]) : [d]))
                                        }}
                                        style={{ width: 'auto' }}
                                    />
                                    <span style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>{d.substring(0,3)}</span>
                                </label>
                            ))}
                        </div>
                        {errors.hariSiap && <small style={{ color: '#ef4444' }}>{errors.hariSiap}</small>}
                    </div>
                </>
                ) : (
                <>
                    <div className="field">
                        <label>Nomor WhatsApp</label>
                        <input type="number" value={nomorHp} onChange={(e) => setNomorHp(e.target.value)} placeholder="0812..." />
                        {errors.nomorHp && <small style={{ color: '#ef4444' }}>{errors.nomorHp}</small>}
                    </div>

                    <div className="field">
                        <label>Lokasi / Toko Tujuan</label>
                        <input value={lokasiJastip} onChange={(e) => setLokasiJastip(e.target.value)} placeholder="Contoh: Mixue Tembalang" />
                        {errors.lokasiJastip && <small style={{ color: '#ef4444' }}>{errors.lokasiJastip}</small>}
                    </div>

                    <div className="field">
                        <label>Waktu Tunggu (Durasi)</label>
                        <input 
                            value={waktuTunggu} 
                            onChange={(e) => setWaktuTunggu(e.target.value)} 
                            placeholder="HH:mm:ss" 
                            style={{ fontFamily: 'monospace', letterSpacing: 1 }}
                        />
                        <small className="muted">Format: Jam:Menit:Detik (Misal: 01:30:00)</small>
                    </div>
                </>
                )}
            </div>

            {/* TOMBOL ACTION */}
            <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        fontSize: '1rem', 
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 
                    }}
                >
                    <Save size={18} />
                    {status === 'loading' ? 'Mengirim Data...' : 'Simpan Data'}
                </button>
            </div>

        </form>
      </div>
    </div>
  )
}