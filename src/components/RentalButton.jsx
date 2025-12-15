import React from "react";

const RentalButton = ({ label, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-[230px] py-5 px-10 bg-[#B02B30] text-white rounded-full shadow-md font-semibold hover:bg-[#9e2627] transition text-center ${className}`}
    >
      {label}
    </button>
  );
};

export default RentalButton;
