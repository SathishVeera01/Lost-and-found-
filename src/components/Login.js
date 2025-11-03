import React, { useState } from "react";

function Login({ generateOTP }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith("vitstudent.ac.in")) {
      setError(
        "Email must be a valid college email (e.g., xyz.vitstudent.ac.in)"
      );
      return;
    }
    setError("");
    generateOTP(email);
  };

  return (
    <div className="App">
      <div className="login-container">
        {/* Left side hero text */}
        <div className="signin-hero">
          <h1 className="sign-in-title">Sign In</h1>
          <p className="sign-in-sub">
            Enter your college email to receive your OTP
          </p>
        </div>

        {/* Right side sign-in card */}
        <div className="sign-in-card">
          <div className="auto-email">
            Use your VIT student email (e.g., xyz.vitstudent.ac.in)
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="input-row">
              <input
                type="email"
                className="email-field"
                placeholder="you@vitstudent.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="send-otp-btn">
                Send OTP
              </button>
            </div>
          </form>

          {error && (
            <p className="signin-footer" style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <p className="signin-footer text-muted" style={{ marginTop: "12px" }}>
            We’ll send a one-time code to your college email. Valid for 5 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
