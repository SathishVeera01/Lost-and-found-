import React, { useState } from "react";

function OTPVerify({ verifyOTP }) {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = verifyOTP(enteredOtp);
    if (result.success) {
      // Success: handled in App.js (redirect to dashboard)
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="App">
      <div className="otp-card page">
        <h1 className="otp-title">Verify OTP</h1>
        <p className="otp-sub">Enter the 6-digit code sent to your VIT email</p>

        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              className="otp-input"
              type="text"
              placeholder="Enter OTP from your email"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Verify
            </button>
          </div>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "12px", fontWeight: "500" }}>
            {error}
          </p>
        )}

        <p className="small-muted" style={{ marginTop: "16px" }}>
          Didn’t get the email? Check your spam folder or return to Sign In to
          request another OTP.
        </p>
      </div>
    </div>
  );
}

export default OTPVerify;
