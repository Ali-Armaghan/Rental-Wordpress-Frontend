import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 bg-black text-white text-center">
      <div className="text-sm">
        <span
          className="cursor-pointer"
          onClick={() =>
            window.open(
              "https://roberts670.sg-host.com/privacy-policy/",
              "_self"
            )
          }
        >
          Privacy Policy4
        </span>{" "}
        <span className="mx-2">•</span>
        <span
          className="cursor-pointer"
          onClick={() =>
            window.open(
              "https://roberts670.sg-host.com/refund_returns/",
              "_self"
            )
          }
        >
          Terms & Conditions
        </span>{" "}
      </div>
      <div className="mt-2 text-xs text-gray-300">
        © {new Date().getFullYear()} Addi & Evie Pageant Rentals
      </div>
    </footer>
  );
};

export default Footer;
