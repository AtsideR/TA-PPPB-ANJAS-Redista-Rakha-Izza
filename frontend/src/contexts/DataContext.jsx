import React, { createContext, useCallback, useEffect, useState } from 'react'

// --- 1. SETTING URL BACKEND (HARDCODE) ---
// Gunakan URL Backend asli.
// .replace(/\/$/, '') gunanya untuk membuang tanda miring (slash) di akhir jika tidak sengaja tertulis.
const API_BASE = 'https://api-anjas.vercel.app'.replace(/\/$/, '');

export const DataContext = createContext({})

// --- HELPER CACHE ---
const ANJEM_KEY = 'anjem_cache_v1'
const JASTIP_KEY = 'jastip_cache_v1'
const SITE_KEY = 'site_cache_v1'

function readCache(k) {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

export function DataProvider({ children }) {
  const [anjem, setAnjem] = useState(() => readCache(ANJEM_KEY) || [])
  const [jastip, setJastip] = useState(() => readCache(JASTIP_KEY) || [])
  const [site, setSite] = useState(() => readCache(SITE_KEY) || { title: 'Project-Anjas' })
  
  const [loading, setLoading] = useState({ anjem: false, jastip: false })
  const [error, setError] = useState(null)

  // --- FUNGSI FETCH (GET) ---
  const fetchAnjem = useCallback(async () => {
    setLoading(prev => ({ ...prev, anjem: true }))
    try {
      // Fetch ke: https://api-anjas.vercel.app/api/anjem
      const res = await fetch(`${API_BASE}/api/anjem`, { mode: 'cors' }) 
      
      if (!res.ok) throw new Error(`Gagal ambil data Anjem (${res.status})`)
      
      const json = await res.json()
      const data = json.data || json
      
      if (Array.isArray(data)) {
        setAnjem(data)
        writeCache(ANJEM_KEY, data)
      }
    } catch (e) {
      console.error("Error GET Anjem:", e)
      setError(e.message)
    } finally {
      setLoading(prev => ({ ...prev, anjem: false }))
    }
  }, [])

  const fetchJastip = useCallback(async () => {
    setLoading(prev => ({ ...prev, jastip: true }))
    try {
      // Fetch ke: https://api-anjas.vercel.app/api/jastip
      const res = await fetch(`${API_BASE}/api/jastip`, { mode: 'cors' })
      
      if (!res.ok) throw new Error(`Gagal ambil data Jastip (${res.status})`)

      const json = await res.json()
      const data = json.data || json

      if (Array.isArray(data)) {
        setJastip(data)
        writeCache(JASTIP_KEY, data)
      }
    } catch (e) {
      console.error("Error GET Jastip:", e)
      setError(e.message)
    } finally {
      setLoading(prev => ({ ...prev, jastip: false }))
    }
  }, [])

  const fetchSite = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/site-info`, { mode: 'cors' })
      if (res.ok) {
        const s = await res.json()
        if (s) { setSite(s); writeCache(SITE_KEY, s) }
      }
    } catch (e) {}
  }, [])

  useEffect(() => {
    fetchSite()
    fetchAnjem() 
    fetchJastip()
  }, [fetchAnjem, fetchJastip, fetchSite])

  // --- FUNGSI TAMBAH (POST) ---
  const addAnjem = useCallback(async (payload) => {
    // POST ke: https://api-anjas.vercel.app/api/anjem
    const res = await fetch(`${API_BASE}/api/anjem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors'
    })
    
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gagal POST Anjem: ${res.status} - ${errText}`);
    }

    const json = await res.json()
    const resData = json.data || json || {}
    
    // Update state lokal
    const newItem = { ...payload, id: resData.id || Date.now(), created_at: new Date().toISOString() }
    setAnjem(prev => { 
        const next = [newItem, ...prev]; 
        writeCache(ANJEM_KEY, next); 
        return next 
    })
    return newItem
  }, [])

  const addJastip = useCallback(async (payload) => {
    // POST ke: https://api-anjas.vercel.app/api/jastip
    const res = await fetch(`${API_BASE}/api/jastip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors'
    })

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gagal POST Jastip: ${res.status} - ${errText}`);
    }

    const json = await res.json()
    const resData = json.data || json || {}

    const newItem = { ...payload, id: resData.id || Date.now(), created_at: new Date().toISOString() }
    setJastip(prev => { 
        const next = [newItem, ...prev]; 
        writeCache(JASTIP_KEY, next); 
        return next 
    })
    return newItem
  }, [])

  const value = {
    anjem, jastip, site, loading, error,
    refreshAnjem: fetchAnjem,
    refreshJastip: fetchJastip,
    refreshSite: fetchSite,
    addAnjem, addJastip,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export default DataContext