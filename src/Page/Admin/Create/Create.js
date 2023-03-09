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
import supabase from "../../../Config/Config";
import { useForm } from "@mantine/form";
import { useAuth } from "../../../Providers/Authentication/Authentication";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [file, setFile] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
      /* console.log(data); */
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setData(
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    );
  }, [categories]);

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

  const { image, name, description, price, quantity, category, user_id } =
    form.values;
  const createCategory = async (name) => {
    const { data: categories } = await supabase
      .from("categories")
      .insert({ name: name, user_id: auth.user.id });
  };

  const onHandleSubmit = async () => {
    let categoryId;

    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .eq("name", category)
      .single();

    if (!categories) {
      const { data: addCategory } = await supabase
        .from("categories")
        .insert({ name: category });

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
      user_id: auth.user.id,
    });
  };
  /* const onUploadFile = async (file) => {
    const { data, error } = await supabase.storage
      .from("products")
      .upload(file.name, file, { cacheControl: "3600", upsert: false });
    console.log(data);

    const { data: finalData } = supabase.storage
      .from("products")
      .getPublicUrl(data);
    setFile(finalData);
    console.log(data);
  }; */

  const onDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
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
          min={1}
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
          min={1}
          {...form.getInputProps("quantity")}
        />
        <Select
          label="Category:"
          data={data}
          creatable
          searchable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={async (query) => {
            const item = { value: query, label: query };
            setData((current) => [...current, item]);
            await createCategory(query);
            return item;
          }}
          {...form.getInputProps("category")}
        />
        <br />
        <Group position="center">
          <FileButton
            /* onChange={onUploadFile} */
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
      <Button mt="20px" onClick={onDashboard}>
        Back to dashboard
      </Button>
    </Box>
  );
};

export default Create;
