import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';

const HomePage = ({ user }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div>
                <div className="mb-4">
                  <span className="badge bg-primary bg-opacity-10 px-3 py-2 rounded-pill fw-medium">
                    <i className="bi bi-star-fill me-2"></i>
                    Yapay Zeka Destekli Eğitim
                  </span>
                </div>
                <h1 className="display-3 fw-bold mb-4 text-white">
                  Geleceğin Eğitimi
                  <span className="d-block gradient-text" style={{
                    background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Bugün Başlıyor</span>
                </h1>
                <p className="lead mb-4 text-white-50 fs-5">
                  Yapay zeka destekli öğrenme platformu ile YKS ve LGS sınavlarına
                  hazırlanın. Kişiselleştirilmiş deneyim, anında geri bildirim.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-5">
                  {!user ? (
                    <>
                      <Link to="/register" className="btn btn-modern btn-lg gradient-bg text-white border-0">
                        <i className="bi bi-rocket-takeoff me-2"></i>
                        Hemen Başla
                      </Link>
                      <Link to="/login" className="btn btn-modern btn-lg btn-outline-light">
                        <i className="bi bi-arrow-right me-2"></i>
                        Giriş Yap
                      </Link>
                    </>
                  ) : (
                    <Link to="/chat" className="btn btn-modern btn-lg gradient-bg text-white border-0">
                      <i className="bi bi-chat-dots me-2"></i>
                      AI Chat'e Başla
                    </Link>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="glass-effect rounded-3 p-3 text-center">
                      <h4 className="fw-bold text-white mb-1">1000+</h4>
                      <small className="text-white-50">Aktif Öğrenci</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-effect rounded-3 p-3 text-center">
                      <h4 className="fw-bold text-white mb-1">5000+</h4>
                      <small className="text-white-50">Sınav Soruları</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-effect rounded-3 p-3 text-center">
                      <h4 className="fw-bold text-white mb-1">24/7</h4>
                      <small className="text-white-50">AI Destek</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-effect rounded-3 p-3 text-center">
                      <h4 className="fw-bold text-white mb-1">%95</h4>
                      <small className="text-white-50">Başarı Oranı</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="p-4 floating-animation">
                <ImageSlider />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-modern">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3">Neden CFK Academy?</h2>
              <p className="lead text-muted">
                Yapay zeka teknolojisi ile desteklenen kişiselleştirilmiş öğrenme deneyimi
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card card-modern h-100 card-modern-hover">
                <div className="card-body p-5 text-center">
                  <div className="gradient-bg rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-robot text-white display-5"></i>
                  </div>
                  <h4 className="fw-bold mb-3">AI Destekli Öğrenme</h4>
                  <p className="text-muted mb-0">
                    Gemini AI ile sorularınızı sorun, anında detaylı cevaplar alın.
                    Kişiselleştirilmiş öğrenme deneyimi.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card card-modern h-100 card-modern-hover">
                <div className="card-body p-5 text-center">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-graph-up-arrow text-white display-5"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Akıllı İlerleme Takibi</h4>
                  <p className="text-muted mb-0">
                    Sınav sonuçlarınızı analiz edin, gelişim alanlarınızı belirleyin
                    ve hedeflerinize ulaşın.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card card-modern h-100 card-modern-hover">
                <div className="card-body p-5 text-center">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-lightning-charge text-white display-5"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Anında Geri Bildirim</h4>
                  <p className="text-muted mb-0">
                    Sınav sonuçlarınızı anında görün, detaylı analizler alın
                    ve eksiklerinizi tamamlayın.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section className="section-dark" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3 text-white">Sınav Türleri</h2>
              <p className="lead text-white-50">
                YKS ve LGS sınavlarına özel hazırlanmış içerikler
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card card-modern h-100" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="card-body" style={{ padding: '2rem' }}>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4"
                      style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-mortarboard text-warning display-5"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-2 text-white text-white-shadow">YKS Hazırlık</h3>
                      <p className="text-white-50 mb-0 text-white-shadow">Üniversite sınavına hazırlık</p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">TYT ve AYT konuları</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">Matematik, Fen, Türkçe</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">Konu bazlı sınavlar</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">Detaylı çözümler</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card card-modern h-100" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="card-body" style={{ padding: '2rem' }}>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4"
                      style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-book text-danger display-5"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-2 text-white text-white-shadow">LGS Hazırlık</h3>
                      <p className="text-white-50 mb-0 text-white-shadow">Liseye geçiş sınavına hazırlık</p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">8. sınıf müfredatı</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">Matematik, Fen, Türkçe</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">Seviye bazlı sınavlar</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="small text-white fw-medium text-white-shadow">Konu tekrarı</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="card card-modern gradient-bg text-white border-0">
                <div className="card-body p-5">
                  <h2 className="display-6 fw-bold mb-4">
                    Başarıya Giden Yolda İlk Adımı Atın
                  </h2>
                  <p className="lead text-white-50 mb-4">
                    CFK Academy ile yapay zeka destekli öğrenme deneyimini keşfedin.
                    Hemen ücretsiz hesap oluşturun ve çalışmaya başlayın.
                  </p>
                  {!user && (
                    <Link to="/register" className="btn btn-modern btn-lg bg-white text-primary border-0">
                      <i className="bi bi-rocket-takeoff me-2"></i>
                      Ücretsiz Kayıt Ol
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 