import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Bütçe Takip</Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          Özet & İşlemler
        </Link>
        <Link
          to="/accounts"
          className={location.pathname === '/accounts' ? 'active' : ''}
        >
          Hesaplarım
        </Link>
      </div>

      <div className="navbar-user">
        <span>{user?.adSoyad || user?.email}</span>
        <button onClick={handleLogout} className="btn-logout">
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
};

export default Navbar;