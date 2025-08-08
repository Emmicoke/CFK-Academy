import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [examType, setExamType] = useState('yks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            exam_type: examType,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Kayıt başarılı! E-posta adresinizi doğrulayın.');
        setUser(null);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setError('Kayıt olurken bir hata oluştu.');
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
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg" style={{borderRadius: '20px'}}>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="bg-gradient-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-rocket-takeoff text-white display-4"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Başarıya Giden Yol</h2>
                  <p className="text-muted">CFK Academy'ye ücretsiz katılın</p>
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

                {success && (
                  <div className="alert alert-success border-0 shadow-sm" role="alert" style={{borderRadius: '15px'}}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-3 text-success"></i>
                      <div>
                        <strong className="d-block">Başarılı!</strong>
                        {success}
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label htmlFor="fullName" className="form-label fw-semibold text-dark">
                        <i className="bi bi-person me-2 text-primary"></i>
                        Ad Soyad
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          placeholder="Adınız ve soyadınız"
                          style={{borderRadius: '0 10px 10px 0'}}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
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

                    <div className="col-12">
                      <label htmlFor="examType" className="form-label fw-semibold text-dark">
                        <i className="bi bi-book me-2 text-primary"></i>
                        Sınav Türü
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-book text-muted"></i>
                        </span>
                        <select
                          className="form-select border-start-0"
                          id="examType"
                          value={examType}
                          onChange={(e) => setExamType(e.target.value)}
                          required
                          style={{borderRadius: '0 10px 10px 0'}}
                        >
                          <option value="yks">YKS (Üniversite Sınavı)</option>
                          <option value="lgs">LGS (Liseye Geçiş Sınavı)</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
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
                          placeholder="En az 6 karakter"
                          minLength="6"
                          style={{borderRadius: '0 10px 10px 0'}}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold text-dark">
                        <i className="bi bi-lock-fill me-2 text-primary"></i>
                        Şifre Tekrar
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control border-start-0"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Şifrenizi tekrar girin"
                          style={{borderRadius: '0 10px 10px 0'}}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-3 fw-bold mt-4"
                    disabled={loading}
                    style={{borderRadius: '15px'}}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-3" role="status" aria-hidden="true"></div>
                        <span>Kayıt Oluşturuluyor...</span>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="bi bi-rocket-takeoff me-2"></i>
                        <span>Hemen Başla</span>
                      </div>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Zaten hesabınız var mı?{' '}
                    <Link to="/login" className="text-decoration-none fw-bold text-primary">
                      Giriş Yap
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

export default Register; 