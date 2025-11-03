import React from "react";

function ItemList({ items, claimItem, isLost }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.description}
          {isLost && (
            <button onClick={() => claimItem(index)}>Claim (Found It!)</button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ItemList;
