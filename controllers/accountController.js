const { Account } = require('../models');

// Yeni Hesap / Cüzdan Oluştur
exports.createAccount = async (req, res) => {
  try {
    const { hesapAdi, bakiye } = req.body;

    if (!hesapAdi) {
      return res.status(400).json({ message: 'Hesap adı zorunludur.' });
    }

    const yeniHesap = await Account.create({
      hesapAdi,
      bakiye: bakiye || 0,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Hesap başarıyla oluşturuldu.',
      account: yeniHesap
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

// Kullanıcının Tüm Hesaplarını Getir
exports.getAccounts = async (req, res) => {
  try {
    const hesaplar = await Account.findAll({
      where: { userId: req.user.id }
    });

    res.json(hesaplar);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

// Hesap Sil
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const silinen = await Account.destroy({
      where: { id, userId: req.user.id }
    });

    if (!silinen) {
      return res.status(404).json({ message: 'Hesap bulunamadı.' });
    }

    res.json({ message: 'Hesap başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};