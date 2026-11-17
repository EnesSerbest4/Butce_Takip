# Kişisel Bütçe ve Harcama Takibi API

Node.js, Express, Sequelize ORM ve MySQL kullanılarak geliştirilmiş; JWT kimlik doğrulama destekli kişisel finans ve bütçe yönetim REST API uygulaması.

## Kullanılan Teknolojiler
- **Backend:** Node.js, Express.js
- **Veritabanı & ORM:** MySQL, Sequelize
- **Güvenlik & Kimlik Doğrulama:** JSON Web Token (JWT), Bcrypt.js, Dotenv, CORS

## Proje Klasör Yapısı
- `config/` — Veritabanı bağlantı ayarları
- `controllers/` — İş mantığı (Auth, Account, Category, Transaction, Dashboard)
- `middlewares/` — JWT doğrulama ve merkezi hata yönetimi katmanları
- `models/` — Sequelize veritabanı modelleri ve ilişkileri
- `routes/` — API yönlendirmeleri
- `seeders/` — Başlangıç kategori verileri
- `.env` — Ortam değişkenleri
- `server.js` — Uygulama giriş noktası

## Kurulum ve Çalıştırma
1. Gerekli paketleri yükleyin:
   `npm install`

2. Proje ana dizininde `.env` dosyasını oluşturun ve kendi ayarlarınızı girin:
   - `PORT=5000`
   - `DB_NAME=butce_takip_db`
   - `DB_USER=root`
   - `DB_PASS=`
   - `DB_HOST=localhost`
   - `JWT_SECRET=butce_takip_gizli_anahtar_2026`

3. MySQL sunucusunu başlatın ve uygulamayı geliştirme modunda ayağa kaldırın:
   `npm run dev`

## API Endpoint Listesi

### Kimlik Doğrulama (Auth)
- `POST /api/auth/register` — Yeni kullanıcı kaydı oluşturur.
- `POST /api/auth/login` — Kullanıcı girişi yapar ve JWT token döndürür.

### Hesap Yönetimi (Accounts) - Bearer Token Gerekli
- `POST /api/accounts` — Yeni banka veya nakit hesabı ekler.
- `GET /api/accounts` — Giriş yapan kullanıcının tüm hesaplarını listeler.
- `DELETE /api/accounts/:id` — Belirtilen hesabı siler.

### Kategori Yönetimi (Categories) - Bearer Token Gerekli
- `GET /api/categories` — Mevcut gelir ve gider kategorilerini listeler.
- `POST /api/categories` — Yeni özel kategori ekler.

### Gelir ve Gider İşlemleri (Transactions) - Bearer Token Gerekli
- `POST /api/transactions` — Yeni işlem ekler ve ilgili hesabın bakiyesini ACID transaction ile otomatik günceller.
- `GET /api/transactions` — İşlemleri listeler (`?accountId=`, `?categoryId=`, `?tur=`, `?baslangicTarihi=`, `?bitisTarihi=` parametreleriyle filtrelenebilir).
- `DELETE /api/transactions/:id` — İşlemi siler ve hesap bakiyesini eski haline döndürür.

### Bütçe Özeti (Dashboard) - Bearer Token Gerekli
- `GET /api/dashboard/summary` — Toplam bakiye, toplam gelir, toplam gider, net durum ve kategori bazlı gider dağılımını getirir.