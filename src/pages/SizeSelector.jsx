import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import Popup from "../components/Popup";

const SizeSelector = () => {
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]); // dynamic sizes from WP
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load selected category from location or localStorage
  useEffect(() => {
    const fromState = location.state?.category;
    const fromStorage = localStorage.getItem("selectedCategory");
    const cat = (fromState || fromStorage || "").toString();
    setCategory(cat);
    if (cat) localStorage.setItem("selectedCategory", cat);
  }, [location.state]);

  // ✅ Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "selectedCategory") {
        const newCategory = e.newValue || "";
        setCategory(newCategory);
        // Re-fetch sizes when category changes
        if (newCategory) {
          fetchSizesForCategory(newCategory);
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);
    
    // Also check initial value in case it was set before component mounted
    const initialCategory = localStorage.getItem("selectedCategory");
    if (initialCategory) {
      setCategory(initialCategory);
      if (initialCategory) {
        fetchSizesForCategory(initialCategory);
      }
    }

    // Cleanup listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ Load previously selected size
  useEffect(() => {
    const savedSize = localStorage.getItem("selectedSize");
    if (savedSize) {
      setSize(savedSize);
    }
  }, []);

  // ✅ Fetch sizes based on category from WordPress REST API
  const fetchSizesForCategory = async (category) => {
    if (!category) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        "https://roberts670.sg-host.com/wp-json/wp/v2/product_cat?per_page=100"
      );
      const data = await res.json();

      // Filter categories that contain a number
      const filtered = data
        .map((cat) => cat.name)
        .filter((name) => /\d/.test(name)); // contains number

      setSizes(filtered);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories from WordPress REST API (initial load)
  useEffect(() => {
    const fetchCategories = async () => {
      // Check for category from localStorage on initial load
      const storedCategory = localStorage.getItem("selectedCategory");
      const currentCategory = storedCategory || category;
      
      if (!currentCategory) {
        try {
          const res = await fetch(
            "https://roberts670.sg-host.com/wp-json/wp/v2/product_cat?per_page=100"
          );
          const data = await res.json();

          // Filter categories that contain a number
          const filtered = data
            .map((cat) => cat.name)
            .filter((name) => /\d/.test(name)); // contains number

          setSizes(filtered);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // If we have a category, fetch sizes for that category
        fetchSizesForCategory(currentCategory);
      }
    };

    fetchCategories();
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!size) {
      setPopupMessage("Please select a size before continuing.");
      setShowPopup(true);
      return;
    }
    localStorage.setItem("selectedSize", size);
    if (category) localStorage.setItem("selectedCategory", category);
    console.log("Selected:", { category, size });
    navigate("/booking");
  };

  const handleBack = () => {
    navigate("/");
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 py-12 bg-[url('/src/assets/ah-cover.jpeg')]">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-orange-800 font-montserrat">
        Choose Your Size
      </h1>

      <p className="text-lg text-gray-600 mb-10 text-center max-w-xl font-montserrat">
        Please select the size that best fits you from the dropdown below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
      >
        <label
          htmlFor="size"
          className="block text-lg font-semibold mb-3 text-gray-800 font-montserrat"
        >
          Size
        </label>

        {category && (
          <div className="mb-4 text-sm text-gray-600">Category: {category}</div>
        )}

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-[53.6px] bg-gray-200 rounded-lg"></div>
          </div>
        ) : (
          <div className="relative">
            <select
              id="size"
              value={size}
              onChange={(e) => {
                const newSize = e.target.value;
                setSize(newSize);
                localStorage.setItem("selectedSize", newSize);
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-lg font-montserrat
      py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B02B30]
      focus:border-[#B02B30] transition-all duration-200 ease-in-out
      hover:border-[#B02B30] hover:shadow-md cursor-pointer"
            >
              <option value="">Select Size</option>
              {sizes.length > 0 ? (
                sizes.map((s, index) => (
                  <option key={index} value={s}>
                    {s}
                  </option>
                ))
              ) : (
                <option disabled>No size categories found</option>
              )}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#B02B30]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 space-x-4">
          <Button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 cursor-pointer"
          >
            Back
          </Button>
          <Button type="submit" className="w-32 cursor-pointer">
            Next
          </Button>
        </div>
      </form>

      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

export default SizeSelector;