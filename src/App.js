import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import emailjs from "@emailjs/browser";
import "./App.css";
import Login from "./components/Login";
import OTPVerify from "./components/OTPVerify";
import Dashboard from "./components/Dashboard";
import ReportLostForm from "./components/ReportLostForm";
import ReportFoundForm from "./components/ReportFoundForm";

// Supabase config - keep your values
const supabaseUrl = "https://ujcztdmoqewwbjzzddcv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY3p0ZG1vcWV3d2JqenpkZGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NzM0NjgsImV4cCI6MjA3NzA0OTQ2OH0.V8ExgI__o4gIqQQtM80DkFqcM8qNg1bxQhbxBSBfHmw";
const supabase = createClient(supabaseUrl, supabaseKey);

// EmailJS config (keep your service/template/user ids)
const EMAILJS_SERVICE = "service_zmxi13e";
const EMAILJS_TEMPLATE = "template_hzifdx5";
const EMAILJS_USER = "U_M7Lu2WbZnvkX9XY";

function App() {
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState(null);
  const [otpTimestamp, setOtpTimestamp] = useState(null);
  const [email, setEmail] = useState("");
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [formData, setFormData] = useState({ description: "", regNo: "", phone: "" });

  // Load from Supabase on mount
  useEffect(() => {
    console.log("Loading items from Supabase...");
    const loadItems = async () => {
      try {
        const { data: lostData } = await supabase.from("lost_items").select("*");
        console.log("Loaded lost items:", lostData);
        setLostItems(lostData || []);

        const { data: foundData } = await supabase.from("found_items").select("*");
        console.log("Loaded found items:", foundData);
        setFoundItems(foundData || []);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    };
    loadItems();
  }, []);

  const generateOTP = (userEmail) => {
    if (!userEmail) {
      console.error("userEmail is empty or undefined");
      alert("Please enter a valid email.");
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setOtpTimestamp(Date.now());
    setEmail(userEmail);

    console.log("Generating OTP for:", userEmail);
    const templateParams = {
      email: userEmail,
      otp: newOtp,
    };

    emailjs
      .send("service_zmxi13e", "template_zslxjgk", templateParams, EMAILJS_USER)
      .then(() => {
        console.log("OTP sent to:", userEmail);
        alert("OTP sent to your email!");
      })
      .catch((error) => {
        console.error("Failed to send OTP:", error);
        alert("Failed to send OTP. Check console for details.");
      });
  };

  const verifyOTP = (enteredOtp) => {
    const now = Date.now();
    if (otpTimestamp && now - otpTimestamp > 5 * 60 * 1000) {
      console.log("OTP expired for:", email);
      setOtp(null);
      setOtpTimestamp(null);
      return { success: false, message: "OTP expired" };
    }
    if (enteredOtp === otp) {
      console.log("OTP verified for:", email);
      setUser(email);
      setOtp(null);
      setOtpTimestamp(null);
      setEmail("");
      return { success: true };
    }
    console.log("Invalid OTP entered for:", email);
    return { success: false, message: "Invalid OTP" };
  };

  const logout = () => {
    console.log("Logging out user:", user);
    setUser(null);
    setCurrentView("dashboard");
  };

  const handleFormChange = (e) => {
    console.log("Form field changed:", e.target.name, "to:", e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -------------------------
  // Helpers: tokenization + notification
  // -------------------------
  const tokenize = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  const sendMatchNotification = async (toEmail, matchType, itemDescription, reporterEmail, reporterRegNo, reporterPhone) => {
    // matchType: 'lost_match' means a lost item matched an existing found -> notify finder
    // otherwise it's a found_match -> notify owner who lost
    let message = "";
    if (matchType === "lost_match") {
      // Notify the finder about a newly reported LOST item that may match their found item
      message = `A similar lost item to your found "${itemDescription}" has been reported. Contact the reporter:\n\nEmail: ${reporterEmail}\nReg No: ${reporterRegNo || "N/A"}\nPhone: ${reporterPhone || "N/A"}`;
    } else {
      // Notify the owner (lost reporter) about a newly reported FOUND item that may match their lost item
      message = `A similar found item to your lost "${itemDescription}" has been reported. Contact the finder:\n\nEmail: ${reporterEmail}\nReg No: ${reporterRegNo || "N/A"}\nPhone: ${reporterPhone || "N/A"}`;
    }

    const templateParams = {
      to_email: toEmail,
      message,
    };

    return emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams, EMAILJS_USER);
  };

  // -------------------------
  // submitLostItem (improved)
  // -------------------------
  const submitLostItem = async (e) => {
    e.preventDefault();
    console.log("Submitting lost item:", formData);
    try {
      // Insert and request returning row
      const { data: inserted, error: insertError } = await supabase
        .from("lost_items")
        .insert([
          {
            description: formData.description,
            owner: user,
            reporter_reg_no: formData.regNo,
            reporter_phone: formData.phone,
          },
        ])
        .select();
      if (insertError) throw insertError;
      console.log("Lost item inserted into Supabase:", inserted);

      // Fetch found items (current)
      const { data: foundData } = await supabase.from("found_items").select("*");
      console.log("Checking found items for match:", foundData);

      const lostTokens = tokenize(formData.description);

      // Find best match by token overlap
      let bestMatch = null;
      let bestScore = 0;
      (foundData || []).forEach((found) => {
        const foundTokens = tokenize(found.description);
        const score = foundTokens.filter((t) => lostTokens.includes(t)).length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = found;
        }
      });

      console.log("Best match (score):", bestMatch, bestScore);
      if (bestMatch && bestScore >= 1) {
        // Notify the finder (found.reporter_email)
        try {
          await sendMatchNotification(
            bestMatch.reporter_email,
            "lost_match",
            bestMatch.description, // description of the found item
            user, // lost reporter email (you)
            formData.regNo,
            formData.phone
          );
          console.log("Notification sent to finder:", bestMatch.reporter_email);
        } catch (err) {
          console.error("Failed to send notification (lost->found):", err);
        }
      } else {
        console.log("No match found for lost item:", formData.description);
      }

      // Refresh state arrays (replace, avoid duplicates)
      const { data: lostData } = await supabase.from("lost_items").select("*");
      setLostItems(lostData || []);

      alert("Lost item reported!");
      setCurrentView("dashboard");
      setFormData({ description: "", regNo: "", phone: "" });
    } catch (error) {
      console.error("Error reporting lost item:", error);
      alert("Failed to report lost item.");
    }
  };

  // -------------------------
  // submitFoundItem (improved)
  // -------------------------
  const submitFoundItem = async (e) => {
    e.preventDefault();
    console.log("Submitting found item:", formData);
    try {
      // Insert and request returning row
      const { data: inserted, error: insertError } = await supabase
        .from("found_items")
        .insert([
          {
            description: formData.description,
            reporter_email: user,
            reporter_reg_no: formData.regNo,
            reporter_phone: formData.phone,
          },
        ])
        .select();
      if (insertError) throw insertError;
      console.log("Found item inserted into Supabase:", inserted);

      // Fetch lost items (current)
      const { data: lostData } = await supabase.from("lost_items").select("*");
      console.log("Checking lost items for match:", lostData);

      const foundTokens = tokenize(formData.description);

      // Find best match by token overlap
      let bestMatch = null;
      let bestScore = 0;
      (lostData || []).forEach((lost) => {
        const lostTokens = tokenize(lost.description);
        const score = lostTokens.filter((t) => foundTokens.includes(t)).length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = lost;
        }
      });

      console.log("Best match (score):", bestMatch, bestScore);
      if (bestMatch && bestScore >= 1) {
        // Notify the owner (lost reporter owner)
        try {
          await sendMatchNotification(
            bestMatch.owner,
            "found_match",
            foundItems.length ? formData.description : formData.description, // found item desc
            user, // finder email
            formData.regNo,
            formData.phone
          );
          console.log("Notification sent to lost owner:", bestMatch.owner);
        } catch (err) {
          console.error("Failed to send notification (found->lost):", err);
        }
      } else {
        console.log("No match found for found item:", formData.description);
      }

      // Refresh found items state (replace, avoid duplicates)
      const { data: newFoundData } = await supabase.from("found_items").select("*");
      setFoundItems(newFoundData || []);

      alert("Found item reported!");
      setCurrentView("dashboard");
      setFormData({ description: "", regNo: "", phone: "" });
    } catch (error) {
      console.error("Error reporting found item:", error);
      alert("Failed to report found item.");
    }
  };

  // if (!user) {
  //   if (otp) {
  //     return <OTPVerify verifyOTP={verifyOTP} />;
  //   }
  //   return <Login generateOTP={generateOTP} />;
  // }
  // 🔧 Skip OTP flow for testing (auto-login after entering email)
  if (!user) {
    return <Login generateOTP={(email) => setUser(email)} />;
  }

  return (
    <div className="App">
      {currentView === "dashboard" && (
        <Dashboard
          onLostClick={() => setCurrentView("reportLost")}
          onFoundClick={() => setCurrentView("reportFound")}
          user={user}
          onLogout={logout}
        />
      )}
      {currentView === "reportLost" && (
        <ReportLostForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={submitLostItem}
          onBack={() => setCurrentView("dashboard")}
          user={user}
        />
      )}
      {currentView === "reportFound" && (
        <ReportFoundForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={submitFoundItem}
          onBack={() => setCurrentView("dashboard")}
          user={user}
        />
      )}
    </div>
  );
}

export default App;
