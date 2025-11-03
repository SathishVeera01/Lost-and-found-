import React from "react";

function Dashboard({ onLostClick, onFoundClick, user, onLogout }) {
  return (
    <div className="App">
      <div className="page dashboard">
        {/* Header Section */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Lost and Found Webwall</h1>
            <p className="welcome">Welcome, {user}</p>
          </div>

          <div>
            <button className="btn btn-ghost" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Report Buttons */}
        <section style={{ marginTop: "20px" }}>
          <h2 style={{ color: "#2c3e50", marginBottom: "12px" }}>Report</h2>
          <div className="button-group">
            <button className="report-btn lost-btn" onClick={onLostClick}>
               Lost Item
            </button>
            <button className="report-btn found-btn" onClick={onFoundClick}>
               Found Item
            </button>
          </div>
        </section>

        {/* Info Section */}
        <section style={{ marginTop: "40px", textAlign: "left" }}>
          <div
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            <h3 style={{ color: "#172a3a", marginBottom: "10px" }}>
              Quick Instructions:
            </h3>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Use “Report Lost Item” if you misplaced something.</li>
              <li>Use “Report Found Item” if you’ve found someone’s belongings.</li>
              <li>
                The system automatically matches lost and found items and notifies
                the relevant users via email.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
