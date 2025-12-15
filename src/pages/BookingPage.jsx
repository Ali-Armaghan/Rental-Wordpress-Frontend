import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Popup from "../components/Popup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { format } from "date-fns";

const isFriday = (date) => date && date.getDay && date.getDay() === 5;
const isSaturday = (date) => date && date.getDay && date.getDay() === 6;
const isSunday = (date) => date && date.getDay && date.getDay() === 0;
const startOfWeekMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay() || 7; // Sunday => 7
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
};
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const sameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getThisWeekFriday = (baseDate) => {
  const weekStart = startOfWeekMonday(baseDate);
  return addDays(weekStart, 4); // Monday + 4 = Friday
};

const computeRangeFromFriday = (candidateFriday) => {
  const startDate = new Date(candidateFriday);
  const endDate = addDays(candidateFriday, 2); // Friday -> Sunday
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

const formatMDY = (date) => (date ? format(date, "MM/dd/yyyy") : "");
const formatYMD = (date) => (date ? format(date, "yyyy/MM/dd") : "");
const formatYMDDashed = (date) => (date ? format(date, "yyyy-MM-dd") : "");

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();

  document.cookie =
    name +
    "=" +
    value +
    ";" +
    expires +
    ";path=/;SameSite=None;Secure;Domain=.sg-host.com";
}

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedFriday, setSelectedFriday] = useState(null);
  const [range, setRange] = useState(null); // { startDate, endDate } or null
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  // Load previously selected dates
  useEffect(() => {
    const savedStartDate = localStorage.getItem("selectedStartDate");
    const savedEndDate = localStorage.getItem("selectedEndDate");

    if (savedStartDate && savedEndDate) {
      // Convert saved dates to Date objects
      const startDateObj = new Date(savedStartDate);
      const endDateObj = new Date(savedEndDate);

      // Set the selected Friday (start date)
      setSelectedFriday(startDateObj);

      // Set the range
      setRange({
        startDate: startDateObj,
        endDate: endDateObj,
      });
    }
  }, []);

  const inMondayAfter3pm = () => {
    // After this week's Monday 3 PM? If yes, treat this week's Friday as blocked
    const now = new Date();
    const mondayStart = startOfWeekMonday(now);
    const cutoff = new Date(mondayStart);
    cutoff.setHours(15, 0, 0, 0); // Monday 3:00 PM of the current week
    return now >= cutoff;
  };

  const handleSelect = (date) => {
    if (!date) return;
    if (!isFriday(date)) return; // Guard; non-Fridays are disabled anyway

    let friday = new Date(date);
    friday.setHours(0, 0, 0, 0);

    if (inMondayAfter3pm()) {
      const thisWeekFriday = getThisWeekFriday(new Date());
      thisWeekFriday.setHours(0, 0, 0, 0);
      if (sameDay(friday, thisWeekFriday)) {
        friday = addDays(friday, 7); // shift to next week
      }
    }

    const computed = computeRangeFromFriday(friday);
    setSelectedFriday(friday);
    setRange(computed);

    // Auto-save cookies and localStorage immediately upon selection
    const startDateDisplay = formatYMD(computed.startDate);
    const endDateDisplay = formatYMD(computed.endDate);
    const startDateCookie = formatYMDDashed(computed.startDate);
    const endDateCookie = formatYMDDashed(computed.endDate);
    localStorage.setItem("selectedStartDate", startDateDisplay);
    localStorage.setItem("selectedEndDate", endDateDisplay);
    setCookie("s_date", startDateCookie, 7);
    setCookie("e_date", endDateCookie, 7);
  };

  const shouldDisableDate = (date) => {
    // Disable all non-Fridays and past dates
    if (!isFriday(date)) return true;
    const now = new Date();
    if (endOfDay(date) < now) return true;

    // If current time is after this week's Monday 3 PM, disable this week's Friday
    if (inMondayAfter3pm()) {
      const thisWeekFriday = getThisWeekFriday(now);
      thisWeekFriday.setHours(0, 0, 0, 0);
      if (sameDay(date, thisWeekFriday)) return true;
    }

    return false;
  };

  const Day = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const isSelectedFriday = selectedFriday && sameDay(day, selectedFriday);
    const isRangeSat =
      selectedFriday &&
      isSaturday(day) &&
      sameDay(day, addDays(selectedFriday, 1));
    const isRangeSun =
      selectedFriday &&
      isSunday(day) &&
      sameDay(day, addDays(selectedFriday, 2));
    const isInRange = isRangeSat || isRangeSun;

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        selected={isSelectedFriday}
        sx={{
          ...(isSelectedFriday && {
            bgcolor: "#B02B30",
            color: "#ffffff",
            "&:hover": { bgcolor: "#9e2627" },
          }),
          ...(isInRange &&
            !isSelectedFriday && {
              bgcolor: "rgba(176,43,48,0.15)",
              color: "#000000",
            }),
        }}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!range) {
      setPopupMessage("Please select a Date Range.");
      setShowPopup(true);
      return;
    }
    const startDate = formatYMD(range.startDate);
    const endDate = formatYMD(range.endDate);
    // Use dashed format for cookies to match downstream expectations
    const startDateCookie = formatYMDDashed(range.startDate);
    const endDateCookie = formatYMDDashed(range.endDate);
    localStorage.setItem("selectedStartDate", startDate);
    localStorage.setItem("selectedEndDate", endDate);
    // Also set cookies (cross-domain if possible, with local fallback)
    setCookie("s_date", startDateCookie, 7);
    setCookie("e_date", endDateCookie, 7);
    console.log("Booking range:", {
      startDate,
      endDate,
    });
    // Navigate to products page after confirming (HashRouter-safe)
    navigate("/show-products");
  };

  const handleBack = () => {
    navigate("/size");
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 py-12 bg-[url('/src/assets/ah-cover.jpeg')]">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-orange-800 font-montserrat">
        Select Booking Date
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-10 text-center max-w-xl font-montserrat">
        Please choose a date for your booking. Dates before today are not
        available.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 font-montserrat"
      >
        <label
          htmlFor="booking-date"
          className="block text-lg font-semibold mb-3 text-gray-800"
        >
          Booking Date
        </label>

        <div className="w-full">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedFriday}
              onChange={handleSelect}
              shouldDisableDate={shouldDisableDate}
              minDate={today}
              slots={{ day: Day }}
              views={["day"]}
            />
          </LocalizationProvider>
        </div>

        {/* Display selected range (defaults to empty before selection) */}
        <div className="mt-4 text-sm text-gray-700">
          {!range ? (
            <span>Value: 0</span>
          ) : (
            <div>
              {/* <div>Start (Friday): {formatYMD(range.startDate)}</div> */}
              {/* <div>End (Sunday): {formatYMD(range.endDate)}</div> */}
              {/* <div>Return (Monday): {formatYMD(addDays(range.endDate, 1))}</div> */}
              <div>Start (Friday): {formatMDY(range.startDate)}</div>
              <div>End (Sunday): {formatMDY(range.endDate)}</div>
              <div>Return (Monday): {formatMDY(addDays(range.endDate, 1))}</div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
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

      {/* Popup */}
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

export default BookingPage;
