import React, { useState } from "react";

function LostItemForm({ addLostItem }) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addLostItem({ description });
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Describe the lost item (e.g., black wallet with ID)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Report Lost</button>
    </form>
  );
}

export default LostItemForm;
