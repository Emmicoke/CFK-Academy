import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ImageSlider = () => {
  const slides = [
    {
      title: "YKS Hazırlık",
      subtitle: "Üniversite sınavına hazırlık",
      description: "TYT ve AYT konularında uzman eğitmenlerle çalışın",
      icon: "bi-graduation-cap",
      color: "primary"
    },
    {
      title: "LGS Hazırlık", 
      subtitle: "Liseye geçiş sınavına hazırlık",
      description: "8. sınıf müfredatına uygun özel dersler",
      icon: "bi-mortarboard",
      color: "success"
    },
    {
      title: "AI Destekli Öğrenme",
      subtitle: "Yapay zeka ile kişiselleştirilmiş eğitim",
      description: "Gemini AI ile sorularınızı anında yanıtlayın",
      icon: "bi-cpu",
      color: "warning"
    },
    {
      title: "Online Deneme Sınavları",
      subtitle: "Konu bazlı ve genel deneme sınavları",
      description: "Gerçek sınav deneyimi yaşayın",
      icon: "bi-file-earmark-text",
      color: "info"
    }
  ];

  return (
    <div className="w-100">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}
        style={{ width: '100%', height: '400px' }}
        className="hero-slider"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="d-flex align-items-center justify-content-center h-100 p-4">
              <div className="card h-100 w-100">
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5">
                  <div className={`bg-${slide.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4`} style={{width: '100px', height: '100px'}}>
                    <i className={`bi ${slide.icon} text-${slide.color} display-4`}></i>
                  </div>
                  <h2 className="display-6 fw-bold mb-3">{slide.title}</h2>
                  <h5 className="mb-3 text-muted">{slide.subtitle}</h5>
                  <p className="lead mb-0 text-muted">{slide.description}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
