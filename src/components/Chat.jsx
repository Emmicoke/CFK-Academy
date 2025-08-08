import { useState, useRef, useEffect } from 'react';
import { askGemini } from '../api/gemini';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState('yks');
  const [selectedSubject, setSelectedSubject] = useState('matematik');
  const messagesEndRef = useRef(null);

  // LGS ve YKS için dersler ayrı ayrı tanımlandı
  const subjectsMap = {
    yks: {
      matematik: 'Matematik',
      fizik: 'Fizik',
      kimya: 'Kimya',
      biyoloji: 'Biyoloji',
      turkce: 'Türkçe',
      sosyal: 'Sosyal Bilgiler',
      tarih: 'Tarih',
      cografya: 'Coğrafya',
      felsefe: 'Felsefe',
    },
    lgs: {
      matematik: 'Matematik',
      fen: 'Fen Bilimleri',
      turkce: 'Türkçe',
      sosyal: 'Sosyal Bilgiler',
      inkilap: 'T.C. İnkılap Tarihi ve Atatürkçülük',
      din: 'Din Kültürü ve Ahlak Bilgisi',
      ingilizce: 'İngilizce',
    },
  };

  const examTypes = {
    yks: 'YKS',
    lgs: 'LGS',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // selectedExam değişince, selectedSubject uygun şekilde resetlenir
  useEffect(() => {
    const subjectsForExam = subjectsMap[selectedExam];
    // Eğer mevcut selectedSubject bu sınavda yoksa ilk dersi seç
    if (!subjectsForExam[selectedSubject]) {
      const firstSubjectKey = Object.keys(subjectsForExam)[0];
      setSelectedSubject(firstSubjectKey);
    }
  }, [selectedExam]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR'),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `Sen CFK Academy'nin ${examTypes[selectedExam]} ${subjectsMap[selectedExam][selectedSubject]} öğretmenisin. 
Öğrencinin sorusunu detaylı ve anlaşılır bir şekilde cevapla. 
Gerekirse adım adım çözüm göster. 
Öğrenci sorusu: ${input}`;

      const response = await askGemini(prompt);

      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR'),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const subjects = subjectsMap[selectedExam];

  return (
    <div className="py-5" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card card-modern border-0 shadow-xl" style={{borderRadius: '24px', minHeight: '80vh', maxHeight: '90vh'}}>
              {/* Header */}
              <div className="card-header gradient-bg text-white border-0" style={{borderRadius: '24px 24px 0 0'}}>
                <div className="d-flex justify-content-between align-items-center p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation" 
                         style={{width: '55px', height: '55px'}}>
                      <i className="bi bi-robot text-primary fs-3"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold">AI Asistan</h4>
                      <small className="opacity-75">CFK Academy Yapay Zeka Destekli Öğrenme</small>
                    </div>
                  </div>
                  <button 
                    onClick={clearChat}
                    className="btn btn-outline-light btn-modern px-4"
                    title="Sohbeti Temizle"
                    style={{borderRadius: '12px'}}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Temizle
                  </button>
                </div>
              </div>

              <div className="card-body p-0 d-flex flex-column" style={{height: 'calc(80vh - 120px)'}}>
                {/* Subject and Exam Selection */}
                <div className="p-4 border-bottom bg-light">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-book me-2 text-primary"></i>
                        Ders Seçin
                      </label>
                      <select
                        className="form-select border-0 shadow-sm btn-modern"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{borderRadius: '12px'}}
                      >
                        {Object.entries(subjects).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-mortarboard me-2 text-primary"></i>
                        Sınav Türü
                      </label>
                      <select
                        className="form-select border-0 shadow-sm btn-modern"
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        style={{borderRadius: '12px'}}
                      >
                        {Object.entries(examTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow-1 p-4" style={{overflowY: 'auto', maxHeight: '500px'}}>
                  {messages.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4 floating-animation" 
                           style={{width: '120px', height: '120px'}}>
                        <i className="bi bi-chat-dots text-muted display-3"></i>
                      </div>
                      <h5 className="fw-bold mb-3">Hoş Geldiniz!</h5>
                      <p className="mb-0">
                        {subjects[selectedSubject]} dersi hakkında sorularınızı sorabilirsiniz.
                        <br />
                        AI asistanınız size yardımcı olmaya hazır.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`d-flex mb-4 ${
                          message.sender === 'user'
                            ? 'justify-content-end'
                            : 'justify-content-start'
                        }`}
                      >
                        <div
                          className={`p-4 rounded-4 shadow-sm ${
                            message.sender === 'user'
                              ? 'gradient-bg text-white'
                              : message.isError
                              ? 'bg-danger text-white'
                              : 'bg-light text-dark'
                          }`}
                          style={{ 
                            maxWidth: '75%',
                            borderRadius: message.sender === 'user' ? '24px 24px 8px 24px' : '24px 24px 24px 8px'
                          }}
                        >
                          <div className="message-text mb-2" style={{lineHeight: '1.6'}}>{message.text}</div>
                          <small
                            className={`opacity-75 ${
                              message.sender === 'user' ? 'text-white' : 'text-muted'
                            }`}
                          >
                            {message.timestamp}
                          </small>
                        </div>
                      </div>
                    ))
                  )}

                  {loading && (
                    <div className="d-flex justify-content-start mb-4">
                      <div className="bg-light p-4 rounded-4 shadow-sm" style={{borderRadius: '24px 24px 24px 8px'}}>
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-3 text-primary" role="status"></div>
                          <span className="fw-medium">AI düşünüyor...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 border-top bg-white" style={{borderRadius: '0 0 24px 24px'}}>
                  <form onSubmit={handleSendMessage}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-0 shadow-sm btn-modern"
                        placeholder={`${subjects[selectedSubject]} hakkında sorunuzu yazın...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        style={{borderRadius: '16px 0 0 16px'}}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary border-0 shadow-sm btn-modern gradient-bg"
                        disabled={!input.trim() || loading}
                        style={{borderRadius: '0 16px 16px 0'}}
                      >
                        {loading ? (
                          <div className="spinner-border spinner-border-sm" role="status"></div>
                        ) : (
                          <i className="bi bi-send-fill"></i>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
