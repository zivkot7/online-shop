import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../Config/Config";
import { useState, useEffect } from "react";
import { useAuth } from "../../../Providers/Authentication/Authentication";
import {
  AppShell,
  Button,
  Header,
  Burger,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
  Input,
  Group,
  ActionIcon,
  Radio,
  Accordion,
  Table,
} from "@mantine/core";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons";

const Dashboard = () => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const auth = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const fetchData = async (searchQuery, categoryId) => {
    let query = supabase.from("products").select("*");

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%`);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data: products, error } = await query;
    setProducts(products);
  };
  useEffect(() => {
    fetchData(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  const rows = products.map((product) => (
    <tr key={product.id}>
      <td width="200px">
        {<img src="https://i.imgur.com/ZL52Q2D.png" width="80px" />}
      </td>
      <td>{product.name}</td>
      <td>{product.description}</td>
      <td>{product.sale_price}</td>
      <td
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        ${product.price.toLocaleString()}
        <Group>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => onEdit(product)}
          >
            <IconPencil size="25px" />
          </ActionIcon>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => deleteData(product.id)}
          >
            <IconTrash size="25px" />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  const deleteData = async (id) => {
    console.log(id);
    const { error } = await supabase.from("products").delete().eq("id", id);

    const newProducts = products.filter((product) => product.id !== id);
    setProducts(newProducts);
  };
  const onEdit = async (item) => {
    navigate(`/admin/dashboard/${item.id}`, { state: item });
  };

  const showAllProducts = () => {
    setSelectedCategory("");
    setSearchQuery("");
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
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow>
            <Input
              mt="20px"
              placeholder="Search for products"
              onChange={(e) => onSearch(e.target.value)}
              rightSection={
                <ActionIcon>
                  <IconSearch size="17px" />
                </ActionIcon>
              }
            />
            <Button
              mt="30px"
              onClick={showAllProducts}
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
            <Accordion defaultValue="categories">
              <Accordion.Item value="categories">
                <Accordion.Control>Categories</Accordion.Control>
                <Accordion.Panel>
                  <Radio.Group
                    orientation="vertical"
                    spacing="md"
                    size="md"
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                  >
                    {categories.map((category) => (
                      <Radio
                        key={category.id}
                        value={category.id}
                        label={category.name}
                      />
                    ))}
                  </Radio.Group>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Button
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
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text size="30px" fw="bold" className="dashboard">
              DASHBOARD...
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
      <Group display="block">
        <Table
          striped={true}
          withBorder
          highlightOnHover
          withColumnBorders
          verticalSpacing="md"
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Title</th>
              <th>Description</th>
              <th>Sale price</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Group>
    </AppShell>
  );
};

export default Dashboard;
