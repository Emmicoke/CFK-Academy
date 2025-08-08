import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useState, useEffect } from 'react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top navbar-modern ${isScrolled ? 'shadow-lg' : ''}`}
         style={{
           transition: 'all 0.3s ease',
           background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)'
         }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="gradient-bg rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation" 
               style={{width: '45px', height: '45px'}}>
            <i className="bi bi-lightning-charge text-white fs-4"></i>
          </div>
          <span className="fw-bold fs-4" style={{color: 'var(--primary-color)'}}>CFK Academy</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link fw-medium ${isActive('/') ? 'text-primary' : 'text-dark'}`} 
                to="/"
                style={{transition: 'all 0.3s ease'}}
              >
                <i className="bi bi-house-door me-2"></i>
                Ana Sayfa
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link fw-medium ${isActive('/chat') ? 'text-primary' : 'text-dark'}`} 
                    to="/chat"
                    style={{transition: 'all 0.3s ease'}}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    AI Chat
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link fw-medium ${isActive('/exams') ? 'text-primary' : 'text-dark'}`} 
                    to="/exams"
                    style={{transition: 'all 0.3s ease'}}
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Özel Sınavlar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link fw-medium ${isActive('/tests') ? 'text-primary' : 'text-dark'}`} 
                    to="/tests"
                    style={{transition: 'all 0.3s ease'}}
                  >
                    <i className="bi bi-clipboard-data me-2"></i>
                    Deneme Sınavları
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link fw-medium ${isActive('/statistics') ? 'text-primary' : 'text-dark'}`} 
                    to="/statistics"
                    style={{transition: 'all 0.3s ease'}}
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    İstatistikler
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="navbar-nav">
            {user ? (
              <div className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center glass-effect rounded-pill px-3 py-2" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{transition: 'all 0.3s ease'}}
                >
                  <div className="gradient-bg rounded-circle d-flex align-items-center justify-content-center me-2" 
                       style={{width: '35px', height: '35px'}}>
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <span className="fw-medium">{user.user_metadata?.full_name || 'Kullanıcı'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end card-modern border-0 shadow-lg">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center py-3" to="/profile">
                      <i className="bi bi-person-circle me-3 text-primary"></i>
                      <span className="fw-medium">Profil</span>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center py-3 text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-3"></i>
                      <span className="fw-medium">Çıkış Yap</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <Link className="btn btn-outline-primary btn-modern" to="/login">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Giriş Yap
                </Link>
                <Link className="btn btn-primary btn-modern gradient-bg border-0" to="/register">
                  <i className="bi bi-person-plus me-2"></i>
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 