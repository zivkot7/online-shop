import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../Config/Config";
import { useState, useEffect } from "react";
import { useAuth } from "../../Providers/Authentication/Authentication";
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
import { IconSearch } from "@tabler/icons";

const Dashboard = () => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const auth = useAuth();

  const [products, setProducts] = useState([]);

  const rows = products.map((product) => (
    <tr key={product.id}>
      <td width="200px">
        {
          /* apartment.imageUrl */ <img
            src="https://i.imgur.com/ZL52Q2D.png"
            width="80px"
          />
        }
      </td>
      <td>{product.name}</td>
      <td>{product.description}</td>
      <td
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        ${product.price.toLocaleString()}
        <Group>
          <Button
            size="xs"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => deleteData(product.id)}
          >
            Delete
          </Button>
          <Button
            size="xs"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => navigate(product.id)}
          >
            Edit
          </Button>
        </Group>
      </td>
    </tr>
  ));

  const fetchData = async () => {
    const { data: products, error } = await supabase
      .from("products")
      .select("*");
    setProducts(products);
    console.log(products);

    /* const { data } = await supabase
      .from("image")
      .select("image, image_jpeg")
      .eq("id", 0);
    setApartments(apartments);

    const imageData = data[1].image;
    const imageType = data[1].image_jpeg;

    const blob = new Blob([imageData], { type: imageType });
    const imageUrl = URL.createObjectURL(blob); */
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              rightSection={
                <ActionIcon>
                  <IconSearch size="17px" />
                </ActionIcon>
              }
            />
            <Button
              mt="30px"
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
                },
                "&:hover": { backgroundColor: "#fafafa" },
              })}
            >
              Products
            </Button>
            <Accordion defaultValue="navbar">
              <Accordion.Item value="kategories">
                <Accordion.Control>Kategories</Accordion.Control>
                <Accordion.Panel>
                  <Radio.Group orientation="vertical" spacing="md" size="md">
                    <Radio value="kat1" label="1 child link" />
                    <Radio value="kat2" label="2 child link" />
                    <Radio value="kat3" label="3 child link" />
                    <Radio value="kat4" label="4 child link" />
                    <Radio value="kat5" label="5 child link" />
                    <Radio value="kat6" label="6 child link" />
                    <Radio value="kat7" label="7 child link" />
                    <Radio value="kat8" label="8 child link" />
                    <Radio value="kat9" label="9 child link" />
                    <Radio value="kat10" label="10 child link" />
                  </Radio.Group>
                </Accordion.Panel>
              </Accordion.Item>
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
                    "&:hover": {
                      transition: "0.2s",
                      backgroundColor: "#fafafa",
                    },
                  },
                })}
              >
                Orders
              </Button>
            </Accordion>
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
