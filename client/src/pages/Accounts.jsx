import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [hesapAdi, setHesapAdi] = useState('');
  const [bakiye, setBakiye] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      setError('Hesaplar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/accounts', {
        hesapAdi,
        bakiye: parseFloat(bakiye) || 0
      });
      setHesapAdi('');
      setBakiye('');
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Hesap oluşturulurken hata oluştu.');
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm('Bu hesabı silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/accounts/${id}`);
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Hesap silinemedi.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Hesaplarım & Cüzdanlar</h2>
          <p>Banka hesaplarını, kredi kartlarını veya nakit cüzdanlarını buradan yönetebilirsin.</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div className="grid-two-col">
          {/* Yeni Hesap Ekleme Formu */}
          <div className="card">
            <h3>Yeni Hesap Ekle</h3>
            <form onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label>Hesap Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Ziraat Bankası, Nakit Cüzdan"
                  value={hesapAdi}
                  onChange={(e) => setHesapAdi(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Başlangıç Bakiyesi (TL)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={bakiye}
                  onChange={(e) => setBakiye(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Hesabı Kaydet
              </button>
            </form>
          </div>

          {/* Mevcut Hesaplar Listesi */}
          <div className="card">
            <h3>Kayıtlı Hesaplar ({accounts.length})</h3>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : accounts.length === 0 ? (
              <p className="empty-text">Henüz kayıtlı bir hesabın bulunmuyor.</p>
            ) : (
              <div className="account-list">
                {accounts.map((acc) => (
                  <div key={acc.id} className="account-item">
                    <div>
                      <strong>{acc.hesapAdi}</strong>
                      <div className="account-balance">
                        {parseFloat(acc.bakiye).toLocaleString('tr-TR', {
                          minimumFractionDigits: 2
                        })}{' '}
                        ₺
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAccount(acc.id)}
                      className="btn-danger"
                    >
                      Sil
                    </button>
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

export default Accounts;