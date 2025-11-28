// Minimal API helper for Project-Anjas
const BASE_URL = import.meta.env.VITE_API_URL;

async function safeFetch(url, opts = {}) {
  const res = await fetch(url, opts)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`${res.status} ${res.statusText}${text ? ' - ' + text : ''}`)
    err.status = res.status
    throw err
  }
  try {
    return await res.json()
  } catch {
    return null
  }
}

export async function getSiteInfo() {
  try {
    return await safeFetch(BASE + '/')
  } catch {
    return { title: 'Project-Anjas', tagline: 'Antar Jemput & Jasa Titip' }
  }
}

export async function getAnjem() {
  return safeFetch(BASE + '/api/anjem')
}

export async function getJastip() {
  return safeFetch(BASE + '/api/jastip')
}

export async function postAnjem(payload) {
  return safeFetch(BASE + '/api/anjem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function postJastip(payload) {
  return safeFetch(BASE + '/api/jastip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export default { getSiteInfo, getAnjem, getJastip, postAnjem, postJastip }
