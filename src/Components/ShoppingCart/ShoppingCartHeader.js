import React from "react";

const CartHeader = (props) => {
  const { text } = props;
  return (
    <div className="cart-header">
      <div className="cart-length-circle">{text}</div>
      <p>
        <b>Cart</b>
      </p>
    </div>
  );
};

export default CartHeader;
