import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NumberInput, Select, TextInput, Group, Checkbox } from "@mantine/core";
import { Box, Button } from "@mantine/core";
import supabase from "../../../Config/Config";
import { useForm } from "@mantine/form";

const Edit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  /* console.log(state) */

  const [categories, setCategories] = useState([]);
  const [isSale, setSale] = useState(state.is_sale);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      salePercentage: 0,
      sale_price: "",
    },
  });

  const percentage = Math.round(
    ((state?.price - state?.sale_price) / state?.price) * 100
  );

  const { name, description, price, salePercentage, quantity, category } =
    form.values;

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const updateAll = async () => {
    let total = state.price - Math.floor((salePercentage / 100) * state.price);
    const { data, error } = await supabase
      .from("products")
      .update({
        name: name || undefined,
        description: description || undefined,
        price: price || undefined,
        quantity: quantity || undefined,
        category_id: category || undefined,
        sale_price: total,
      })
      .match({ id: state?.id });
  };
  const onSale = async (e) => {
    setSale(!isSale);
    const { data, error } = await supabase
      .from("products")
      .update({ is_sale: !isSale })
      .match({ id: state.id });
  };
  const onDashboard = () => {
    navigate("/admin/dashboard/products");
  };
  const params = useParams();
  const getProduct = async (id) => {
    const { data } = await supabase
      .from("products")
      .select()
      .match({ id: id })
      .single();
    form.setValues(data);
  };
  useEffect(() => {
    getProduct(params.id);
  }, []);

  return (
    <Box
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
      mx="auto"
    >
      <h2>Edit product</h2>
      <form onSubmit={form.onSubmit(updateAll)}>
        <TextInput
          label={`Product name: `}
          {...form.getInputProps("name")}
          mt="20px"
        />
        <TextInput
          label={`Description: `}
          mt="20px"
          placeholder="Enter new product description.."
          {...form.getInputProps("description")}
        />
        <NumberInput
          label={`Price: `}
          mt="20px"
          min={0}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
          {...form.getInputProps("price")}
        />
        <NumberInput
          min={0}
          mt="20px"
          label={`Quantity: `}
          defaultValue={0}
          {...form.getInputProps("quantity")}
        />
        <NumberInput
          min={0}
          max={99}
          mt="20px"
          label={`Current sale: ${state.is_sale ? percentage : ""}%`}
          {...form.getInputProps("salePercentage")}
        />

        <Checkbox
          mb="20px"
          mt="5px"
          checked={isSale}
          onChange={onSale}
          label="Sale"
        />

        <Select
          label={`Category: `}
          data={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          {...form.getInputProps("category_id")}
        />

        <Button
          mt="20px"
          variant="gradient"
          gradient={{ from: "yellow", to: "red" }}
          type="submit"
        >
          Update All
        </Button>
      </form>
      <Button mt="20px" mb="20px" onClick={onDashboard}>
        Back to dashboard
      </Button>
    </Box>
  );
};

export default Edit;
