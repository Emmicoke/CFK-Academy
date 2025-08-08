import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="section-dark py-5">
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="gradient-bg rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation" 
                   style={{width: '45px', height: '45px'}}>
                <i className="bi bi-lightning-charge text-white fs-5"></i>
              </div>
              <h5 className="fw-bold mb-0 text-white">CFK Academy</h5>
            </div>
            <p className="text-white-50 mb-4">
              Yapay zeka destekli öğrenme platformu ile YKS ve LGS sınavlarına 
              hazırlanın. Kişiselleştirilmiş deneyim, anında geri bildirim.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                 style={{transition: 'all 0.3s ease'}}>
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                 style={{transition: 'all 0.3s ease'}}>
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                 style={{transition: 'all 0.3s ease'}}>
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                 style={{transition: 'all 0.3s ease'}}>
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-white">Hızlı Linkler</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-lift" 
                      style={{transition: 'all 0.3s ease'}}>Ana Sayfa</Link>
              </li>
              <li className="mb-2">
                <Link to="/chat" className="text-white-50 text-decoration-none hover-lift" 
                      style={{transition: 'all 0.3s ease'}}>AI Chat</Link>
              </li>
              <li className="mb-2">
                <Link to="/exams" className="text-white-50 text-decoration-none hover-lift" 
                      style={{transition: 'all 0.3s ease'}}>Özel Sınavlar</Link>
              </li>
              <li className="mb-2">
                <Link to="/tests" className="text-white-50 text-decoration-none hover-lift" 
                      style={{transition: 'all 0.3s ease'}}>Deneme Sınavları</Link>
              </li>
              <li className="mb-2">
                <Link to="/statistics" className="text-white-50 text-decoration-none hover-lift" 
                      style={{transition: 'all 0.3s ease'}}>İstatistikler</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-white">Hizmetler</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>YKS Hazırlık</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>LGS Hazırlık</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>Online Dersler</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>Deneme Sınavları</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>AI Destek</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3 text-white">İletişim</h6>
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-geo-alt text-primary me-2"></i>
                <span className="text-white-50">İstanbul, Türkiye</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope text-primary me-2"></i>
                <span className="text-white-50">info@cfkacademy.com</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone text-primary me-2"></i>
                <span className="text-white-50">+90 (212) 555 0123</span>
              </div>
            </div>
            <div className="input-group">
              <input 
                type="email" 
                className="form-control btn-modern border-0" 
                placeholder="E-posta adresiniz"
                style={{borderRadius: '12px 0 0 12px'}}
              />
              <button className="btn btn-primary btn-modern gradient-bg border-0" 
                      style={{borderRadius: '0 12px 12px 0'}}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-top border-white-10 pt-4 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-white-50 mb-0">
                © 2024 CFK Academy. Tüm hakları saklıdır.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-3 justify-content-md-end">
                <a href="#" className="text-white-50 text-decoration-none small hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>Gizlilik Politikası</a>
                <a href="#" className="text-white-50 text-decoration-none small hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>Kullanım Şartları</a>
                <a href="#" className="text-white-50 text-decoration-none small hover-lift" 
                   style={{transition: 'all 0.3s ease'}}>KVKK</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 