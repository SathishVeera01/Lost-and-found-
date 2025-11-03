import React, { useState } from "react";

function FoundItemForm({ addFoundItem }) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addFoundItem({ description });
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Describe the found item (e.g., black wallet found in library)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Report Found</button>
    </form>
  );
}

export default FoundItemForm;
