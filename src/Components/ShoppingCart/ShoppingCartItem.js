import React from "react";
import Button from "../Button/Button";

const CartItem = (props) => {
  const { name, image, price, sale_price, id, key, quantity } = props.product;
  return (
    <div>
      <hr className="header-horizontal" />
      <div key={key} className="cart-product">
        <div className="cart-product-item">
          <img src={image} width="120px" />
          <div className="product-details">
            <p className="product-title">{name}</p>

            <p className="product-size-style"></p>
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
          {sale_price ? (
            <p className="product-price" style={{ margin: "0px" }}>
              ${(quantity * sale_price).toFixed(2)}
            </p>
          ) : (
            <p className="product-price" style={{ margin: "0px" }}>
              ${(quantity * price).toFixed(2)}
            </p>
          )}

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
