import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../Config/Config";
import { useState } from "react";
import { useAuth } from "../../../Providers/Authentication/Authentication";
import {
  AppShell,
  Button,
  Header,
  Navbar,
  Text,
  useMantineTheme,
  Group,
} from "@mantine/core";
import Products from "./Products/Products";
import Categories from "./Categories/Categories";
import Orders from "./Orders/Orders";

const Dashboard = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const auth = useAuth();

  const [showProducts, setShowProducts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const onOrdersClick = () => {
    navigate("/admin/dashboard/orders");
    setShowOrders(true);
    setShowCategories(false);
    setShowProducts(false);
  };
  const onCategoryClick = () => {
    navigate("/admin/dashboard/categories");
    setShowCategories(true);
    setShowOrders(false);
    setShowProducts(false);
  };

  const onProductClick = () => {
    navigate("/admin/dashboard/products");
    setShowProducts(true);
    setShowOrders(false);
    setShowCategories(false);
  };

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="ms" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          <Navbar.Section grow>
            <Button
              mt="30px"
              onClick={onProductClick}
              styles={() => ({
                root: {
                  height: "50px",
                  padding: "15px 185px 5px 20px",
                  color: "black",
                  fontWeight: "normal",
                  fontSize: "16px",
                  backgroundColor: "white",
                  border: "none",
                  borderBottom: "1px solid lightgrey",
                  borderRadius: "0px",
                  "&:not([data-disabled])": theme.fn.hover({
                    backgroundColor: "#fafafa",
                  }),
                },
              })}
            >
              Products
            </Button>
            <Button
              onClick={onCategoryClick}
              styles={() => ({
                root: {
                  height: "50px",
                  padding: "15px 173px 15px 20px",
                  color: "black",
                  fontWeight: "normal",
                  fontSize: "16px",
                  backgroundColor: "white",
                  border: "none",
                  borderBottom: "1px solid lightgrey",
                  borderRadius: "0px",
                  "&:not([data-disabled])": theme.fn.hover({
                    backgroundColor: "#fafafa",
                  }),
                },
              })}
            >
              Categories
            </Button>
            <Button
              onClick={onOrdersClick}
              styles={() => ({
                root: {
                  height: "50px",
                  padding: "15px 200px 15px 20px",
                  color: "black",
                  fontWeight: "normal",
                  fontSize: "16px",
                  backgroundColor: "white",
                  border: "none",
                  borderBottom: "1px solid lightgrey",
                  borderRadius: "0px",
                  "&:not([data-disabled])": theme.fn.hover({
                    backgroundColor: "#fafafa",
                  }),
                },
              })}
            >
              Orders
            </Button>
          </Navbar.Section>
          <Navbar.Section>
            <Group>
              <p style={{ marginRight: "10px" }}>
                {auth.user.user_metadata.full_name} (
                {auth.user.user_metadata.role})
              </p>
              <Button
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                onClick={onLogout}
              >
                Logout
              </Button>
            </Group>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text size="30px" fw="bold" className="dashboard">
              DASHBOARD
            </Text>
            <Group>
              <Button
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                onClick={() => navigate("/admin/dashboard/create")}
              >
                Create
              </Button>
            </Group>
          </div>
        </Header>
      }
    >
      {showProducts && <Products />}
      {showCategories && <Categories />}
      {showOrders && <Orders />}
    </AppShell>
  );
};

export default Dashboard;
