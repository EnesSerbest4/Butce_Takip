import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    toplamBakiye: 0,
    toplamGelir: 0,
    toplamGider: 0,
    netDurum: 0
  });
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Yeni İşlem Formu State'leri
  const [tur, setTur] = useState('gider');
  const [tutar, setTutar] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0]);

  // İşlem Geçmişi Filtre State'leri
  const [filterTur, setFilterTur] = useState('tumu');
  const [filterCategoryId, setFilterCategoryId] = useState('tumu');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllData = async () => {
    try {
      const [summaryRes, accRes, catRes, transRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/accounts'),
        api.get('/categories'),
        api.get('/transactions')
      ]);

      setSummary(summaryRes.data.ozet || summaryRes.data);
      setAccounts(accRes.data);
      setCategories(catRes.data);
      setTransactions(transRes.data);

      if (accRes.data.length > 0 && !accountId) {
        setAccountId(accRes.data[0].id);
      }
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredCategories = categories.filter((cat) => cat.tur === tur);

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    } else {
      setCategoryId('');
    }
  }, [tur, categories]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError('');

    if (!accountId || !categoryId) {
      setError('Lütfen önce bir hesap ve kategori seçin.');
      return;
    }

    try {
      await api.post('/transactions', {
        miktar: parseFloat(tutar),
        aciklama,
        accountId: parseInt(accountId),
        categoryId: parseInt(categoryId),
        tarih
      });

      setTutar('');
      setAciklama('');
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'İşlem eklenirken hata oluştu.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Bu işlemi silmek istediğinize emin misiniz? Hesap bakiyesi geri güncellenecektir.')) return;

    try {
      await api.delete(`/transactions/${id}`);
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'İşlem silinemedi.');
    }
  };

  // İşlem geçmişini seçili filtrelere göre süz
  const displayedTransactions = transactions.filter((tr) => {
    const islemTuru = tr.Category?.tur || 'gider';
    const turUyumu = filterTur === 'tumu' || islemTuru === filterTur;
    const kategoriUyumu =
      filterCategoryId === 'tumu' || String(tr.categoryId) === String(filterCategoryId);
    return turUyumu && kategoriUyumu;
  });

  const formatMoney = (val) =>
    parseFloat(val || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Bütçe Özeti & İşlemler</h2>
          <p>Genel finansal durumunu takip et, yeni gelir veya harcama kaydı oluştur.</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {/* Üst Özet Kartları */}
        <div className="summary-grid">
          <div className="summary-card balance">
            <span>Toplam Bakiye</span>
            <h3>{formatMoney(summary.toplamBakiye)}</h3>
          </div>
          <div className="summary-card income">
            <span>Toplam Gelir</span>
            <h3>{formatMoney(summary.toplamGelir)}</h3>
          </div>
          <div className="summary-card expense">
            <span>Toplam Gider</span>
            <h3>{formatMoney(summary.toplamGider)}</h3>
          </div>
          <div className="summary-card net">
            <span>Net Durum</span>
            <h3>{formatMoney(summary.netDurum)}</h3>
          </div>
        </div>

        <div className="grid-two-col">
          {/* Yeni Gelir / Gider Ekleme Formu */}
          <div className="card">
            <h3>Yeni İşlem Ekle</h3>
            {accounts.length === 0 ? (
              <p className="empty-text">
                İşlem ekleyebilmek için önce <strong>Hesaplarım</strong> sekmesinden en az bir hesap oluşturmalısın.
              </p>
            ) : (
              <form onSubmit={handleAddTransaction}>
                <div className="form-group">
                  <label>İşlem Türü</label>
                  <select value={tur} onChange={(e) => setTur(e.target.value)}>
                    <option value="gider">Gider (Harcama)</option>
                    <option value="gelir">Gelir</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Hesap / Cüzdan</label>
                  <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.hesapAdi} ({formatMoney(acc.bakiye)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Kategori</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                    {filteredCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.kategoriAdi}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tutar (TL)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={tutar}
                    onChange={(e) => setTutar(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tarih</label>
                  <input
                    type="date"
                    value={tarih}
                    onChange={(e) => setTarih(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Açıklama (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    placeholder="Örn: Market alışverişi, Burs ödemesi"
                    value={aciklama}
                    onChange={(e) => setAciklama(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  İşlemi Kaydet
                </button>
              </form>
            )}
          </div>

          {/* Son İşlemler Listesi ve Filtre Çubuğu */}
          <div className="card">
            <div className="list-header-row">
              <h3>İşlem Geçmişi ({displayedTransactions.length})</h3>
              <div className="filter-bar">
                <select value={filterTur} onChange={(e) => setFilterTur(e.target.value)}>
                  <option value="tumu">Tüm Türler</option>
                  <option value="gelir">Sadece Gelir</option>
                  <option value="gider">Sadece Gider</option>
                </select>

                <select
                  value={filterCategoryId}
                  onChange={(e) => setFilterCategoryId(e.target.value)}
                >
                  <option value="tumu">Tüm Kategoriler</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.kategoriAdi}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <p>Yükleniyor...</p>
            ) : displayedTransactions.length === 0 ? (
              <p className="empty-text">Seçilen filtreye uygun işlem kaydı bulunamadı.</p>
            ) : (
              <div className="transaction-list">
                {displayedTransactions.map((tr) => {
                  const islemTuru = tr.Category?.tur || 'gider';
                  return (
                    <div key={tr.id} className="transaction-item">
                      <div>
                        <div className="tr-title">
                          <span className={`badge ${islemTuru === 'gelir' ? 'badge-income' : 'badge-expense'}`}>
                            {islemTuru === 'gelir' ? 'Gelir' : 'Gider'}
                          </span>
                          <strong>{tr.Category?.kategoriAdi || 'Kategori'}</strong>
                          <span className="tr-account">• {tr.Account?.hesapAdi || 'Hesap'}</span>
                        </div>
                        <div className="tr-meta">
                          {tr.aciklama ? `${tr.aciklama} — ` : ''}
                          {new Date(tr.tarih).toLocaleDateString('tr-TR')}
                        </div>
                      </div>

                      <div className="tr-right">
                        <span className={islemTuru === 'gelir' ? 'amount-income' : 'amount-expense'}>
                          {islemTuru === 'gelir' ? '+' : '-'}
                          {formatMoney(tr.miktar)}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(tr.id)}
                          className="btn-danger"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;