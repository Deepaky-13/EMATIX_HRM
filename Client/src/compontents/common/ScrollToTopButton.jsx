import React from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className="
        fixed bottom-6 right-6 z-50
        bg-gray-800 text-white p-3 rounded-full shadow-lg
        hover:bg-gray-700 transition
        group
      "
      aria-label="Scroll to top"
    >
      <FaArrowUp className="text-xl" />
      {/* Tooltip */}
      <span
        className="
        absolute bottom-12 right-0
        opacity-0 group-hover:opacity-100
        bg-gray-700 text-white text-xs py-1 px-2 rounded
        transition
      "
      >
        Back to top
      </span>
    </button>
  );
};

export default ScrollToTopButton;
