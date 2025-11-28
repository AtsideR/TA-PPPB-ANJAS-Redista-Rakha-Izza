// controllers/anjemController.js
const Anjem = require("../models/anjemModel");

module.exports = {
  async getAll(req, res) {
    const { data, error } = await Anjem.getAll();
    if (error) return res.status(400).json({ error });
    res.json(data);
  },

  async getOne(req, res) {
    const { id } = req.params;
    const { data, error } = await Anjem.getById(id);
    if (error) return res.status(404).json({ error });
    res.json(data);
  },

  async create(req, res) {
    console.log('POST /api/anjem - headers:', req.headers);
    console.log('POST /api/anjem - raw body:', req.body);

    const payload = req.body;
    if (!payload || (typeof payload === 'object' && Object.keys(payload).length === 0)) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { data, error } = await Anjem.create(payload);
    if (error) return res.status(400).json({ error });
    res.status(201).json(data);
  },

  async update(req, res) {
    const { id } = req.params;
    const payload = req.body;
    if (!payload || (typeof payload === 'object' && Object.keys(payload).length === 0)) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { data, error } = await Anjem.update(id, payload);
    if (error) return res.status(400).json({ error });
    res.json(data);
  },

  async remove(req, res) {
    const { id } = req.params;
    const { error } = await Anjem.remove(id);
    if (error) return res.status(400).json({ error });
    res.json({ message: "Data antar jemput berhasil dihapus" });
  },
};
