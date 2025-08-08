import React from "react";

const SoruNavigasyonu = ({ currentQuestion, setCurrentQuestion, totalQuestions, answers }) => {
  const containerStyle = {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    backdropFilter: 'blur(10px)'
  };

  const buttonStyle = (isCurrent, isAnswered) => ({
    borderRadius: "12px", 
    width: "45px", 
    height: "45px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: isCurrent ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
    transform: "translateY(0)",
    cursor: "pointer"
  });

  const handleButtonHover = (e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
  };

  const handleButtonLeave = (e, isCurrent) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = isCurrent ? "0 4px 12px rgba(0,0,0,0.15)" : "none";
  };

  // Soruları 3'lü gruplara böl
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const questionGroups = chunkArray([...Array(totalQuestions)], 4);

  return (
    <div className="soru-navigasyonu" style={containerStyle}>
      <div className="d-flex flex-column gap-2">
        <div className="text-center mb-3">
          <h6 className="fw-bold text-primary mb-1">Soru Navigasyonu</h6>
          <small className="text-muted">Soru {currentQuestion + 1} / {totalQuestions}</small>
        </div>
        
        <div className="d-flex flex-column gap-2">
          {questionGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="d-flex justify-content-center gap-2">
              {group.map((_, index) => {
                const actualIndex = groupIndex * 4 + index;
                const isAnswered = answers && answers[actualIndex + 1] !== undefined;
                const isCurrent = actualIndex === currentQuestion;
                
                return (
                  <button
                    key={actualIndex}
                    onClick={() => setCurrentQuestion(actualIndex)}
                    className={`btn btn-sm fw-bold position-relative ${
                      isCurrent 
                        ? "btn-primary gradient-bg text-white" 
                        : isAnswered 
                          ? "btn-success text-white" 
                          : "btn-outline-secondary"
                    }`}
                    style={buttonStyle(isCurrent, isAnswered)}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={(e) => handleButtonLeave(e, isCurrent)}
                  >
                    {actualIndex + 1}
                    {isAnswered && !isCurrent && (
                      <div className="position-absolute top-0 start-100 translate-middle">
                        <div className="bg-success rounded-circle" style={{ width: "8px", height: "8px" }}></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-3 rounded" style={{ 
          borderRadius: "12px",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)"
        }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-circle" style={{ 
              width: "12px", 
              height: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            }}></div>
            <small className="text-muted">Mevcut</small>
          </div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-circle" style={{ 
              width: "12px", 
              height: "12px",
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
            }}></div>
            <small className="text-muted">Cevaplandı</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="bg-secondary rounded-circle" style={{ width: "12px", height: "12px" }}></div>
            <small className="text-muted">Cevaplanmadı</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoruNavigasyonu;
