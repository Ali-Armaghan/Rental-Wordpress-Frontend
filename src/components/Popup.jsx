import React from "react";

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-4">
            {message}
          </div>
          <button
            onClick={onClose}
            className="bg-[#B02B30] text-white px-6 py-2 rounded-full font-semibold hover:bg-brandRedDark transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;