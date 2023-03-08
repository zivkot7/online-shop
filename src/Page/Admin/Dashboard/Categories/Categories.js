import {
  ActionIcon,
  Group,
  Modal,
  Table,
  TextInput,
  Button,
  Input,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import supabase from "../../../../Config/Config";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [openedModal, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
    };

    fetchCategories();
  }, []); */

  const fetchData = async (searchQuery) => {
    let query = supabase.from("categories").select("*");

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%`);
    }

    const { data: categories, error } = await query;
    setCategories(categories);
  };
  useEffect(() => {
    fetchData(searchQuery);
  }, [searchQuery]);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });
  const { name, description } = form.values;

  const categoriesRows = categories.map((category) => (
    <tr key={category.id}>
      <td>{category.name}</td>
      <td>{category.id}</td>
      <td>{category.description}</td>
      <td>{category.created_at}</td>
      <td>{category.updated_at}</td>
      <td
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {category.user_id}
        <Group>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => {
              setCategoryId(category.id);
              open();
            }}
          >
            <IconPencil size="25px" />
          </ActionIcon>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => deleteCategory(category.id)}
          >
            <IconTrash size="25px" />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  const updateCategory = async (id) => {
    const { data, error } = await supabase
      .from("categories")
      .update({
        name: name,
        description: description,
      })
      .match({ id: categoryId });

    if (!error) {
      window.location.reload();
    }
  };
  const onSearch = (value) => {
    setSearchQuery(value);
  };

  const deleteCategory = async (id) => {
    console.log(id);
    const { error } = await supabase.from("categories").delete().eq("id", id);

    const newCategories = categories.filter((category) => category.id !== id);
    setCategories(newCategories);
  };
  return (
    <Group display="block">
      <Input
        mb="20px"
        mr="10px"
        placeholder="Search for products"
        onChange={(e) => onSearch(e.target.value)}
        rightSection={
          <ActionIcon>
            <IconSearch size="17px" />
          </ActionIcon>
        }
      />
      <Table
        striped={true}
        withBorder
        highlightOnHover
        withColumnBorders
        verticalSpacing="md"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>{categoriesRows}</tbody>
      </Table>
      <Modal
        size="xl"
        opened={openedModal}
        centered
        onClose={close}
        title="Edit Category"
      >
        <form onSubmit={form.onSubmit(updateCategory)}>
          <TextInput
            label={`New category name: `}
            placeholder="Enter new category name.."
            {...form.getInputProps("name")}
          />
          <TextInput
            label={`Enter new description: `}
            placeholder="Enter new category name.."
            {...form.getInputProps("description")}
          />
          <Button mt="20px" type="submit" onClick={close}>
            Save
          </Button>
        </form>
      </Modal>
    </Group>
  );
};

export default Categories;
