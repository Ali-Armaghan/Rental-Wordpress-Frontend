import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ children, to, onClick, type, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    if (onClick) onClick();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`bg-[#B02B30] text-white px-8 py-3 rounded-full font-semibold hover:bg-brandRedDark ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;