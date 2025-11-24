// models/anjemModel.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const table = "anjem"; // nama tabel antar jemput

module.exports = {
  async getAll() {
    return await supabase.from(table).select("*").order("id", { ascending: true });
  },

  async getById(id) {
    return await supabase.from(table).select("*").eq("id", id).single();
  },

  async create(data) {
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return { data: null, error: { message: 'No data provided for insert' } };
    }
    return await supabase.from(table).insert([data]).select();
  },

  async update(id, data) {
    return await supabase.from(table).update(data).eq("id", id).select();
  },

  async remove(id) {
    return await supabase.from(table).delete().eq("id", id);
  },
};
