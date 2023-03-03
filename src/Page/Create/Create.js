import React, { useState } from "react";
import supabase from "../../Config/Config";
import { Button, Box, TextInput, NumberInput } from "@mantine/core";

const Create = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from("products").insert({
      name,
      description,
      price,
      image,
      quantity,
    });
    return (
      setName(""), setDescription(""), setPrice(0), setQuantity(0), setImage("")
    );

    /* const onUploadFile = async (file) => {
      const { data, error } = await supabase.storage
        .from("apartments")
        .upload(file.name, file, { cacheControl: "3600", upsert: false });
      console.log(data);

      const { data: finalData } = supabase.storage
        .from("apartmants")
        .getPublicUrl(data.Key);

      console.log(finalData);
    }; */
  };
  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={onSubmit}>
        <h1>Create product</h1>
        <TextInput
          label="Name:"
          name="name"
          type="text"
          placeholder="Product name.."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Description:"
          name="description"
          type="text"
          placeholder="Description.."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <NumberInput
          label="Quantity:"
          placeholder="Select quantity.."
          defaultValue={0}
          value={quantity}
          onChange={(val) => setQuantity(val)}
        />
        <NumberInput
          label="Price:"
          name="price"
          placeholder="Enter your price.."
          value={price}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
          onChange={(val) => setPrice(val)}
        />
        <br />
        <Button
          type="submit"
          onClick={onSubmit}
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
