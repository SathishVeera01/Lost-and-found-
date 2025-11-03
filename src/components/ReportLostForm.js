import React from "react";

function ReportLostForm({ formData, onChange, onSubmit, onBack, user }) {
  return (
    <div className="App">
      <div className="form-container page">
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#172a3a",
            marginBottom: "10px",
          }}
        >
          Report Lost Item
        </h2>

        <div className="helper-bubble">Email: {user} (auto-filled)</div>

        <form onSubmit={onSubmit}>
          {/* Description Field */}
          <div style={{ marginTop: "16px" }}>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe the lost item (e.g., black wallet with ID card near library or red water bottle in AB3)"
              value={formData.description}
              onChange={onChange}
              required
            />
          </div>

          {/* Reporter Info */}
          <div className="form-row" style={{ marginTop: "14px" }}>
            <input
              type="text"
              name="regNo"
              className="form-input"
              placeholder="Your College Reg No (e.g., 22MID0160)"
              value={formData.regNo}
              onChange={onChange}
              required
            />
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Your Phone Number (e.g., +91-9XXXXXXXXX)"
              value={formData.phone}
              onChange={onChange}
              required
            />
          </div>

          {/* Buttons */}
          <div className="form-row" style={{ marginTop: "20px" }}>
            <button type="submit" className="btn btn-primary">
              Report Lost
            </button>
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
          </div>
        </form>

        <p className="small-muted" style={{ marginTop: "14px" }}>
          After submitting, our system will automatically check if anyone has
          already reported a similar found item and notify you by email if there’s
          a match.
        </p>
      </div>
    </div>
  );
}

export default ReportLostForm;
