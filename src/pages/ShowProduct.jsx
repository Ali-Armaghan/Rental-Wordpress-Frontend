import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const toApiCategory = (cat) => {
  if (!cat) return "";
  const normalized = cat.toString().trim().toLowerCase();
  const map = {
    beauty: "beauty",
    "fun fashion": "funfashions",
    "fun-fashion": "funfashions",
    swimwear: "swimwear",
    "outfit of choice": "outfitofchoice",
    "outfit-of-choice": "outfitofchoice",
  };
  return map[normalized] || normalized.replace(/\s+/g, "").replace(/-+/g, "");
};

const toApiSize = (size) => {
  if (!size) return "";
  const normalized = size.toString().trim().toLowerCase();
  // Accept either slash or hyphen separators and standardize to hyphen
  const hyphenated = normalized.replace(/\s*/g, "").replace("/", "-");
  // Whitelist allowed ranges; otherwise return as-is to avoid breaking unknown future sizes
  const allowed = new Set([
    "0-9",
    "6-12",
    "12-2",
    "18-3",
    "2-4",
    "3-5",
    "4-6",
    "5-7",
    "6-8",
    "7-8",
    "10-12",
  ]);
  return allowed.has(hyphenated) ? hyphenated : hyphenated;
};

// Helper function to strip HTML and truncate text
const truncateDescription = (html, wordLimit) => {
  if (!html) return "No description available";

  // Create a temporary element to strip HTML
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  const plainText = tempElement.textContent || tempElement.innerText || "";

  // Split into words and truncate
  const words = plainText.trim().split(/\s+/);
  if (words.length <= wordLimit) {
    return plainText;
  }

  return words.slice(0, wordLimit).join(' ') + '...';
};

// Helper function to strip HTML and truncate by character count
const truncateDescriptionByChars = (html, charLimit) => {
  if (!html) return "No description available";

  // Create a temporary element to strip HTML
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  const plainText = tempElement.textContent || tempElement.innerText || "";

  // Truncate by character count
  if (plainText.length <= charLimit) {
    return plainText;
  }

  return plainText.substring(0, charLimit) + '...';
};

// Helper function to safely extract brand name
const getBrandName = (product) => {
  if (!product || !product.brand) return "N/A";

  // Try different possible property names
  if (product.brand.name) return product.brand.name;
  if (product.brand.Name) return product.brand.Name;

  // If brand exists but no name property, stringify it for debugging
  console.log("Brand object:", product.brand);
  return "N/A";
};

// Helper to format category name for display
const formatCategoryName = (cat) => {
  if (!cat) return "";
  const normalized = cat.toLowerCase();
  const map = {
    parentbeauty: "Beauty",
    parentfunfashion: "Fun Fashion",
    parentswim: "Swim",
    parentooc: "Outfit of Choice",
  };
  return map[normalized] || cat;
};

