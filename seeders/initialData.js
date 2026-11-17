const { Category } = require('../models');

const seedCategories = async () => {
  try {
    const defaultCategories = [
      { kategoriAdi: 'Maaş', tur: 'gelir' },
      { kategoriAdi: 'Yan Gelir', tur: 'gelir' },
      { kategoriAdi: 'Yemek & Mutfak', tur: 'gider' },
      { kategoriAdi: 'Kira & Fatura', tur: 'gider' },
      { kategoriAdi: 'Ulaşım', tur: 'gider' },
      { kategoriAdi: 'Eğlence', tur: 'gider' }
    ];

    for (const cat of defaultCategories) {
      await Category.findOrCreate({
        where: { kategoriAdi: cat.kategoriAdi },
        defaults: cat
      });
    }

    console.log('Varsayilan kategoriler basariyla veritabanina eklendi.');
  } catch (error) {
    console.error('Seed verileri eklenirken hata olustu:', error);
  }
};

module.exports = seedCategories;