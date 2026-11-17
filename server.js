const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const seedCategories = require('./seeders/initialData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Kisisel Butce ve Harcama Takibi API Calisiyor" });
});

sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Veritabani ve tablolar basariyla senkronize edildi.');
    await seedCategories();
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda aktif.`);
    });
  })
  .catch((err) => {
    console.error('Veritabanina baglanirken hata olustu:', err);
  });