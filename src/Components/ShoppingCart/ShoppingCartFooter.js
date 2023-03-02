import React from "react";
import { Button } from "@mantine/core";

const ShoppingCartFooter = (props) => {
  const { installments, total, checkout } = props;
  return (
    <div style={{ marginTop: "50px" }}>
      <span className="subtotal">
        <p>SUBTOTAL: </p>
        <span>
          <p className="footer-totalPrice">$ {total}</p>
        </span>
      </span>
      <Button
        type="button"
        mt="20px"
        variant="gradient"
        style={{ padding: "10px 195px" }}
        gradient={{ from: "yellow", to: "red" }}
        onClick={checkout}
      >
        CHECKOUT
      </Button>
    </div>
  );
};

export default ShoppingCartFooter;
