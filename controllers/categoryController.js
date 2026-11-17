const { Category } = require('../models');

// Tüm Kategorileri Listele
exports.getCategories = async (req, res) => {
  try {
    const kategoriler = await Category.findAll();
    res.json(kategoriler);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

// Yeni Kategori Ekle
exports.createCategory = async (req, res) => {
  try {
    const { kategoriAdi, tur } = req.body;

    if (!kategoriAdi || !tur) {
      return res.status(400).json({ message: 'Kategori adı ve türü (gelir/gider) zorunludur.' });
    }

    const yeniKategori = await Category.create({ kategoriAdi, tur });
    res.status(201).json({
      message: 'Kategori başarıyla oluşturuldu.',
      category: yeniKategori
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};