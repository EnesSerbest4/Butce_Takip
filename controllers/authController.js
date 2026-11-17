const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Kullanıcı Kayıt (Register)
exports.register = async (req, res) => {
  try {
    const { adSoyad, email, sifre } = req.body;

    if (!adSoyad || !email || !sifre) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    const mevcutKullanici = await User.findOne({ where: { email } });
    if (mevcutKullanici) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashliSifre = await bcrypt.hash(sifre, salt);

    const yeniKullanici = await User.create({
      adSoyad,
      email,
      sifre: hashliSifre
    });

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu.',
      user: {
        id: yeniKullanici.id,
        adSoyad: yeniKullanici.adSoyad,
        email: yeniKullanici.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};

// Kullanıcı Giriş (Login)
exports.login = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    if (!email || !sifre) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
    }

    const kullanici = await User.findOne({ where: { email } });
    if (!kullanici) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreDogruMu) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    const token = jwt.sign(
      { id: kullanici.id, rol: kullanici.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Giriş başarılı.',
      token,
      user: {
        id: kullanici.id,
        adSoyad: kullanici.adSoyad,
        email: kullanici.email,
        rol: kullanici.rol
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
};