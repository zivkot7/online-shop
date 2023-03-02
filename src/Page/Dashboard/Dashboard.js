import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";

const Dashboard = () => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const auth = useAuth();

  const [apartments, setApartments] = useState([]);

  const fetchData = async () => {
    const { data: apartments, error } = await supabase
      .from("apartments")
      .select("*");
    setApartments(apartments);
    console.log(apartments);

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
    const { error } = await supabase.from("apartments").delete().eq("id", id);

    const newApartments = apartments.filter((apartment) => apartment.id !== id);
    setApartments(newApartments);
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
            <Accordion defaultValue="navbar" mt="30px">
              <Accordion.Item value="products">
                <Accordion.Control>Products</Accordion.Control>
                <Accordion.Panel>
                  PRODUCT 1 PRODUCT 2 PRODUCT 3 PRODUCT 4 PRODUCT 5 PRODUCT 6
                  PRODUCT 7
                </Accordion.Panel>
              </Accordion.Item>
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
              <Accordion.Item value="orders">
                <Accordion.Control>Orders</Accordion.Control>
              </Accordion.Item>
            </Accordion>
          </Navbar.Section>
          <Navbar.Section>
            <Group>
              <p style={{ marginRight: "10px" }}>{auth.user.email}</p>
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

            <Text size="30px" fw="bold">
              DASHBOARD...
            </Text>
            <Group>
              <Button
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                onClick={() => navigate("/dashboard/create")}
              >
                Create
              </Button>
            </Group>
          </div>
        </Header>
      }
    >
      <Text>
        {apartments.map((apartment) => {
          const {
            id,
            title,
            imageUrl,
            description,
            location,
            sqft,
            monthly_price,
          } = apartment;
          return (
            <div key={id}>
              <img src={imageUrl} />
              <h4>{title}</h4>
              <p>Description: {description}</p>
              <p>Locaiton: {location}</p>
              <p>Sqft: {sqft}m²</p>
              <p>Monthly price: {monthly_price}$</p>
              <Button
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                onClick={() => deleteData(id)}
              >
                Delete
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                onClick={() => navigate(id)}
              >
                Edit
              </Button>
            </div>
          );
        })}
      </Text>
    </AppShell>
  );
};

export default Dashboard;
