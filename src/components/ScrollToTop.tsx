import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 320px
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 320);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      title="Scroll to top"
      className={`fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border border-amber-400/40 bg-[#0a1633]/92 text-amber-400 shadow-[0_10px_30px_rgba(6,13,34,0.45)] backdrop-blur-md transition-all duration-300 ease-out active:scale-90 hover:scale-105 hover:border-amber-300 hover:bg-[#0d1d44] hover:text-amber-300 hover:shadow-[0_12px_32px_rgba(245,158,11,0.35)] ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
          : "pointer-events-none translate-y-6 opacity-0 scale-75"
      }`}
    >
      {/* Subtle stitched inner border accent */}
      <span className="pointer-events-none absolute inset-1 rounded-xl border border-dashed border-amber-400/20" />
      
      <ArrowUp
        size={20}
        strokeWidth={2.6}
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
