import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        padding: "0.75rem 1.25rem",
        fontSize: "1rem",
        borderRadius: "8px",
        backgroundColor: "white",
        color: "black",
        fontWeight:"bold",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      ⬆
    </button>
  ) : null;
};

export default ScrollToTopButton;
