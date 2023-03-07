import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NumberInput, Select, TextInput } from "@mantine/core";
import { Group, Button } from "@mantine/core";
import supabase from "../../../Config/Config";
import { useForm } from "@mantine/form";

const Edit = () => {
  const { state } = useLocation();
  /* console.log(state); */
  const [categories, setCategories] = useState([]);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      sale_price: "",
      salePercentage: "",
    },
  });

  const { name, description, price, quantity, category } = form.values;

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const onUpdateProductName = async () => {
    if (!name) {
      console.log("fali ime");
      return;
    }
    if (!state || !state.id) {
      console.log("fali ID");
      return;
    }
    const { data, error } = await supabase
      .from("products")
      .update({ name: name })
      .match({ id: state?.id });
  };
  const onUpdateProductDescription = async () => {
    const { data, error } = await supabase
      .from("products")
      .update({ description: description })
      .match({ id: state?.id });
  };

  const onUpdateProductPrice = async () => {
    const { data, error } = await supabase
      .from("products")
      .update({ price: price })
      .match({ id: state?.id });
  };

  const onUpdateProductQuantity = async () => {
    const { data, error } = await supabase
      .from("products")
      .update({ quantity: quantity })
      .match({ id: state?.id });
  };

  const onUpdateProductCategory = async () => {
    const { data, error } = await supabase
      .from("products")
      .update({ category_id: category })
      .match({ id: state?.id });
  };

  const updateAll = async () => {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: name || undefined,
        description: description || undefined,
        price: price || undefined,
        quantity: quantity || undefined,
        category_id: category || undefined,
      })
      .match({ id: state?.id });
  };

  return (
    <>
      <h2>Edit product</h2>
      <form onSubmit={form.onSubmit(updateAll)}>
        <TextInput
          label={`Product name: ${state?.name}`}
          placeholder="Enter new product name.."
          {...form.getInputProps("name")}
        />
        <Button onClick={onUpdateProductName}>Edit product</Button>
        <TextInput
          label={`Description: ${state?.description}`}
          placeholder="Enter new product description.."
          {...form.getInputProps("description")}
        />
        <Button onClick={onUpdateProductDescription}>Edit description</Button>
        <NumberInput
          label={`Price: $ ${state?.price}`}
          placeholder="Enter new product price.."
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
          {...form.getInputProps("price")}
        />
        <Button onClick={onUpdateProductPrice}>Edit price</Button>
        <NumberInput
          label={`Quantity: ${state?.quantity}`}
          placeholder="Enter new product quantity.."
          defaultValue={0}
          {...form.getInputProps("quantity")}
        />
        <Button onClick={onUpdateProductQuantity}>Edit quantity</Button>

        <Select
          label={`Category: ${state?.category_id}`}
          placeholder="Enter new product category.."
          data={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          {...form.getInputProps("category")}
        />
        <Button onClick={onUpdateProductCategory}>Edit Category</Button>

        <Button type="submit">Update All</Button>
      </form>
    </>
  );
};

export default Edit;
