import React from "react";
import Button from "../Button/Button";

const CartItem = (props) => {
  const { title, description, sqft, id, key, monthly_price, quantity } =
    props.product;
  return (
    <div>
      <hr className="header-horizontal" />
      <div key={key} className="cart-product">
        <div className="cart-product-item">
          <img src="https://i.imgur.com/ZL52Q2D.png" width="120px" />
          <div className="product-details">
            <p className="product-title">{title}</p>

            <p className="product-size-style">
              {sqft} | {description}
            </p>
            <p className="product-count">Quantity: {quantity}</p>
          </div>
        </div>
        <div className="options">
          <Button
            type="button"
            text="X"
            className="delete-from-cartBtn"
            onClick={() => props.onDelete(id)}
          />
          <p className="product-price" style={{ margin: "0px" }}>
            ${(quantity * monthly_price).toFixed(2)}
          </p>
          <span>
            <Button
              className="minusBtn"
              text="-"
              onClick={() => props.onMinus(props.product)}
            />
            <Button
              className="plusBtn"
              text="+"
              onClick={() => props.onPlus(props.product)}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
