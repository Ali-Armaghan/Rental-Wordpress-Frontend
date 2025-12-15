import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RentalBgImg from "../assets/GoToRentalButtonImgs/ah-cover.jpeg";
import AddiEvieLogo from "../assets/GoToRentalButtonImgs/Addi&EvieLogo.png";
import RentalButton from "../components/RentalButton";
import Footer from "../components/Footer";
import Button from "./Button";

const GoToRentalButtonPage = () => {
  // Static categories instead of fetching from API
  const categories = [
    { name: "BEAUTY", slug: "parentbeauty" },
    { name: "FUN FASHION", slug: "parentfunfashion" },
    { name: "SWIM", slug: "parentswim" },
    { name: "OCC", slug: "parentooc" }
  ];
  
  const navigate = useNavigate();

  const handleQuickLinkClick = (categorySlug) => {
    localStorage.setItem("selectedCategory", categorySlug);
    navigate("/size", { state: { category: categorySlug } });
  };

  const aboutUsParagraphs = [
    "Founded by pageant parents who had experienced the benefits of renting firsthand, Addi & Evie Pageant Rentals was born out of a desire to make beautiful pageant wear accessible to all families.",
    "Named after our daughters, Addi Jean and Evie Jade, we understand the pageant journey from both sides.",
    "We offer one of the largest selections of pageant wear for rent nationwide, with styles for every competition category.",
    "Our mission is straightforward: to provide gorgeous, high-quality pageant attire at affordable prices, backed by exceptional service.",
  ];

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${RentalBgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "700px",
        }}
        className="py-[50px] md:px-[120px] px-10 flex flex-col justify-center"
      >
        <div className="space-y-10">
          <h1 className="md:text-[45px] text-4xl font-bold text-primary text-center text-orange-800">
            Choose Your Rental Category
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-6">
            {categories.map((cat, i) => (
              <RentalButton
                key={i}
                label={cat.name}
                onClick={() => handleQuickLinkClick(cat.slug)}
                className="cursor-pointer whitespace-nowrap"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center px-4 md:px-10 py-16 gap-10 bg-[#DAAAAB] items-center lg:items-start">
        <div>
          <div className="relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
              <img src={AddiEvieLogo} alt="Logo" className="w-32 h-32" />
            </div>

            <div className="bg-black text-white pt-28 pb-10 px-10 rounded-2xl md:w-[380px] w-[310px] text-center space-y-7 shadow-lg">
              <h1 className="text-2xl font-bold">
                Addi & Evie <br /> Pageant Rentals
              </h1>
              <p className="text-xl">Nationwide Shipping</p>
              <p className="text-lg font-semibold leading-tight">
                Shine Bright, <br />
                <span className="inline-block mt-2">Spend Right</span>
              </p>
            </div>
          </div>

          <p className="text-center text-xl text-white space-x-2 mt-2">
            <span
              className="cursor-pointer"
              onClick={() =>
                window.open(
                  "https://roberts670.sg-host.com/privacy-policy/",
                  "_self"
                )
              }
            >
              Privacy Policy
            </span>
            <span>•</span>
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
            </span>
          </p>
        </div>

        <div className="text-[#212121] lg:max-w-[500px] w-full text-center lg:text-left">
          <h1 className="md:text-xl text-2xl font-bold mb-4">About Us</h1>
          <div className="text-white leading-relaxed space-y-4 text-xl">
            {aboutUsParagraphs.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GoToRentalButtonPage;
