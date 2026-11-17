const { Account, Transaction, Category, sequelize } = require('../models');

// Genel Bütçe Özeti ve Kategori Bazlı Dağılım
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Kullanıcının tüm hesaplarındaki toplam bakiye
    const hesaplar = await Account.findAll({ where: { userId } });
    const toplamBakiye = hesaplar.reduce((toplam, h) => toplam + parseFloat(h.bakiye), 0);

    // 2. Kullanıcının tüm işlemlerini kategori bilgisiyle çek
    const islemler = await Transaction.findAll({
      where: { userId },
      include: [{ model: Category, attributes: ['id', 'kategoriAdi', 'tur'] }]
    });

    let toplamGelir = 0;
    let toplamGider = 0;
    const kategoriDagilimi = {};

    islemler.forEach((islem) => {
      const tutar = parseFloat(islem.miktar);
      const kategoriAdi = islem.Category ? islem.Category.kategoriAdi : 'Diğer';
      const tur = islem.Category ? islem.Category.tur : 'gider';

      if (tur === 'gelir') {
        toplamGelir += tutar;
      } else {
        toplamGider += tutar;
        kategoriDagilimi[kategoriAdi] = (kategoriDagilimi[kategoriAdi] || 0) + tutar;
      }
    });

    res.json({
      ozet: {
        toplamBakiye,
        toplamGelir,
        toplamGider,
        netDurum: toplamGelir - toplamGider,
        hesapSayisi: hesaplar.length,
        islemSayisi: islemler.length
      },
      kategoriBazliGiderler: kategoriDagilimi
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};