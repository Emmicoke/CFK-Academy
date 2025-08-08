import React, { useState, useEffect, useRef } from "react";
import { askGemini } from "../api/gemini";
import { supabase } from '../lib/supabaseClient';
// import CountdownTimer from "./CountdownTimer";
import ScrollToTopButton from "./ScrollToTopButton";

const examDurations = {
  TYT: 165, // dakika
  AYT: 180,
  LGS: 155,
};

const YKS_SECTIONS = {
  TYT: [
    { name: "Türkçe", count: 40, duration: 165 },
    { name: "Temel Matematik", count: 40, duration: 165 },
    {
      name: "Sosyal Bilimler",
      duration: 80,
      subSections: [
        { name: "Coğrafya", count: 5 },
        { name: "Din Kültürü", count: 5 },
        { name: "Felsefe", count: 5 },
        { name: "Tarih", count: 5 },
      ],
    },
    {
      name: "Fen Bilimleri",
      duration: 80,
      subSections: [
        { name: "Fizik", count: 7 },
        { name: "Kimya", count: 7 },
        { name: "Biyoloji", count: 6 },
      ],
    },
  ],
  AYT: [
    { name: "Türk Dili ve Edebiyatı", count: 40, duration: 180 },
    { name: "Matematik", count: 40, duration: 180 },
    {
      name: "Sosyal Bilimler",
      duration: 100,
      subSections: [
        { name: "Tarih", count: 11 },
        { name: "Coğrafya", count: 11 },
        { name: "Felsefe", count: 12 },
        { name: "Din Kültürü", count: 6 },
      ],
    },
    {
      name: "Fizik Kimya Biyoloji",
      duration: 100,
      subSections: [
        { name: "Fizik", count: 14 },
        { name: "Kimya", count: 13 },
        { name: "Biyoloji", count: 13 },
      ],
    },
  ],
};

const LGS_SECTIONS = [
  { name: "Türkçe", count: 20, duration: 50 },
  { name: "Matematik", count: 20, duration: 40 },
  { name: "Fen Bilimleri", count: 20, duration: 30 },
  { name: "İnkılap Tarihi", count: 10, duration: 20 },
  { name: "İngilizce", count: 10, duration: 20 },
  { name: "Din Kültürü", count: 10, duration: 20 },
];

