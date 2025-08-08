import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setUser(data.user);
        navigate('/');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg" style={{borderRadius: '20px'}}>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-lightning-charge text-white display-4"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Hoş Geldiniz</h2>
                  <p className="text-muted">CFK Academy hesabınıza giriş yapın</p>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 shadow-sm" role="alert" style={{borderRadius: '15px'}}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-3 text-danger"></i>
                      <div>
                        <strong className="d-block">Hata!</strong>
                        {error}
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold text-dark">
                      <i className="bi bi-envelope me-2 text-primary"></i>
                      E-posta Adresi
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="ornek@email.com"
                        style={{borderRadius: '0 10px 10px 0'}}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                      <i className="bi bi-lock me-2 text-primary"></i>
                      Şifre
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Şifrenizi girin"
                        style={{borderRadius: '0 10px 10px 0'}}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold mb-4"
                    disabled={loading}
                    style={{borderRadius: '15px'}}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-3" role="status" aria-hidden="true"></div>
                        <span>Giriş Yapılıyor...</span>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        <span>Giriş Yap</span>
                      </div>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Hesabınız yok mu?{' '}
                    <Link to="/register" className="text-decoration-none fw-bold text-primary">
                      Kayıt Ol
                    </Link>
                  </p>
                </div>

                <div className="text-center mt-4">
                  <Link to="/" className="text-decoration-none text-muted">
                    <i className="bi bi-arrow-left me-2"></i>
                    Ana Sayfaya Dön
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 