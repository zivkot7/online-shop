import React from "react";

const Button = (props) => {
  const { text, type, onClick, className } = props;
  return (
    <button className={className} type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
