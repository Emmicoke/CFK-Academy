import { useState, useEffect, useRef } from 'react';
import { askGemini } from '../api/gemini';
import { supabase } from '../lib/supabaseClient';
import SoruNavigasyonu from './SoruNavigasyonu';

const Exams = ({ user }) => {
  const [selectedExam, setSelectedExam] = useState('yks');
  const [selectedSubject, setSelectedSubject] = useState('matematik');
  const [selectedLevel, setSelectedLevel] = useState('orta');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [results, setResults] = useState(null);

  const [secondsPassed, setSecondsPassed] = useState(0);
  const timerRef = useRef(null);

  const examTypes = {
    yks: 'YKS',
    lgs: 'LGS'
  };

  const subjectsMap = {
    yks: {
      matematik: 'Matematik',
      fizik: 'Fizik',
      kimya: 'Kimya',
      biyoloji: 'Biyoloji',
      turkce: 'Türkçe',
      tarih: 'Tarih',
      cografya: 'Coğrafya',
      felsefe: 'Felsefe'
    },
    lgs: {
      turkce: 'Türkçe',
      matematik: 'Matematik',
      fen: 'Fen Bilimleri',
      inkilap: 'T.C. İnkılap Tarihi ve Atatürkçülük',
      din: 'Din Kültürü ve Ahlak Bilgisi',
      ingilizce: 'İngilizce'
    }
  };

  const levels = {
    kolay: 'Kolay',
    orta: 'Orta',
    zor: 'Zor'
  };

  useEffect(() => {
    if (exam && !showResults) {
      timerRef.current = setInterval(() => {
        setSecondsPassed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [exam, showResults]);

  const generateExam = async () => {
    setLoading(true);
    setExam(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    setSecondsPassed(0);

    const prompt = `
${examTypes[selectedExam]} sınavı için "${subjectsMap[selectedExam][selectedSubject]}" dersinde, "${levels[selectedLevel]}" seviyesinde, ${questionCount} soruluk bir deneme sınavı hazırla.

${customPrompt ? `Kullanıcının belirttiği özel konu: ${customPrompt}. Bu konuya odaklan.` : ""}

Yanıtı yalnızca JSON formatında ve tek satır olarak, stringlerde satır sonları için \\n kullanarak ver. Her sorunun "id" alanı benzersiz olmalı. Örnek format:

{
  "title": "Sınav başlığı",
  "questions": [
    {
      "id": 1,
      "question": "Soru metni",
      "options": {
        "A": "Seçenek A",
        "B": "Seçenek B",
        "C": "Seçenek C",
        "D": "Seçenek D",
        "E": "Seçenek E"
      },
      "correct": "A",
      "explanation": "Cevabın açıklaması"
    }
  ]
}
`;



    try {
      const response = await askGemini(prompt);
      const cleanedResponse = response
        .replace(/```json|```/g, "") // kod bloklarını sil
        .replace(/(\r\n|\n|\r)/gm, "") // satır sonlarını sil
        .trim();

      // Gemini cevabından JSON kısmını ayıkla
      // const match = cleanedResponse.match(/```json[\s\n]*([\s\S]*?)```/);
      // let jsonString = match ? match[1] : cleanedResponse;

      // Trim ile baştan ve sondan boşlukları sil
      // jsonString = jsonString.trim();

      // BOM karakterini kaldır (varsa)
      // jsonString = jsonString.replace(/^\uFEFF/, '');
      // jsonString = jsonString.replace(/\r?\n/g, '\\n');
      // jsonString = jsonString.replace(/\\?"/g, '\\"');
      // jsonString = jsonString.replace(/'/g, '"');

      let examData;

      try {
        examData = JSON.parse(cleanedResponse);
      } catch (error) {
        console.error('Gemini JSON parse hatası:', error, '\nYanıt:', jsonString);
        alert('Sınav formatı tanınamadı. Lütfen tekrar oluşturmayı deneyin.');
        setLoading(false);
        return;
      }

      if (!examData.questions || !Array.isArray(examData.questions)) {
        alert('Geçersiz sınav formatı. Lütfen tekrar deneyin.');
        setLoading(false);
        return;
      }

      // Soruların id'lerinin benzersiz olduğunu kontrol et
      const ids = examData.questions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
        alert('Soru ID\'leri benzersiz olmalı. Lütfen tekrar deneyin.');
        setLoading(false);
        return;
      }

      setExam(examData);
    } catch (error) {
      console.error('Sınav oluşturulurken hata:', error);
      alert('Sınav oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const saveResultsToSupabase = async (resultsData) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('exam_results').insert(resultsData);
      if (error) console.error('Supabase kayıt hatası:', error);
    } catch (err) {
      console.error('Kayıt hatası:', err);
    }
  };

  const calculateResults = async () => {
    let correct = 0;
    const topicResults = [];

    exam.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      var isItWhat = "";
      if (userAnswer == null) isItWhat = "Empty";
      else if (userAnswer === q.correct) isItWhat = "Correct";
      else isItWhat = "Wrong";

      if (isItWhat === "Correct") correct++;
      topicResults.push({
        user_id: user.id,
        exam_type: selectedExam,
        subject: selectedSubject,
        topic: q.topic || 'Genel',
        correct: isItWhat === "Correct" ? 1 : 0,
        wrong: isItWhat === "Wrong" ? 1 : 0,
        date: new Date().toISOString(),
        empty: isItWhat === "Empty" ? 1 : 0,
      });
    });

    await saveResultsToSupabase(topicResults);

    setResults({
      score: Math.round((correct / exam.questions.length) * 100),
      correct,
      total: exam.questions.length,
      answers,
      time: secondsPassed,
    });
    setShowResults(true);
  };

  const resetExam = () => {
    setExam(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    setSecondsPassed(0);
  };

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const subjects = subjectsMap[selectedExam];

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        {!exam && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card card-modern border-0 shadow-xl" style={{ borderRadius: '24px' }}>
                <div className="card-header gradient-bg text-white border-0" style={{ borderRadius: '24px 24px 0 0' }}>
                  <div className="d-flex align-items-center p-4">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation"
                      style={{ width: '55px', height: '55px' }}>
                      <i className="bi bi-file-earmark-text text-primary fs-4"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold">Özel Sınav Oluştur</h4>
                      <small className="opacity-75">AI destekli kişiselleştirilmiş sınavlar</small>
                    </div>
                  </div>
                </div>
                <div className="card-body p-5">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-mortarboard me-2 text-primary"></i>
                        Sınav Türü
                      </label>
                      <select
                        className="form-select border-0 shadow-sm btn-modern"
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        style={{ borderRadius: '12px' }}
                      >
                        {Object.entries(examTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-book me-2 text-primary"></i>
                        Ders
                      </label>
                      <select
                        className="form-select border-0 shadow-sm btn-modern"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{ borderRadius: '12px' }}
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
                        <i className="bi bi-bar-chart me-2 text-primary"></i>
                        Seviye
                      </label>
                      <select
                        className="form-select border-0 shadow-sm btn-modern"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        style={{ borderRadius: '12px' }}
                      >
                        {Object.entries(levels).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-hash me-2 text-primary"></i>
                        Soru Sayısı
                      </label>
                      <input
                        className="form-control border-0 shadow-sm btn-modern"
                        type="number"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        min={1}
                        max={50}
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mx-auto" style={{ marginTop: '20px' }}>
                      <div className="card p-3 shadow-sm">
                        <label className="form-label fw-bold">
                          Konuya Özel İfade (isteğe bağlı)
                        </label>
                        <textarea
                          className="form-control"
                          placeholder="örnek: üslü sayılar, dünya savaşları, sözcük türleri..."
                          rows={6}
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                        ></textarea>
                        <div className="form-text mt-2">
                          Bu alana bir konu girerseniz, oluşturulan sorular bu konuya odaklanacaktır.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-5">
                    <button
                      onClick={generateExam}
                      className="btn btn-modern btn-lg px-5 py-3 fw-bold gradient-bg text-white border-0"
                      disabled={loading}
                      style={{ borderRadius: '16px' }}
                    >
                      {loading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                          <span>Sınav Oluşturuluyor...</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="bi bi-magic me-2"></i>
                          <span>Sınav Oluştur</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {exam && !showResults && (
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="card card-modern border-0 shadow-xl" style={{ borderRadius: '24px' }}>
                <div className="card-header gradient-bg text-white border-0" style={{ borderRadius: '24px 24px 0 0' }}>
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h4 className="mb-1 fw-bold">{exam.title}</h4>
                      <small className="opacity-75">
                        Soru {currentQuestion + 1} / {exam.questions.length}
                      </small>
                    </div>
                    <div className="glass-effect rounded-pill px-4 py-2">
                      <i className="bi bi-clock me-2"></i>
                      <span className="fw-bold">{formatTime(secondsPassed)}</span>
                    </div>
                  </div>
                </div>

                <div className="card-body p-5">
                  <div className="row">
                    {/* Sol taraf - Soru içeriği */}
                    <div className="col-lg-9">
                      <h5 className="mb-4 fw-bold">
                        {currentQuestion + 1}. {exam.questions[currentQuestion].question}
                      </h5>

                      <div className="row g-3">
                        {Object.entries(exam.questions[currentQuestion].options).map(
                          ([key, value]) => (
                            <div key={key} className="col-md-6">
                              <button
                                className={`btn w-100 text-start p-4 border-0 shadow-sm btn-modern ${answers[exam.questions[currentQuestion].id] === key
                                  ? 'gradient-bg text-white'
                                  : 'bg-light text-dark'
                                  }`}
                                onClick={() =>
                                  handleAnswer(exam.questions[currentQuestion].id, key)
                                }
                                style={{ borderRadius: '16px' }}
                              >
                                <strong className="me-2">{key}.</strong> {value}
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <div className="d-flex justify-content-between mt-5">
                        <button
                          className="btn btn-secondary btn-modern px-4 py-2"
                          onClick={() =>
                            setCurrentQuestion((prev) => Math.max(0, prev - 1))
                          }
                          disabled={currentQuestion === 0}
                          style={{ borderRadius: '12px' }}
                        >
                          <i className="bi bi-arrow-left me-2"></i>Önceki
                        </button>

                        {currentQuestion === exam.questions.length - 1 ? (
                          <button className="btn btn-success btn-modern px-4 py-2 fw-bold gradient-bg text-white border-0"
                            onClick={calculateResults}
                            style={{ borderRadius: '12px' }}>
                            <i className="bi bi-check-circle me-2"></i>Sınavı Bitir
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-modern px-4 py-2 gradient-bg text-white border-0"
                            onClick={() => setCurrentQuestion((prev) => prev + 1)}
                            style={{ borderRadius: '12px' }}
                          >
                            Sonraki<i className="bi bi-arrow-right ms-2"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sağ taraf - Soru navigasyonu */}
                    <div className="col-lg-3">
                      <div className="sticky-top" style={{ top: '20px' }}>
                        <SoruNavigasyonu
                          currentQuestion={currentQuestion}
                          setCurrentQuestion={setCurrentQuestion}
                          totalQuestions={exam.questions.length}
                          answers={answers}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showResults && results && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card card-modern border-0 shadow-xl" style={{ borderRadius: '24px' }}>
                <div className="card-header bg-success text-white border-0" style={{ borderRadius: '24px 24px 0 0' }}>
                  <div className="d-flex align-items-center p-4">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation"
                      style={{ width: '55px', height: '55px' }}>
                      <i className="bi bi-trophy text-success fs-4"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold">Sınav Sonuçları</h4>
                      <small className="opacity-75">Performansınızı görüntüleyin</small>
                    </div>
                  </div>
                </div>
                <div className="card-body p-5">
                  <div className="text-center mb-5">
                    <div className="gradient-bg rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{ width: '120px', height: '120px' }}>
                      <h1 className="text-white fw-bold mb-0">{results.score}%</h1>
                    </div>
                    <h3 className="fw-bold mb-2">{results.correct} doğru / {results.total} soru</h3>
                    <p className="text-muted mb-3">Süre: {formatTime(results.time)}</p>
                    <div className="progress mb-4" style={{ height: '12px', borderRadius: '8px' }}>
                      <div
                        className="progress-bar gradient-bg"
                        style={{ width: `${results.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="row g-4">
                    {exam.questions.map((question, index) => (
                      <div key={question.id} className="col-12">
                        <div className={`card card-modern border-0 shadow-sm ${results.answers[question.id] === question.correct
                          ? 'border-success'
                          : 'border-danger'
                          }`} style={{ borderRadius: '16px' }}>
                          <div className="card-body p-4">
                            <h6 className="card-title fw-bold mb-3">Soru {index + 1}</h6>
                            <p className="card-text mb-3">{question.question}</p>

                            <div className="row g-3">
                              {Object.entries(question.options).map(([key, value]) => (
                                <div key={key} className="col-md-6">
                                  <div
                                    className={`p-3 rounded ${results.answers[question.id] === key
                                      ? key === question.correct
                                        ? 'bg-success text-white'
                                        : 'bg-danger text-white'
                                      : key === question.correct
                                        ? 'gradient-bg text-white'
                                        : 'bg-light'
                                      }`}
                                    style={{ borderRadius: '12px' }}
                                  >
                                    <strong>{key}.</strong> {value}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 p-3 bg-light rounded" style={{ borderRadius: '12px' }}>
                              <small className="text-muted">
                                <strong>Açıklama:</strong> {question.explanation}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-5">
                    <button className="btn btn-modern btn-lg px-5 py-3 fw-bold gradient-bg text-white border-0"
                      onClick={resetExam}
                      style={{ borderRadius: '16px' }}>
                      <i className="bi bi-arrow-left me-2"></i>Yeni Sınav Oluştur
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
