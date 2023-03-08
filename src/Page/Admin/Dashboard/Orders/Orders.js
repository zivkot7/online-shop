import { ActionIcon, Input, Table, Group } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconMail,
  IconPencil,
  IconSearch,
  IconSend,
  IconTrash,
} from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../../Config/Config";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (searchQuery) => {
    let query = supabase.from("orders").select("*");

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%`);
    }

    const { data: orders, error } = await query;
    setOrders(orders);
  };
  useEffect(() => {
    fetchData(searchQuery);
  }, [searchQuery]);

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  const deleteOrder = async (id) => {
    console.log(id);
    const { error } = await supabase.from("orders").delete().eq("id", id);

    const newOrders = orders.filter((order) => order.id !== id);
    setOrders(newOrders);
  };
  const onSentOrder = () => {
    showNotification({
      icon: <IconCheck size={18} />,
      color: "green",
      title: "Order confirmation",
      message: "Order is sent! 🙂",
    });
  };

  const rows = orders.map((order) => (
    <tr key={order.id}>
      <td>{order.id}</td>
      <td>{order.created_at}</td>
      <td>{order.updated_at}</td>
      <td>{order.user_id}</td>
      <td
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        ${order.total}
        <Group>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={onSentOrder}
          >
            <IconSend size="25px" />
          </ActionIcon>
          <ActionIcon
            size="md"
            variant="gradient"
            gradient={{ from: "yellow", to: "red" }}
            onClick={() => deleteOrder(order.id)}
          >
            <IconTrash size="25px" />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));
  return (
    <Group display="block">
      <Input
        mb="20px"
        mr="10px"
        placeholder="Search for order"
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
            <th>ID</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>User ID</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Group>
  );
};

export default Orders;
