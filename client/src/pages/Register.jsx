import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [adSoyad, setAdSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await register(adSoyad, email, sifre);
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Hesap Oluştur</h2>
        <p className="auth-subtitle">Kişisel bütçeni yönetmeye hemen başla</p>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input
              type="text"
              placeholder="Örn: Enes Serbest"
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>E-posta Adresi</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="En az 6 karakter"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="auth-footer">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;