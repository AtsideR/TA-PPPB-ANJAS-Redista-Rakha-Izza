// controllers/jastipController.js
const Jastip = require("../models/jastipModel");

module.exports = {
  async getAll(req, res) {
    const { data, error } = await Jastip.getAll();
    if (error) return res.status(400).json({ error });
    res.json(data);
  },

  async getOne(req, res) {
    const { id } = req.params;
    const { data, error } = await Jastip.getById(id);
    if (error) return res.status(404).json({ error });
    res.json(data);
  },

  async create(req, res) {
    console.log('POST /api/jastip - headers:', req.headers);
    console.log('POST /api/jastip - raw body:', req.body);

    const payload = req.body;
    if (!payload || (typeof payload === 'object' && Object.keys(payload).length === 0)) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { data, error } = await Jastip.create(payload);
    if (error) return res.status(400).json({ error });
    res.status(201).json(data);
  },

  async update(req, res) {
    const { id } = req.params;
    const payload = req.body;
    if (!payload || (typeof payload === 'object' && Object.keys(payload).length === 0)) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { data, error } = await Jastip.update(id, payload);
    if (error) return res.status(400).json({ error });
    res.json(data);
  },

  async remove(req, res) {
    const { id } = req.params;
    const { error } = await Jastip.remove(id);
    if (error) return res.status(400).json({ error });
    res.json({ message: "Data jastip berhasil dihapus" });
  },
};
