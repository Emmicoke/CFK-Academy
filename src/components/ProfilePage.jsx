import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProfilePage = ({ user }) => {
  const [username, setUsername] = useState(user?.user_metadata?.full_name || '');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Profil verisi alınamadı:", error.message);
    } else {
      if (data?.avatar_url) {
        setProfileImageUrl(`${data.avatar_url}?t=${Date.now()}`);
      }
    }

    setLoading(false);
  };

  const updateProfile = async () => {
    setUpdating(true);
    setMessage(null);

    const updates = {
      id: user.id,
      username,
      avatar_url: profileImageUrl,
      updated_at: new Date(),
    };

    const { error: dbError } = await supabase.from('profiles').upsert(updates);

    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: username },
    });

    if (dbError || authError) {
      setMessage({
        type: 'error',
        text: dbError?.message || authError?.message || 'Güncelleme sırasında hata oluştu.',
      });
    } else {
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi.' });
    }

    setUpdating(false);
  };

  const uploadProfileImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage(null);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage({ type: 'error', text: 'Fotoğraf yüklenirken hata oluştu.' });
      console.error('Yükleme hatası:', uploadError.message);
      setUploadingImage(false);
      return;
    }

    const { data: urlData, error: urlError } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (urlError) {
      setMessage({ type: 'error', text: 'Fotoğraf URL alınamadı.' });
      console.error('URL alma hatası:', urlError.message);
    } else {
      const fullUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setProfileImageUrl(fullUrl);
      setMessage({ type: 'success', text: 'Fotoğraf başarıyla yüklendi.' });

      await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);
    }

    setUploadingImage(false);
  };

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-center text-white">
          <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
            <i className="bi bi-exclamation-triangle text-warning display-4"></i>
          </div>
          <h4 className="fw-bold mb-3">Giriş Gerekli</h4>
          <p className="opacity-75">Profil bilgilerini görüntülemek için lütfen giriş yapınız.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-center text-white">
          <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
            <i className="bi bi-lightning-charge text-primary display-4"></i>
          </div>
          <h4 className="fw-bold mb-3">Profil Yükleniyor...</h4>
          <div className="spinner-border text-white" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg" style={{borderRadius: '20px'}}>
              <div className="card-header bg-gradient-primary text-blue border-0" style={{borderRadius: '20px 20px 0 0'}}>
                <div className="d-flex align-items-center p-4" >
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-person-circle text-primary fs-4"></i>
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold">Profil Bilgileri</h3>
                    <small className="opacity-75">Hesap ayarlarınızı yönetin</small>
                  </div>
                </div>
              </div>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="position-relative d-inline-block">
                    <div
                      className="rounded-circle shadow-lg"
                      style={{
                        width: '150px',
                        height: '150px',
                        backgroundColor: '#e9ecef',
                        overflow: 'hidden',
                        border: '4px solid white',
                      }}
                    >
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt="Profil Fotoğrafı"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <i className="bi bi-person text-muted" style={{fontSize: '4rem'}}></i>
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="upload-avatar"
                      className="btn btn-outline-primary btn-sm position-absolute bottom-0 end-0 rounded-circle"
                      style={{ 
                        cursor: 'pointer',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="bi bi-camera"></i>
                    </label>
                    <input
                      type="file"
                      id="upload-avatar"
                      accept="image/*"
                      onChange={uploadProfileImage}
                      hidden
                      disabled={uploadingImage}
                    />
                  </div>
                  {uploadingImage && (
                    <div className="mt-3">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      <span className="text-muted">Yükleniyor...</span>
                    </div>
                  )}
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">
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
                        value={user.email}
                        disabled
                        style={{borderRadius: '0 10px 10px 0'}}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="username" className="form-label fw-semibold text-dark">
                      <i className="bi bi-person me-2 text-primary"></i>
                      Kullanıcı Adı
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        id="username"
                        type="text"
                        className="form-control border-start-0"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={updating}
                        placeholder="Kullanıcı adınızı girin"
                        style={{borderRadius: '0 10px 10px 0'}}
                      />
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`alert border-0 shadow-sm mt-4 ${
                    message.type === 'success' ? 'alert-success' : 'alert-danger'
                  }`} role="alert" style={{borderRadius: '15px'}}>
                    <div className="d-flex align-items-center">
                      <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-3`}></i>
                      <div>
                        <strong className="d-block">{message.type === 'success' ? 'Başarılı!' : 'Hata!'}</strong>
                        {message.text}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center mt-5">
                  <button
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                    onClick={updateProfile}
                    disabled={updating}
                    style={{borderRadius: '15px'}}
                  >
                    {updating ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                        <span>Güncelleniyor...</span>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="bi bi-check-circle me-2"></i>
                        <span>Profili Güncelle</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
