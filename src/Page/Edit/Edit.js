import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../Components/Input/Input";
import supabase from "../../Config/Config";
import { ActionIcon, Box, Grid, Stack, TextInput, Title } from "@mantine/core";
import { IconEye, IconEyeOff, IconIceCream } from "@tabler/icons";
import { Drawer, Group, Button } from "@mantine/core";

const Edit = () => {
  const { id } = useParams();
  const { data, setData } = useState({});
  const [isEditable, setIsEditable] = useState("");
  const [editInput, setEditInput] = useState("");

  const [opened, setOpened] = useState(false);

  const [type, setType] = useState("password");
  const showPassword = () => {
    type === "password" ? setType("text") : setType("password");
  };

  const onEditingApartment = async (id) => {
    const { error } = await supabase.from("apartments").update({}).eq("id", id);
    console.log(id);
  };
  return (
    <div>
      <Grid p="xl" justify={"space-between"} align="center" spacing={10}>
        <Title color="grape">Edit</Title>

        <Button>trrd</Button>
      </Grid>
      <Grid
        gutter="sm"
        sx={{
          margin: 0,
        }}
      >
        <Grid.Col xs={12} sm={6} xl={3}>
          <Box bg="blue">Pero</Box>
        </Grid.Col>
        <Grid.Col xs={12} sm={6} xl={3}>
          <Box bg="blue">Pero</Box>
        </Grid.Col>
        <Grid.Col xs={12} sm={6} xl={3}>
          <Box bg="blue">Pero</Box>
        </Grid.Col>
        <Grid.Col xs={12} sm={6} xl={3}>
          <Box bg="blue">Pero</Box>
        </Grid.Col>
      </Grid>
      <h3>Edit</h3>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Register"
        padding="xl"
        size="50%"
        position="right"
      >
        {/* Drawer content */}
      </Drawer>

      <Group position="center">
        <Button onClick={() => setOpened(true)} text="OPEN DRAWER"></Button>
      </Group>
      <form>
        <label>
          Title: <br />
          <Input value />
        </label>
        <br />
        <label>
          Description:
          <br />
          <Input size={50} />
        </label>
        <br />
        <label>
          Location: <br />
          <Input />
        </label>
        <br />
        <label>
          Sqft:
          <br />
          <Input />
        </label>
        <br />
        <label>
          Monthly price:
          <br />
          <Input />
        </label>
        <br />
        <TextInput
          placeholder="Your name"
          label="Full name"
          withAsterisk
          type={type}
          rightSection={
            <ActionIcon onClick={showPassword}>
              {type === "password" ? <IconEyeOff /> : <IconEye />}
            </ActionIcon>
          }
        />
        <Button></Button>
        <Button />
        <Button />
      </form>
    </div>
  );
};

export default Edit;