const TestsPage = () => {
  const [sectionQuestions, setSectionQuestions] = useState({});
  const [sectionAnswers, setSectionAnswers] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const [sections, setSections] = useState([]);
  const [flatSections, setFlatSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSectionMessage, setShowSectionMessage] = useState(false);
  const [examSummary, setExamSummary] = useState([]);
  const [aytTrack, setAytTrack] = useState(null);
  const [user, setUser] = useState(null);
  // Sağa sabit buton ve açılır panel
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);

  const scrollToQuestion = (sectionName, index) => {
    const id = `${sectionName.replace(/\s/g, "_")}_q${index}`;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    }

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Kullanıcı alınamadı:", error.message);
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const saveResultsToSupabase = async (resultsData) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('test_results').insert(resultsData);
      if (error) console.error('Supabase kayıt hatası:', error);
    } catch (err) {
      console.error('Kayıt hatası:', err);
    }
  };

  const calculateResults = async (currentSection) => {
    if (!user) {
      console.error("Kullanıcı bulunamadı, sonuç kaydedilemedi.");
      return;
    }

    let correct_count = 0;
    let wrong_count = 0;
    let unanswered_count = 0;

    // Her soruya bakıp durumu sayıyoruz
    questions.forEach((q, index) => {
      const userAnswer = selectedAnswers[index];
      if (userAnswer === q.answer) {
        correct_count++;
      } else if (!userAnswer) {
        unanswered_count++;
      } else {
        wrong_count++;
      }
    });

    // Opsiyonel olarak konu bazlı istatistik de oluşturulabilir
    const topicStats = {
      [currentSection.name]: {
        correct: correct_count,
        wrong: wrong_count,
        empty: unanswered_count,
      },
    };

    // Sonuçları Supabase'e gönderiyoruz
    await saveResultsToSupabase({
      user_id: user.id,
      exam_type: selectedExam,
      section_name: currentSection.name,
      question_count: questions.length,
      correct_count,
      wrong_count,
      unanswered_count,
      topic_stats: JSON.stringify(topicStats),
      topic: currentSection.name,
    });

    setExamSummary(prev => [...prev, {
      sectionName: currentSection.name,
      questions,
      selectedAnswers,
      correct_count,
      wrong_count,
      unanswered_count
    }]);
  };

  useEffect(() => {
    if (!selectedExam) return;

    let baseSections = [];

    if (selectedExam === "LGS") {
      baseSections = LGS_SECTIONS;
    } else if (selectedExam === "TYT") {
      baseSections = YKS_SECTIONS.TYT;
    } else if (selectedExam === "AYT") {
      let aytAll = YKS_SECTIONS.AYT;

      if (aytTrack === "sayısal") {
        baseSections = aytAll.filter(
          (s) => s.name === "Matematik" || s.name === "Fizik Kimya Biyoloji"
        );
      } else if (aytTrack === "eşit ağırlık") {
        baseSections = aytAll.filter(
          (s) => s.name === "Matematik" || s.name === "Türk Dili ve Edebiyatı"
        );
      } else if (aytTrack === "sözel") {
        baseSections = aytAll.filter(
          (s) => s.name === "Türk Dili ve Edebiyatı" || s.name === "Sosyal Bilimler"
        );
      }
    }

    const expandedSections = [];
    baseSections.forEach((section) => {
      if (section.subSections) {
        section.subSections.forEach((sub) => {
          expandedSections.push({
            name: sub.name,
            count: sub.count,
            duration: section.duration,
          });
        });
      } else {
        expandedSections.push(section);
      }
    });

    setSections(baseSections);
    setFlatSections(expandedSections);
    setCurrentSectionIndex(0);
    setQuestions([]);
    setSelectedAnswers({});
    setShowSectionMessage(false);
  }, [selectedExam, aytTrack]);

  useEffect(() => {
    if (
      flatSections.length > 0 &&
      currentSectionIndex < flatSections.length &&
      selectedExam
    ) {
      fetchQuestions(flatSections[currentSectionIndex], selectedExam);
    }
  }, [currentSectionIndex, flatSections, selectedExam]);

  async function fetchQuestions(section, examType) {
    const sectionKey = `${examType}_${section.name}`;
    if (sectionQuestions[sectionKey]) {
      setQuestions(sectionQuestions[sectionKey]);
      setSelectedAnswers(sectionAnswers[sectionKey] || {});
      return;
    }

    setLoading(true);

    const examTypeDescription = {
      tyt: "Türkiye'deki üniversiteye giriş sınavının birinci oturumu olan Temel Yeterlilik Testi (TYT)",
      ayt: "Türkiye'deki üniversiteye giriş sınavının ikinci oturumu olan Alan Yeterlilik Testi (AYT)",
      lgs: "Türkiye'deki 8. sınıf öğrencilerine yönelik yapılan Liseye Geçiş Sınavı (LGS)"
    };

    const prompt = `Sen bir ölçme değerlendirme uzmanısın. Şimdi sana bir ${examType.toUpperCase()} sınavı bölümü vereceğim. Bu sınav türüne uygun olarak, sadece geçerli JSON dizisi olarak ${section.count} adet çoktan seçmeli "${section.name}" sorusu oluştur.

Her soru ${examType.toUpperCase()} seviyesinde olmalı ve Türkiye'deki gerçek sınav sorularını andırmalı. ${examType.toUpperCase()} formatını iyi bildiğinden emin ol.

Kesinlikle geçerli JSON formatında üret. Tüm property isimlerini çift tırnak içinde yaz: "question", "options", "answer", "explanation". Aksi takdirde sistem hata verecek.

Her soru şu JSON formatında olmalı:
{
  "question": "Soru metni",
  "options": {
    "A": "Şık A",
    "B": "Şık B",
    "C": "Şık C",
    "D": "Şık D",
    "E": "Şık E"
  },
  "answer": "A",
  "explanation": "Açıklama"
}`;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await askGemini(prompt);
        const cleanedResponse = response
          .replace(/```json|```/g, "") // kod bloklarını sil
          .replace(/(\r\n|\n|\r)/gm, "") // satır sonlarını sil
          .trim();

        // JSON dizisi gibi başlayıp bitmediği durumları düzelt
        const jsonStart = cleanedResponse.indexOf("[");
        const jsonEnd = cleanedResponse.lastIndexOf("]");
        if (jsonStart === -1 || jsonEnd === -1) throw new Error("JSON formatı eksik");

        const jsonStr = cleanedResponse.slice(jsonStart, jsonEnd + 1);

        const parsed = JSON.parse(jsonStr);

        const cleanedQuestions = parsed.map((q) => ({
          question: stripHtmlTags(q.question),
          answer: stripHtmlTags(q.answer),
          explanation: q.explanation ? stripHtmlTags(q.explanation) : "",
          options: Object.fromEntries(
            Object.entries(q.options).map(([key, val]) => [key, stripHtmlTags(val)])
          )
        }));

        setSectionQuestions(prev => ({ ...prev, [sectionKey]: cleanedQuestions }));
        setSectionAnswers(prev => ({ ...prev, [sectionKey]: {} }));
        setQuestions(cleanedQuestions);
        setLoading(false);
        setShowSectionMessage(false);
        setSelectedAnswers({});
        return;

      } catch (error) {
        attempts++;
        console.warn(`JSON parse hatası (deneme ${attempts}):`, error);
        if (attempts >= maxAttempts) {
          setLoading(false);
          alert("Soru alınamadı. Lütfen tekrar deneyin.");
          return;
        }
      }
    }
  }


  function handleAnswerSelect(questionIndex, option) {
    const sectionKey = `${selectedExam}_${currentSection.name}`;
    const newAnswers = { ...selectedAnswers, [questionIndex]: option };

    setSelectedAnswers(newAnswers);
    setSectionAnswers(prev => ({ ...prev, [sectionKey]: newAnswers }));
  }

  async function goToNextSection() {
    setShowSectionMessage(true);

    // Mevcut bölümün sonuçlarını kaydet
    await calculateResults(flatSections[currentSectionIndex]);

    setTimeout(() => {
      setShowSectionMessage(false);
      setCurrentSectionIndex((prev) => prev + 1);
    }, 2000);
  }

  function stripHtmlTags(text) {
    return text.replace(/<[^>]*>/g, '');
  }

  if (!selectedExam) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card card-modern border-0 shadow-xl text-center" style={{ borderRadius: '24px' }}>
                <div className="card-body p-5">
                  <div className="gradient-bg rounded-circle d-inline-flex align-items-center justify-content-center mb-4 pulse-animation"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-clipboard-data text-white display-4"></i>
                  </div>
                  <h2 className="fw-bold mb-4">Deneme Sınavı Seçin</h2>
                  <p className="text-muted mb-5">Hangi sınav türünde deneme yapmak istiyorsunuz?</p>
                  <div className="d-flex justify-content-center gap-4 flex-wrap">
                    <button onClick={() => setSelectedExam("TYT")}
                      className="btn btn-modern btn-lg px-4 py-3 fw-bold gradient-bg text-white border-0"
                      style={{ borderRadius: '16px' }}>
                      <i className="bi bi-mortarboard me-2"></i>
                      YKS - TYT
                    </button>
                    <button onClick={() => setSelectedExam("AYT")}
                      className="btn btn-modern btn-lg px-4 py-3 fw-bold bg-success text-white border-0"
                      style={{ borderRadius: '16px' }}>
                      <i className="bi bi-book me-2"></i>
                      YKS - AYT
                    </button>
                    <button onClick={() => setSelectedExam("LGS")}
                      className="btn btn-modern btn-lg px-4 py-3 fw-bold bg-warning text-white border-0"
                      style={{ borderRadius: '16px' }}>
                      <i className="bi bi-graduation-cap me-2"></i>
                      LGS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedExam === "AYT" && !aytTrack) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card card-modern border-0 shadow-xl text-center" style={{ borderRadius: '24px' }}>
                <div className="card-body p-5">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4 pulse-animation"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-diagram-3 text-white display-4"></i>
                  </div>
                  <h2 className="fw-bold mb-4">Alan Seçin</h2>
                  <p className="text-muted mb-5">Hangi alanda sınav yapmak istiyorsunuz?</p>
                  <div className="d-flex justify-content-center gap-4 flex-wrap">
                    <button onClick={() => setAytTrack("sayısal")}
                      className="btn btn-modern btn-lg px-4 py-3 fw-bold bg-info text-white border-0"
                      style={{ borderRadius: '16px' }}>
                      <i className="bi bi-calculator me-2"></i>
                      Sayısal
                    </button>
                    <button onClick={() => setAytTrack("eşit ağırlık")}
                      className="btn btn-modern btn-lg px-4 py-3 fw-bold bg-secondary text-white border-0"
                      style={{ borderRadius: '16px' }}>
                      <i className="bi bi-balance me-2"></i>
                      Eşit Ağırlık
                    </button>
                    <button onClick={() => setAytTrack("sözel")}
                      className="btn btn-modern btn-lg px-4 py-3 fw-bold bg-danger text-white border-0"
                      style={{ borderRadius: '16px' }}>
                      <i className="bi bi-chat-quote me-2"></i>
                      Sözel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-center text-white">
          <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 floating-animation"
            style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-lightning-charge text-primary display-4"></i>
          </div>
          <h4 className="fw-bold mb-3">Sorular Hazırlanıyor...</h4>
          <div className="spinner-border text-white" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentSectionIndex >= flatSections.length) {
    return (
      <div className="min-vh-100 py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card card-modern border-0 shadow-xl text-center mb-4" style={{ borderRadius: '24px' }}>
                <div className="card-body p-5">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4 pulse-animation"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-trophy text-white display-4"></i>
                  </div>
                  <h2 className="fw-bold mb-3">Sınav Tamamlandı!</h2>
                  <p className="text-muted mb-4 fs-5">Toplam <strong>{flatSections.length}</strong> bölüm çözüldü.</p>
                  <button
                    onClick={() => {
                      setSelectedExam(null);
                      setExamSummary([]);
                    }}
                    className="btn btn-modern btn-lg px-4 py-3 fw-bold gradient-bg text-white border-0 mb-4"
                    style={{ borderRadius: '16px' }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Yeni Sınav Seç
                  </button>
                </div>
              </div>

              {/* Sınav Sonuçları */}
              {examSummary.map((section, idx) => (
                <div key={idx} className="card card-modern mb-4 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-primary text-white" style={{ borderRadius: '16px 16px 0 0' }}>
                    <h5 className="mb-0 p-3 fw-bold">{section.sectionName} - Sonuçlar</h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-around mb-4">
                      <div className="text-center">
                        <h6 className="text-success mb-1">Doğru</h6>
                        <p className="fs-4 fw-bold mb-0">{section.correct_count}</p>
                      </div>
                      <div className="text-center">
                        <h6 className="text-danger mb-1">Yanlış</h6>
                        <p className="fs-4 fw-bold mb-0">{section.wrong_count}</p>
                      </div>
                      <div className="text-center">
                        <h6 className="text-secondary mb-1">Boş</h6>
                        <p className="fs-4 fw-bold mb-0">{section.unanswered_count}</p>
                      </div>
                    </div>

                    <hr />

                    <h6 className="fw-bold mb-3">Soru Çözümleri:</h6>
                    {section.questions.map((q, i) => {
                      const userAns = section.selectedAnswers[i];
                      const isCorrect = userAns === q.answer;
                      const questionId = `${section.sectionName.replace(/\s/g, "_")}_q${i}`;
                      return (
                        <div key={i} id={questionId} className="mb-4">
                          <p className="mb-1"><strong>{i + 1}.</strong> {q.question}</p>
                          <ul className="list-unstyled">
                            {Object.entries(q.options).map(([key, val]) => (
                              <li
                                key={key}
                                className={`p-2 rounded mb-1 ${q.answer === key
                                  ? 'bg-success text-white'
                                  : userAns === key
                                    ? 'bg-danger text-white'
                                    : 'bg-light text-dark'
                                  }`}
                              >
                                <strong>{key})</strong> {val}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-1"><strong>Senin Cevabın:</strong> {userAns || "Boş"}</p>
                          <p><strong>Doğru Cevap:</strong> {q.answer}</p>
                          {q.explanation && (
                            <p className="fst-italic text-muted"><strong>Açıklama:</strong> {q.explanation}</p>
                          )}
                          <hr />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="btn btn-primary position-fixed"
                style={{
                  borderRadius: '12px',
                  top: '80px',
                  right: '20px',
                  zIndex: 1050,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                <i className="bi bi-arrow-up me-2"></i> Yukarı Git
              </button>
            </div>
          </div>
        </div>
        {/* Bölümler Açılır Buton */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPanel((prev) => !prev);
          }}
          className="btn btn-primary position-fixed"
          style={{
            top: '130px',
            right: '20px',
            zIndex: 1050,
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
          aria-label="Sınav bölümleri göster"
        >
          <i className="bi bi-list-task me-2"></i>
          Bölümler
        </button>
        {/* Açılır Panel */}
        {showPanel && (
          <div
            ref={panelRef}
            className="position-fixed bg-white shadow p-3"
            style={{
              top: '160px',
              right: '20px',
              zIndex: 1049,
              width: '280px',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <h6 className="fw-bold mb-3 text-center">Sınav Bölümleri</h6>
            {examSummary.map((section, idx) => (
              <div key={idx} className="mb-3">
                <strong>{section.sectionName}</strong>
                <ul className="list-unstyled ps-2 mb-0">
                  {section.questions.map((_, i) => (
                    <li key={i}>
                      <button
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => {
                          scrollToQuestion(section.sectionName, i);
                          setShowPanel(false);
                        }}
                      >
                        {i + 1}. Soru
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }




  const currentSection = flatSections[currentSectionIndex];

  return (
    <div className="min-vh-100 py-5" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        {/* <CountdownTimer durationInMinutes={examDurations[selectedExam]} /> */}

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card card-modern border-0 shadow-xl mb-4" style={{ borderRadius: '24px' }}>
              <div className="card-header gradient-bg text-white border-0" style={{ borderRadius: '24px 24px 0 0' }}>
                <div className="d-flex align-items-center p-4">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation"
                    style={{ width: '55px', height: '55px' }}>
                    <i className="bi bi-clipboard-data text-primary fs-4"></i>
                  </div>
                  <div>
                    <h4 className="mb-1 fw-bold">{currentSection.name} Bölümü</h4>
                    <small className="opacity-75">{currentSection.count} soru</small>
                  </div>
                </div>
              </div>
            </div>

            {showSectionMessage && (
              <div className="alert alert-success border-0 shadow-sm text-center card-modern" role="alert" style={{ borderRadius: '16px' }}>
                <i className="bi bi-check-circle-fill me-2"></i>
                {currentSection.name} bölümü tamamlandı. Bir sonraki bölüme geçiliyor...
              </div>
            )}

            {questions.length > 0 ? (
              <div className="row g-4">
                {questions.map((q, i) => (
                  <div key={i} className="col-12" id={`question-${i}`}>
                    <div className="card card-modern border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                      <div className="card-body p-4">
                        <h6 className="fw-bold mb-3">
                          {i + 1}. {stripHtmlTags(q.question)}
                        </h6>
                        <div className="row g-3">
                          {Object.entries(q.options).map(([key, val]) => (
                            <div key={key} className="col-md-6">
                              <button
                                onClick={() => handleAnswerSelect(i, key)}
                                type="button"
                                className={`btn w-100 text-start p-3 border-0 shadow-sm btn-modern ${selectedAnswers[i] === key
                                  ? 'gradient-bg text-white'
                                  : 'bg-light text-dark'
                                  }`}
                                style={{ borderRadius: '12px' }}
                              >
                                <strong className="me-2">{key})</strong> {val}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white">
                <p>Soru bulunamadı.</p>
              </div>
            )}

            <div className="d-flex justify-content-between mt-5">
              {currentSectionIndex > 0 && (
                <button
                  onClick={() => {
                    setCurrentSectionIndex(currentSectionIndex - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // sayfa en yukarı kayar
                  }}
                  className="btn btn-secondary btn-modern px-4 py-2"
                  style={{ borderRadius: '12px' }}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Önceki Bölüm
                </button>
              )}
              <button
                onClick={() => {
                  goToNextSection();
                  window.scrollTo({ top: 0, behavior: 'smooth' }); // sayfa en yukarı kayar
                }}
                className="btn btn-primary btn-modern px-4 py-2 fw-bold gradient-bg text-white border-0"
                style={{ borderRadius: '12px' }}
              >
                {currentSectionIndex === flatSections.length - 1
                  ? "Sınavı Bitir"
                  : "Sonraki Bölüm"}
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
              <ScrollToTopButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TestsPage;