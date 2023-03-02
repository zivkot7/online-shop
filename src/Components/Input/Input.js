import React from "react";

const Input = (props) => {
  const { onChange, type, size, placeholder, name, value, onBlur, className } =
    props;
  return (
    <input
      name={name}
      className={className}
      onBlur={onBlur}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      size={size}
      type={type}
    ></input>
  );
};

export default Input;
