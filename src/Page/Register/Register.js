import React, { useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import supabase from "../../Config/Config";
import { Button, Box, TextInput, ActionIcon } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons";

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [type, setType] = useState("password");
  const showPassword = () => {
    type === "password" ? setType("text") : setType("password");
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    console.log(data, error);
    data.user !== null ? navigate("/login") : alert("Fill the form");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser(() => ({
      ...user,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={onRegister}>
        <h1>Registration form </h1>
        <TextInput
          withAsterisk
          label="Username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={user.username}
          onChange={onChange}
        />
        <TextInput
          withAsterisk
          label="Email"
          name="email"
          type="text"
          placeholder="your@email.com"
          value={user.email}
          onChange={onChange}
        />
        <TextInput
          withAsterisk
          label="Password"
          name="password"
          type={type}
          placeholder="Enter your password"
          value={user.password}
          onChange={onChange}
          rightSection={
            <ActionIcon onClick={showPassword}>
              {type === "password" ? (
                <IconEyeOff size="17" />
              ) : (
                <IconEye size="17" />
              )}
            </ActionIcon>
          }
        />
        <br />
        <Button
          type="submit"
          onClick={onRegister}
          variant="gradient"
          gradient={{ from: "yellow", to: "red" }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
