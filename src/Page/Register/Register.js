import React, { useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import supabase from "../../Config/Config";
import { Button, Box, TextInput, ActionIcon, Checkbox } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState("user");

  const [user, setUser] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [type, setType] = useState("password");
  const showPassword = () => {
    type === "password" ? setType("text") : setType("password");
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          full_name: user.full_name,
          role: isAdmin,
        },
      },
    });
    console.log(data, error);
    if (data) {
      await supabase
        .from("profiles")
        .update({ full_name: user.full_name, role: user.role })
        .eq("id", data.user.id);
    }
    data.user !== null ? navigate("/login") : alert("Fill the form");
    setLoading(false);
  };

  const onSetRole = () => {
    setIsAdmin("admin");
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
          label="Full name"
          name="full_name"
          type="text"
          placeholder="Enter your full name"
          value={user.full_name}
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
        <Checkbox
          label="Admin"
          value="admin"
          onChange={onSetRole}
          style={{ display: "flex", justifyContent: "end" }}
        />
        <Button
          type="submit"
          loading={loading}
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
