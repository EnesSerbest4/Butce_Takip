const { Transaction, Account, Category, sequelize } = require('../models');

// Yeni Gelir veya Gider İşlemi Ekle (Bakiyeyi Otomatik Günceller)
exports.createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { miktar, aciklama, tarih, accountId, categoryId } = req.body;

    if (!miktar || !accountId || !categoryId) {
      await t.rollback();
      return res.status(400).json({ message: 'Miktar, hesap ve kategori seçimi zorunludur.' });
    }

    const hesap = await Account.findOne({
      where: { id: accountId, userId: req.user.id },
      transaction: t
    });

    if (!hesap) {
      await t.rollback();
      return res.status(404).json({ message: 'Hesap bulunamadı.' });
    }

    const kategori = await Category.findByPk(categoryId, { transaction: t });
    if (!kategori) {
      await t.rollback();
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    const tutar = parseFloat(miktar);
    let yeniBakiye = parseFloat(hesap.bakiye);

    if (kategori.tur === 'gelir') {
      yeniBakiye += tutar;
    } else if (kategori.tur === 'gider') {
      if (yeniBakiye < tutar) {
        await t.rollback();
        return res.status(400).json({ message: 'Hesap bakiyesi yetersiz.' });
      }
      yeniBakiye -= tutar;
    }

    await hesap.update({ bakiye: yeniBakiye }, { transaction: t });

    const yeniIslem = await Transaction.create({
      miktar: tutar,
      aciklama,
      tarih: tarih || new Date(),
      userId: req.user.id,
      accountId,
      categoryId
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'İşlem başarıyla kaydedildi ve bakiye güncellendi.',
      transaction: yeniIslem,
      guncelBakiye: yeniBakiye
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

// Kullanıcının Tüm İşlemlerini Listele (Hesap ve Kategori Bilgileriyle)
exports.getTransactions = async (req, res) => {
  try {
    const islemler = await Transaction.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Account, attributes: ['id', 'hesapAdi'] },
        { model: Category, attributes: ['id', 'kategoriAdi', 'tur'] }
      ],
      order: [['tarih', 'DESC']]
    });

    res.json(islemler);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

// İşlem Sil (Bakiyeyi Geri Alır)
exports.deleteTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const islem = await Transaction.findOne({
      where: { id, userId: req.user.id },
      include: [Category],
      transaction: t
    });

    if (!islem) {
      await t.rollback();
      return res.status(404).json({ message: 'İşlem bulunamadı.' });
    }

    const hesap = await Account.findByPk(islem.accountId, { transaction: t });
    if (hesap && islem.Category) {
      let guncelBakiye = parseFloat(hesap.bakiye);
      const tutar = parseFloat(islem.miktar);

      if (islem.Category.tur === 'gelir') {
        guncelBakiye -= tutar;
      } else {
        guncelBakiye += tutar;
      }

      await hesap.update({ bakiye: guncelBakiye }, { transaction: t });
    }

    await islem.destroy({ transaction: t });
    await t.commit();

    res.json({ message: 'İşlem silindi ve hesap bakiyesi geri güncellendi.' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};