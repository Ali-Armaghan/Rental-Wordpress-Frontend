import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const categories = [
    "BEAUTY",
    "FUN FASHIONS",
    "SWIMWEAR",
    "OUTFIT OF CHOICE",
  ];

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsMobileCategoryOpen(false); // close category when opening menu
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleMobileCategoryDropdown = () => {
    setIsMobileCategoryOpen(!isMobileCategoryOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        {/* Navbar Container */}
        <div className="flex items-center justify-between px-5 py-2 h-[95px] md:h-[133.86px] relative">
          {/* Logo */}
          <div>
            <a href="https://roberts670.sg-host.com" target="_self" rel="noopener noreferrer">
              <img
                src="https://roberts670.sg-host.com/wp-content/uploads/2025/05/Addi-Evie-Logo.png"
                alt="Logo"
                className="h-[75px] w-auto md:h-[113.86px]"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-10 items-center">
            <ul className="flex items-center gap-10">
              <li>
                <a
                  href="https://roberts670.sg-host.com"
                  target="_self"
                  rel="noopener noreferrer"
                  className="text-xl font-montserrat font-semibold uppercase transition text-[#212121] hover:text-[#B02B30] hover:underline hover:decoration-[1px] hover:underline-offset-2 cursor-pointer"
                >
                  HOME
                </a>
              </li>

<li
  className="relative"
  onMouseEnter={() => setIsCategoryDropdownOpen(true)}
  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
>
  <button
    onClick={() => {
      setIsCategoryDropdownClicked(!isCategoryDropdownClicked);
      setIsCategoryDropdownOpen(true); // keep open on click
    }}
    aria-expanded={isCategoryDropdownOpen}
    className="text-xl font-montserrat font-semibold uppercase transition text-[#B02B30] underline decoration-[1px] underline-offset-10 cursor-pointer"
  >
    CATEGORIES
  </button>

  {isCategoryDropdownOpen && (
    <div className="absolute top-full left-0 bg-black text-white min-w-max rounded-md shadow-lg mt-1 z-50">
      {/* Dropdown links with sample URLs */}
      <a
        href="https://roberts670.sg-host.com/beauty-2-2/"
        className="block px-6 py-2 text-lg font-semibold w-full text-left bg-black hover:bg-[#B02B30] transition-colors cursor-pointer"
      >
        BEAUTY
      </a>
      <a
        href="https://roberts670.sg-host.com/fun-fashions/"
        className="block px-6 py-2 text-lg font-semibold w-full text-left bg-black hover:bg-[#B02B30] transition-colors cursor-pointer"
      >
        FUN FASHIONS
      </a>
      <a
        href="https://roberts670.sg-host.com/swimwear/"
        className="block px-6 py-2 text-lg font-semibold w-full text-left bg-black hover:bg-[#B02B30] transition-colors cursor-pointer"
      >
        SWIMWEAR
      </a>
      <a
        href="https://roberts670.sg-host.com/outfit-of-choice/"
        className="block px-6 py-2 text-lg font-semibold w-full text-left bg-black hover:bg-[#B02B30] transition-colors cursor-pointer"
      >
        OUTFIT OF CHOICE
      </a>
    </div>
  )}
</li>





              <li>
                <a
                  href="https://roberts670.sg-host.com/contact/"
                  target="_self"
                  rel="noopener noreferrer"
                  className="text-xl font-montserrat font-semibold uppercase transition text-[#212121] hover:text-[#B02B30] hover:underline hover:decoration-[1px] hover:underline-offset-2 cursor-pointer"
                >
                  CONTACT
                </a>
              </li>
            </ul>

            {/* Rentals Button */}
            <a
              href="https://roberts607.sg-host.com"
              target="_self"
              rel="noopener noreferrer"
              className="hidden md:inline-block py-3 px-8 text-lg font-bold cursor-pointer bg-[#B02B30] text-white rounded-full shadow-md hover:bg-red-700 transition"
            >
              Go to Rentals
            </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden z-50">
            <button
              onClick={toggleMobileMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-black shadow-md"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#FFB07C"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#FFB07C"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-black text-white fixed left-0 right-0 top-[95px] transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col px-6 py-2">
            <li>
              <a
                href="https://roberts607.sg-host.com/"
                target="_self"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="h-[40px] text-lg font-bold uppercase px-3 rounded transition hover:bg-[#B02B30] flex items-center"
              >
                HOME
              </a>
            </li>
            <li>
              <button
                onClick={toggleMobileCategoryDropdown}
                className="h-[40px] text-lg font-bold uppercase px-3 rounded transition hover:bg-[#B02B30] flex items-center justify-between w-full"
              >
                CATEGORIES
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    isMobileCategoryOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isMobileCategoryOpen && (
                <ul className="flex flex-col pl-4">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="h-[40px] text-lg font-semibold px-3 rounded transition hover:bg-[#B02B30] w-full text-left"
                        onClick={() => {
                          console.log("Selected:", category);
                          setIsMenuOpen(false);
                          setIsMobileCategoryOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <a
                href="https://roberts607.sg-host.com/contact/"
                target="_self"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="h-[40px] text-lg font-bold uppercase px-3 rounded transition hover:bg-[#B02B30] flex items-center"
              >
                CONTACT
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* Spacer to offset fixed navbar */}
      <div className="h-[95px] md:h-[133.86px]"></div>
    </>
  );
};

export default Navbar;
