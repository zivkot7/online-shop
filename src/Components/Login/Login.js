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
import { useAuth } from "../../Providers/Authentication/Authentication";

const Login = () => {
  const auth = useAuth();
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
    }
    auth?.user.user_metadata.role === "admin"
      ? navigate("/admin/dashboard")
      : navigate("/");
    setLoading(false);
  };
  const goBackToHomePage = () => {
    navigate("/");
  };

  return (
    <Box
      mx="auto"
      sx={{
        maxWidth: 600,
        minHeight: 500,
        marginTop: "200px",
        padding: "30px",
      }}
      style={{
        boxShadow: "0px 0px 6px -1px rgba(0,0,0,0.75)",
        borderRadius: "5px",
      }}
    >
      <form onSubmit={onSubmit}>
        <h1>Login information </h1>
        <TextInput
          withAsterisk
          label="Email"
          name="email"
          mt="40px"
          placeholder="your@email.com"
          value={user.email}
          onChange={onChange}
        />
        <TextInput
          withAsterisk
          label="Password"
          type={type}
          mt="20px"
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
        <Group position="left" mt="130px">
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
          <Button
            type="submit"
            ml="10px"
            onClick={goBackToHomePage}
            variant="gradient"
            gradient={{ from: "red", to: "yellow" }}
          >
            Go back
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Login;
