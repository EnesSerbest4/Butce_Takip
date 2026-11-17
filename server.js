const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const seedCategories = require('./seeders/initialData');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Kisisel Butce ve Harcama Takibi API Calisiyor" });
});

// Hata Yakalama Katmanları (Rotalardan sonra gelmeli)
app.use(notFound);
app.use(errorHandler);

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