const ShowProduct = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Debugging: Log selectedProduct when it changes
  useEffect(() => {
    if (selectedProduct) {
      console.log("Selected Product:", selectedProduct);
      console.log("Brand Info:", selectedProduct.brand);
      console.log("Brand Name:", selectedProduct.brand_name);
    }
  }, [selectedProduct]);
  const navigate = useNavigate();

  const readCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : "";
  };

  const startDate = useMemo(
    () => localStorage.getItem("selectedStartDate") || "",
    []
  );
  const endDate = useMemo(
    () => localStorage.getItem("selectedEndDate") || "",
    []
  );
  const category = useMemo(
    () => localStorage.getItem("selectedCategory") || "",
    []
  );
  const size = useMemo(() => localStorage.getItem("selectedSize") || "", []);

  useEffect(() => {
    // Prefer localStorage values; fall back to cookies if missing
    const rawStart = startDate || readCookie("s_date");
    const rawEnd = endDate || readCookie("e_date");
    // Normalize to dashed format expected by many backends: yyyy-MM-dd
    const s_date = (rawStart || "").replace(/\//g, "-");
    const e_date = (rawEnd || "").replace(/\//g, "-");
    const cat = toApiCategory(category);
    const sz = toApiSize(size);

    if (!s_date || !e_date || !cat || !sz) {
      setError("Missing selection data. Please reselect.");
      setLoading(false);
      return;
    }

    const url = `https://roberts670.sg-host.com/wp-json/custom-api/v1/available-products?s_date=${encodeURIComponent(
      s_date
    )}&e_date=${encodeURIComponent(e_date)}&category=${encodeURIComponent(
      `${cat},${sz}`
    )}&_t=${new Date().getTime()}`;

    console.log("Fetching URL:", url);

    let isMounted = true;
    setLoading(true);
    setError("");
    axios
      .get(url)
      .then((res) => {
        if (!isMounted) return;
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError("Failed to load products.", err);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate, category, size]);

  const handleBack = () => {
    navigate("/booking");
  };

  return (
    <div className="min-h-screen  bg-cover bg-center bg-[url('/src/assets/ah-cover.jpeg')]">
      <div className="max-w-6xl mx-auto p-6 ">
        {/* Back Button */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 cursor-pointer"
          >
            Back
          </Button>
          {(category || size) && (
            <div className="text-xl font-bold text-orange-800 flex items-center gap-2">
              {category && <span className="capitalize">/ {formatCategoryName(category)}</span>}
              {category && size && <span className="text-orange-800">/ </span>}
              {size && <span>Size: {size}</span>}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6 text-orange-800">
          Available Products
        </h1>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 min-[530px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="border p-4 rounded-lg bg-white shadow animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded">
            {error}
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <div className="grid grid-cols-1 min-[530px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <div
                key={idx}
                className="border p-4 rounded-lg shadow hover:shadow-lg bg-white cursor-pointer"
                onClick={() => {
                  setSelectedProduct(p);
                  setActiveImageIndex(0);
                }}
              >
                <div className="w-full aspect-square bg-white rounded  overflow-hidden mb-4 flex items-center justify-center">
                  <img
                    src={
                      (p.image_urls && p.image_urls[0]) ||
                      p.image ||
                      p.img ||
                      p.product_image ||
                      ""
                    }
                    alt={p.name || p.title || "Product"}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {p.name || p.title || "Unnamed"}
                    </h3>
                    <p className="text-gray-700">
                      {p.price ? `$${p.price}` : ""}
                    </p>
                  </div>
                  <button className="bg-[#B02B30] p-2 rounded hover:bg-[#9e2627]">
                    <ShoppingCartIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center text-gray-600 py-10">
                No products available for the selected options.
              </div>
            )}
          </div>
        )}
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-[92%] max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6 z-10">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black cursor-pointer"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="w-full aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center relative">
                  {/* Left Arrow */}
                  {selectedProduct.image_urls &&
                    selectedProduct.image_urls.length > 1 && (
                      <button
                        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-10`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) =>
                            prev === 0
                              ? selectedProduct.image_urls.length - 1
                              : prev - 1
                          );
                        }}
                      >
                        ←
                      </button>
                    )}

                  <img
                    src={
                      (selectedProduct.image_urls &&
                        selectedProduct.image_urls[activeImageIndex]) ||
                      selectedProduct.image ||
                      selectedProduct.img ||
                      selectedProduct.product_image ||
                      ""
                    }
                    alt={
                      selectedProduct.name || selectedProduct.title || "Product"
                    }
                    className="w-full h-full object-contain"
                  />

                  {/* Right Arrow */}
                  {selectedProduct.image_urls &&
                    selectedProduct.image_urls.length > 1 && (
                      <button
                        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-10`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) =>
                            prev === selectedProduct.image_urls.length - 1
                              ? 0
                              : prev + 1
                          );
                        }}
                      >
                        →
                      </button>
                    )}
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {(selectedProduct.image_urls || []).map((url, i) => (
                    <button
                      key={i}
                      className={`h-16 w-16 rounded border ${i === activeImageIndex
                        ? "border-[#B02B30]"
                        : "border-gray-300"
                        } overflow-hidden flex-shrink-0`}
                      onClick={() => setActiveImageIndex(i)}
                    >
                      <img
                        src={url}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedProduct.name || selectedProduct.title || "Product"}
                </h2>
                <div className="text-xl text-[#B02B30] font-semibold mb-4">
                  {selectedProduct.price ? `$${selectedProduct.price}` : ""}
                </div>
                <div className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {truncateDescriptionByChars(
                    selectedProduct.description,
                    120
                  )}
                  {(selectedProduct.description) && (
                    <a
                      href={selectedProduct.link || selectedProduct.url || "#"}
                      target=""
                      rel="noopener noreferrer"
                      className="text-blue-600 underline ml-2"
                    >
                      See more
                    </a>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-bold ">DESIGNER:</span> <span className="font-bold text-[#B02B30]">{selectedProduct.brand_name || "N/A"}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-bold ">SKU:</span> <span className="font-bold text-[#B02B30]">{selectedProduct.sku || "N/A"}</span>
                </div>
                <div className="text-sm text-gray-600 mb-6">
                  <span className="font-bold">SIZE:</span> <span>{size || "None"}</span>
                </div>
                <div className="mt-auto">
                  <a
                    href={selectedProduct.link || selectedProduct.url || "#"}
                    className="block text-center w-full bg-[#B02B30] hover:bg-[#9e2627] text-white font-semibold py-3 rounded-lg"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowProduct;
