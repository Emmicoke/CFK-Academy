import React, { useEffect, useState } from "react";
import { supabase } from '../lib/supabaseClient';
import { useSession } from "@supabase/auth-helpers-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { askGemini } from "../api/gemini";

const StatisticPage = () => {
    const session = useSession();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processedData, setProcessedData] = useState([]);

    // Önceki filtreler:
    const [examCategory, setExamCategory] = useState("deneme"); // "deneme" veya "sinav"
    const [examType, setExamType] = useState(""); // sınav türü (TYT, AYT, LGS vb)

    const [aiEvaluation, setAiEvaluation] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            let query = supabase.from(
                examCategory === "sinav" ? "exam_results" : "test_results"
            ).select("*").eq("user_id", session?.user?.id);

            if (examCategory === "deneme" && examType && examType !== "Tümü") {
                query = query.ilike("exam_type", examType.toLowerCase());
            }

            if (examCategory === "sinav" && examType && examType !== "Tümü") {
                query = query.ilike("exam_type", examType.toLowerCase());
            }

            const { data, error } = await query;

            if (error) {
                console.error("Veri alma hatası:", error.message);
            } else {
                
                setResults(data);
            }
            setLoading(false);
        };

        if (session?.user?.id) fetchResults();
    }, [session, examCategory, examType]);

    // Deneme sınavı için sınav türleri
    const denemeExamTypes = ["Tümü", "tyt", "ayt", "lgs"];

    // Sınav için sınav türleri
    const sinavExamTypes = ["Tümü", "yks", "lgs"];

    // Filtrelenmiş veriye göre gruplama fonksiyonu
    const groupResultsByTopic = (data) => {
        const topicMap = {};

        data.forEach((item) => {
            const key = `${item.exam_type}-${item.section_name || item.subject}-${item.topic || "Genel"}`;
            if (!topicMap[key]) {
                topicMap[key] = {
                    topic: `${(item.exam_type || "").toUpperCase()} - ${item.section_name || item.subject || ""} - ${item.topic || "Genel"}`,
                    correct: 0,
                    wrong: 0,
                    empty: 0,
                };
            }

            topicMap[key].correct += item.correct_count || item.correct || 0;
            topicMap[key].wrong += item.wrong_count || item.wrong || 0;
            topicMap[key].empty += item.unanswered_count || item.empty || 0;
        });

        const result = Object.values(topicMap).map((item) => ({
            ...item,
            accuracy: ((item.correct / (item.correct + item.wrong || 1)) * 100).toFixed(1),
        }));

        return result.sort((a, b) => b.accuracy - a.accuracy);
    };

    useEffect(() => {
        if (results.length === 0) {
            setProcessedData([]);
            setAiEvaluation("");
            return;
        }

        const filtered = results; // Zaten sorguda filtre uygulandı
        const grouped = groupResultsByTopic(filtered);
        setProcessedData(grouped);

        if (examType && examType !== "Tümü") {
            generateAiEvaluation(filtered, examType);
        } else {
            setAiEvaluation("");
        }
    }, [results, examType]);

    const generateAiEvaluation = async (data, examType) => {
        setAiLoading(true);

        let totalCorrect = 0, totalWrong = 0, totalEmpty = 0;
        data.forEach(item => {
            totalCorrect += item.correct_count || item.correct || 0;
            totalWrong += item.wrong_count || item.wrong || 0;
            totalEmpty += item.unanswered_count || item.empty || 0;
        });

        const accuracy = ((totalCorrect / (totalCorrect + totalWrong || 1)) * 100).toFixed(1);

        const prompt = `Kullanıcının ${examType.toUpperCase()} sınav sonuçlarına göre değerlendirme yap:
Toplam Doğru: ${totalCorrect}
Toplam Yanlış: ${totalWrong}
Toplam Boş: ${totalEmpty}
Başarı Oranı: %${accuracy}

Güçlü ve zayıf yönlerini belirt, genel seviyesini değerlendir. Ayrıca tahmini puan ve sıralama bilgisi de ver. Cevabını kısa ve anlaşılır yap.`;

        try {
            const response = await askGemini(prompt);
            const cleanedResponse = response
                .replace(/```/g, "")
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .trim();
            setAiEvaluation(cleanedResponse);
        } catch (error) {
            setAiEvaluation("Yapay zeka değerlendirmesi alınamadı.");
            console.error("AI değerlendirme hatası:", error);
        }

        setAiLoading(false);
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div className="text-center text-white">
                    <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 floating-animation" 
                         style={{width: '80px', height: '80px'}}>
                        <i className="bi bi-lightning-charge text-primary display-4"></i>
                    </div>
                    <h4 className="fw-bold mb-3">İstatistikler Yükleniyor...</h4>
                    <div className="spinner-border text-white" role="status" style={{width: '3rem', height: '3rem'}}>
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div className="text-center text-white">
                    <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 pulse-animation" 
                         style={{width: '80px', height: '80px'}}>
                        <i className="bi bi-exclamation-triangle text-warning display-4"></i>
                    </div>
                    <h4 className="fw-bold mb-3">Giriş Gerekli</h4>
                    <p className="opacity-75">İstatistikleri görüntülemek için lütfen giriş yapınız.</p>
                </div>
            </div>
        );
    }

    if (processedData.length === 0) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card card-modern border-0 shadow-xl text-center" style={{borderRadius: '24px'}}>
                                <div className="card-body p-5">
                                    <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-4 pulse-animation" 
                                         style={{width: '80px', height: '80px'}}>
                                        <i className="bi bi-graph-up text-white display-4"></i>
                                    </div>
                                    <h3 className="fw-bold mb-3">Henüz İstatistik Yok</h3>
                                    <p className="text-muted mb-4">Sınav sonuçlarınız burada görüntülenecek.</p>
                                    <button onClick={() => window.location.reload()} 
                                            className="btn btn-modern btn-lg px-4 py-3 fw-bold gradient-bg text-white border-0" 
                                            style={{borderRadius: '16px'}}>
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Yenile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 py-5" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="card card-modern border-0 shadow-xl mb-4" style={{borderRadius: '24px'}}>
                            <div className="card-header gradient-bg text-white border-0" style={{borderRadius: '24px 24px 0 0'}}>
                                <div className="d-flex align-items-center p-4">
                                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation" 
                                         style={{width: '55px', height: '55px'}}>
                                        <i className="bi bi-graph-up text-primary fs-4"></i>
                                    </div>
                                    <div>
                                        <h3 className="mb-1 fw-bold">İstatistikler</h3>
                                        <small className="opacity-75">Performans analizi ve değerlendirmeler</small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-5">
                                {/* Kategori seçimi */}
                                <div className="row g-4 mb-5">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark">
                                            <i className="bi bi-funnel me-2 text-primary"></i>
                                            Sınav Kategorisi
                                        </label>
                                        <select
                                            className="form-select border-0 shadow-sm btn-modern"
                                            value={examCategory}
                                            onChange={(e) => {
                                                setExamCategory(e.target.value);
                                                setExamType(""); // resetle
                                                setProcessedData([]);
                                                setAiEvaluation("");
                                            }}
                                            style={{borderRadius: '12px'}}
                                        >
                                            <option value="deneme">Deneme</option>
                                            <option value="sinav">Özel Sınav</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark">
                                            <i className="bi bi-mortarboard me-2 text-primary"></i>
                                            Sınav Türü
                                        </label>
                                        <select
                                            className="form-select border-0 shadow-sm btn-modern"
                                            value={examType}
                                            onChange={(e) => setExamType(e.target.value)}
                                            disabled={!examCategory}
                                            style={{borderRadius: '12px'}}
                                        >
                                            {(examCategory === "deneme" ? denemeExamTypes : sinavExamTypes).map((type) => (
                                                <option key={type} value={type}>
                                                    {type.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Grafik */}
                                <div className="card card-modern border-0 shadow-sm mb-5" style={{borderRadius: '16px'}}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4">Performans Grafiği</h5>
                                        <ResponsiveContainer width="100%" height={420}>
                                            <BarChart
                                                data={processedData}
                                                margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="topic"
                                                    interval={0}
                                                    tick={{
                                                        angle: 0,
                                                        fontSize: 12,
                                                        wordBreak: "break-word",
                                                        whiteSpace: "normal",
                                                    }}
                                                    height={80}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="correct" fill="#22c55e" name="Doğru" />
                                                <Bar dataKey="wrong" fill="#ef4444" name="Yanlış" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Başarı oranı tablosu */}
                                <div className="card card-modern border-0 shadow-sm mb-5" style={{borderRadius: '16px'}}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4">Konu Başarı Oranları</h5>
                                        <div className="table-responsive">
                                            <table className="table table-hover text-center align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="fw-bold">Konu</th>
                                                        <th className="fw-bold text-success">Doğru</th>
                                                        <th className="fw-bold text-danger">Yanlış</th>
                                                        <th className="fw-bold text-warning">Boş</th>
                                                        <th className="fw-bold text-primary">Başarı %</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {processedData.map((item) => {
                                                        const accuracy = parseFloat(item.accuracy);
                                                        let rowClass = "";                                                        

                                                        if (accuracy >= 80) rowClass = "table-success";
                                                        else if (accuracy >= 50) rowClass = "table-warning";
                                                        else rowClass = "table-danger";

                                                        return (
                                                            <tr key={item.topic} className={rowClass}>
                                                                <td className="text-start fw-medium">{item.topic}</td>
                                                                <td className="fw-bold text-success">{item.correct}</td>
                                                                <td className="fw-bold text-danger">{item.wrong}</td>
                                                                <td className="fw-bold text-warning">{item.empty}</td>
                                                                <td className="fw-bold text-primary">{item.accuracy}%</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Yapay Zeka Değerlendirmesi */}
                                <div className="card card-modern border-0 shadow-sm" style={{borderRadius: '16px'}}>
                                    <div className="card-header bg-info text-white border-0" style={{borderRadius: '16px 16px 0 0'}}>
                                        <div className="d-flex align-items-center p-3">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 pulse-animation" 
                                                 style={{width: '45px', height: '45px'}}>
                                                <i className="bi bi-robot text-info"></i>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 fw-bold">Yapay Zeka Değerlendirmesi</h5>
                                                <small className="opacity-75">AI destekli performans analizi</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        {aiLoading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary mb-3" role="status">
                                                    <span className="visually-hidden">Yükleniyor...</span>
                                                </div>
                                                <p className="text-muted">Değerlendirme yapılıyor...</p>
                                            </div>
                                        ) : aiEvaluation ? (
                                            <div className="fst-normal text-secondary" style={{ 
                                                whiteSpace: "pre-wrap", 
                                                fontSize: "1rem", 
                                                fontFamily: "Arial, sans-serif",
                                                lineHeight: '1.6'
                                            }}>
                                                {aiEvaluation}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <i className="bi bi-info-circle text-muted display-4 mb-3"></i>
                                                <p className="text-muted">Sınav türü seçiniz ve veriler yüklendiğinde burada değerlendirme görünecek.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticPage;
