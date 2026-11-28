import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [kategoriAdi, setKategoriAdi] = useState('');
  const [tur, setTur] = useState('gider');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Kategoriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/categories', {
        kategoriAdi,
        tur
      });
      setKategoriAdi('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Kategori eklenirken hata oluştu.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Kategori silinemedi.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Kategoriler</h2>
          <p>Gelir ve gider işlemlerini gruplamak için özel kategoriler oluşturabilirsin.</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div className="grid-two-col">
          {/* Yeni Kategori Ekleme Formu */}
          <div className="card">
            <h3>Yeni Kategori Ekle</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Kategori Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Kırtasiye, Spor, Burs"
                  value={kategoriAdi}
                  onChange={(e) => setKategoriAdi(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategori Türü</label>
                <select value={tur} onChange={(e) => setTur(e.target.value)}>
                  <option value="gider">Gider</option>
                  <option value="gelir">Gelir</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Kategoriyi Kaydet
              </button>
            </form>
          </div>

          {/* Mevcut Kategoriler Listesi */}
          <div className="card">
            <h3>Kayıtlı Kategoriler ({categories.length})</h3>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : categories.length === 0 ? (
              <p className="empty-text">Henüz kayıtlı bir kategori bulunmuyor.</p>
            ) : (
              <div className="account-list">
                {categories.map((cat) => (
                  <div key={cat.id} className="account-item">
                    <div className="tr-title">
                      <span className={`badge ${cat.tur === 'gelir' ? 'badge-income' : 'badge-expense'}`}>
                        {cat.tur === 'gelir' ? 'Gelir' : 'Gider'}
                      </span>
                      <strong>{cat.kategoriAdi}</strong>
                    </div>

                    {cat.userId ? (
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="btn-danger"
                      >
                        Sil
                      </button>
                    ) : (
                      <span className="tr-account">Varsayılan</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;