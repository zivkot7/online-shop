import {
  Burger,
  Input,
  Radio,
  ActionIcon,
  Drawer,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const BurgerBar = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Burger
        opened={opened}
        onClick={() => setOpened((o) => !o)}
        size="sm"
        color={theme.colors.gray[6]}
        mr="xl"
      />
      <Drawer
        opened={opened}
        lockScroll={false}
        onClose={() => setOpened(false)}
        title="Search store:"
        padding="xl"
        size="lg"
        overlayOpacity={0}
        closeOnClickOutside={true}
      >
        <Input
          mt={20}
          placeholder="Search for products"
          rightSection={
            <ActionIcon>
              <IconSearch size="17px" />
            </ActionIcon>
          }
        />
        <NavLink label="Kategories" childrenOffset={28} mt="15px">
          <Radio.Group orientation="vertical" spacing="sm" size="xs">
            <Radio value="kat1" label="1 child link" />
            <Radio value="kat2" label="2 child link" />
            <Radio value="kat3" label="3 child link" />
            <Radio value="kat4" label="4 child link" />
            <Radio value="kat5" label="5 child link" />
            <Radio value="kat6" label="6 child link" />
            <Radio value="kat7" label="7 child link" />
            <Radio value="kat8" label="8 child link" />
            <Radio value="kat9" label="9 child link" />
            <Radio value="kat10" label="10 child link" />
          </Radio.Group>
        </NavLink>
      </Drawer>
    </>
  );
};

export default BurgerBar;
