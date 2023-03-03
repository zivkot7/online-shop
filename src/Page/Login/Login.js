import React, { useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import supabase from "../../Config/Config";
import {
  Button,
  Box,
  Group,
  TextInput,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons";

const Login = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState("password");
  const showPassword = () => {
    type === "password" ? setType("text") : setType("password");
  };

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser(() => ({
      ...user,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });

    console.log(data.user);

    if (error) {
      alert(error.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={onSubmit}>
        <h1>Login information </h1>
        <TextInput
          withAsterisk
          label="Email"
          name="email"
          placeholder="your@email.com"
          value={user.email}
          onChange={onChange}
        />
        <TextInput
          withAsterisk
          label="Password"
          type={type}
          name="password"
          placeholder="Enter your password"
          onChange={onChange}
          icon={<IconLock size="17" />}
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
        <Group position="left" mt="md">
          <Button
            type="submit"
            loading={loading}
            onClick={onSubmit}
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
          >
            Login
          </Button>
          <Button
            variant="outline"
            styles={() => ({
              root: {
                backgroundColor: "transparent",
                border: "1px solid #fb5e41",
                color: "#fb5e41",
                "&:hover": {
                  transition: "0.2s",
                  backgroundImage: theme.fn.gradient({
                    from: "red",
                    to: "yellow",
                  }),
                  color: "white",
                },
              },
            })}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Login;
