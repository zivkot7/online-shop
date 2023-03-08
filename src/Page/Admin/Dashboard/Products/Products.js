import { ActionIcon, Table, Group, Input } from "@mantine/core";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../../Config/Config";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (searchQuery) => {
    let query = supabase.from("products").select("*");

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%`);
    }

    const { data: products, error } = await query;
    setProducts(products);
  };
  useEffect(() => {
    fetchData(searchQuery);
  }, [searchQuery]);

  const rows = products.map((product) => (
    <tr key={product.id}>
      <td width="200px">
        {<img src="https://i.imgur.com/ZL52Q2D.png" width="80px" />}
      </td>
      <td>{product.name}</td>
      <td>{product.description}</td>
      <td>$ {product.sale_price}</td>
      <td
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        ${product.price}
        <Group>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => onEdit(product)}
          >
            <IconPencil size="25px" />
          </ActionIcon>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => deleteData(product.id)}
          >
            <IconTrash size="25px" />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  const onEdit = async (item) => {
    navigate(`/admin/dashboard/${item.id}`, { state: item });
  };

  const deleteData = async (id) => {
    console.log(id);
    const { error } = await supabase.from("products").delete().eq("id", id);

    const newProducts = products.filter((product) => product.id !== id);
    setProducts(newProducts);
  };
  const onSearch = (value) => {
    setSearchQuery(value);
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
            <th>Product</th>
            <th>Title</th>
            <th>Description</th>
            <th>Sale price</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Group>
  );
};

export default Products;
