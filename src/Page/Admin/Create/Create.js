import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextInput,
  NumberInput,
  FileButton,
  Group,
  Text,
  Select,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/hooks";
import { createClient } from "@supabase/supabase-js";
import supabase from "../../../Config/Config";
import { useForm } from "@mantine/form";
import { useAuth } from "../../../Providers/Authentication/Authentication";

const Create = () => {
  const auth = useAuth();
  const [file, setFile] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
      console.log(data);
    };

    fetchCategories();
  }, []);

  const form = useForm({
    initialValues: {
      image: "",
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      category: "",
    },
  });

  const { image, name, description, price, quantity } = form.values;

  const onHandleCategorySubmit = async (event) => {
    event.preventDefault();

    const { data: categories } = await supabase
      .from("categories")
      .insert({ name: newCategory, user_id: auth.user.id });
  };

  const onHandleSubmit = async () => {
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .eq("name", newCategory)
      .single();

    let categoryId;

    if (!categories) {
      const { data: addCategory } = await supabase
        .from("categories")
        .insert({ name: newCategory });

      categoryId = addCategory?.id;
    } else {
      categoryId = categories?.id;
    }
    const { data, error } = await supabase.from("products").insert({
      image,
      name,
      description,
      price,
      quantity,
      category_id: categoryId,
    });
  };
  const onUploadFile = async (file) => {
    const { data, error } = await supabase.storage
      .from("products")
      .upload(file.name, file, { cacheControl: "3600", upsert: false });
    console.log(data);

    /* const { data: finalData } = supabase.storage
      .from("products")
      .getPublicUrl(data);
    setFile(finalData);
    console.log(data); */
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <h1>Create category</h1>
      <Group>
        <TextInput
          label="New Category:"
          placeholder="New Category.."
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button
          type="submit"
          variant="gradient"
          onClick={onHandleCategorySubmit}
          gradient={{ from: "yellow", to: "red" }}
        >
          Create category
        </Button>
      </Group>
      <h1>Create product</h1>
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <TextInput
          label="Name:"
          placeholder="Product name.."
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Description:"
          placeholder="Description.."
          {...form.getInputProps("description")}
        />
        <NumberInput
          label="Price:"
          placeholder="Enter your price.."
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
          {...form.getInputProps("price")}
        />
        <NumberInput
          label="Quantity:"
          placeholder="Select quantity.."
          defaultValue={0}
          {...form.getInputProps("quantity")}
        />
        <Select
          label="Category:"
          data={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          {...form.getInputProps("category")}
        />
        <br />
        <Group position="center">
          <FileButton
            onChange={onUploadFile}
            accept="image/png,image/jpeg,image/jpg"
          >
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>
        </Group>

        {file && (
          <Text size="sm" align="center" mt="sm">
            Picked file: {file.name}
          </Text>
        )}

        <br />
        <Button
          type="submit"
          variant="gradient"
          gradient={{ from: "yellow", to: "red" }}
        >
          Add product
        </Button>
      </form>
    </Box>
  );
};

export default Create;
