import React from "react";

const ProductModal = () => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{data.title}</h2>
        <p>{data.description}</p>
        <p>Price: ${data.price}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProductModal;
