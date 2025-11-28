// src/models/anjemModel.js
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Jangan crash dengan stack trace Supabase yang sulit dibaca - lempar error tersusun
  console.error("Missing Supabase env. SUPABASE_URL or SUPABASE_KEY not set.");
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

const table = "anjem"; // nama tabel antar jemput

function normalize(result) {
  // pastikan selalu kembali object { data, error }
  if (!result) return { data: null, error: { message: "No response from supabase client" } };
  // supabase-js returns { data, error }
  return { data: result.data ?? null, error: result.error ?? null };
}

module.exports = {
  async getAll() {
    const result = await supabase.from(table).select("*").order("id", { ascending: true });
    return normalize(result);
  },

  async getById(id) {
    const result = await supabase.from(table).select("*").eq("id", id).single();
    return normalize(result);
  },

  async create(data) {
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return { data: null, error: { message: 'No data provided for insert' } };
    }
    const result = await supabase.from(table).insert([data]).select();
    return normalize(result);
  },

  async update(id, data) {
    const result = await supabase.from(table).update(data).eq("id", id).select();
    return normalize(result);
  },

  async remove(id) {
    const result = await supabase.from(table).delete().eq("id", id);
    return normalize(result);
  },
};
