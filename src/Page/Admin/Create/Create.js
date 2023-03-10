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

const CDNURL =
  "https://pmwutxlnihrvjlcruwaw.supabase.co/storage/v1/object/public/avatars/";

const Create = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [file, setFile] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
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

  const { name, description, price, quantity, category } = form.values;

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
      image: file,
      name,
      description,
      price,
      quantity,
      category_id: categoryId,
      user_id: auth.user.id,
    });
    if (error) {
      console.log(error);
    }
  };
  const onUploadFile = async (file) => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(file.name, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.log(error);
    } else {
      setImagePath(data);
      setFile(CDNURL + data.path);
    }
  };

  const onDashboard = () => {
    navigate("/admin/dashboard");
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
      <h1>Create product</h1>
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <TextInput
          label="Name:"
          mt="20px"
          placeholder="Product name.."
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Description:"
          placeholder="Description.."
          mt="20px"
          {...form.getInputProps("description")}
        />
        <NumberInput
          label="Price:"
          mt="20px"
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
          mt="20px"
          placeholder="Select quantity.."
          defaultValue={0}
          min={1}
          {...form.getInputProps("quantity")}
        />
        <Select
          label="Category:"
          mt="20px"
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
            onChange={onUploadFile}
            accept="image/png,image/jpeg,image/jpg"
          >
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>

          <Text size="sm" align="center" mt="sm">
            Picked file: {imagePath.path}
          </Text>
        </Group>
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
