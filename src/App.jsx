import "./App.css";
import Navbar from "./components/Navbar";
import GoToRentalButtonPage from "./pages/GoToRentalButtonPage";
import SizeSelector from "./pages/SizeSelector";
import BookingPage from "./pages/BookingPage";
import ShowProduct from "./pages/ShowProduct";
import ScrollToTop from "./components/ScrollToTop";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("selectedCategory");

    if (selectedCategory) {
      const existingCategory = localStorage.getItem("selectedCategory");
      
      // Only refresh if the category from URL is different from localStorage
      if (existingCategory !== selectedCategory) {
        localStorage.setItem("selectedCategory", selectedCategory);
        console.log("Stored category:", selectedCategory);
        
        // Refresh the page to ensure SizeSelector gets the latest values
        window.location.reload();
      }
    }
  }, []);
  
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<GoToRentalButtonPage />} />
        <Route path="/size" element={<SizeSelector />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/show-products" element={<ShowProduct />} />
      </Routes>
    </>
  );
}

export default App;