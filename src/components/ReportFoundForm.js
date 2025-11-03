import React from "react";

function ReportFoundForm({ formData, onChange, onSubmit, onBack, user }) {
  return (
    <div className="App">
      <div className="form-container page">
        <h2 style={{ fontSize: "1.8rem", color: "#172a3a", marginBottom: "10px" }}>
          Report Found Item
        </h2>

        <div className="helper-bubble">Email: {user} (auto-filled)</div>

        <form onSubmit={onSubmit}>
          {/* Item Description */}
          <div style={{ marginTop: "16px" }}>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe the found item (e.g., black wallet found in library, HP laptop near AB1)"
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
              Report Found
            </button>
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
          </div>
        </form>

        <p className="small-muted" style={{ marginTop: "14px" }}>
          Once submitted, your report will be visible in the system. The owner will
          automatically receive an email if a matching lost item is found.
        </p>
      </div>
    </div>
  );
}

export default ReportFoundForm;
