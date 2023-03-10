import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  createStyles,
  Center,
  Modal,
  Button,
  ScrollArea,
  Box,
} from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";

const useStyles = createStyles((theme) => ({
  card: {
    width: "400px",
    height: "470px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 0px 8px -1px rgba(0,0,0,0.75)",
    justifyContent: "space-between",
    paddingBottom: "50px",
    marginBottom: "30px",
    marginTop: "25px",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: -0.25,
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  modalDescriptionSection: {
    padding: theme.spacing.md,
    height: "200px",
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: 5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

const mockdata = [
  { label: "4 passengers", icon: IconUsers },
  { label: "100 km/h in 4 seconds", icon: IconGauge },
  { label: "Automatic gearbox", icon: IconManualGearbox },
  { label: "Electric", icon: IconGasStation },
];

const ProductCardItem = (props) => {
  const [opened, { close, open }] = useDisclosure(false);

  const { name, description, quantity, sale_price, price, image, onClick } =
    props.data;

  const { classes } = useStyles();
  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size={10} className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  const percentage = useMemo(() => {
    return Math.round(((price - sale_price) / price) * 100);
  }, [price, sale_price]);

  return (
    <div className="product-card-item" onClick={onClick}>
      <Card withBorder radius="md" className={classes.card}>
        <Card.Section className={classes.imageSection}>
          <Image src={image} onClick={open} width="230px" />
        </Card.Section>
        <Group position="apart" mt="md">
          <Text weight={500} size="xl">
            {name}
          </Text>
          {sale_price ? (
            <Badge variant="outline" size="md">
              {percentage}%
            </Badge>
          ) : (
            ""
          )}
        </Group>
        <Text size="xs" color="dimmed">
          Quantity: {quantity}
        </Text>
        <Card.Section className={classes.section} mt="md">
          <Text size="xs" color="dimmed" className={classes.label}>
            Features
          </Text>
          <Group spacing={8} mb={-8}>
            {features}
          </Group>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Group spacing={30}>
            {sale_price ? (
              <Group style={{ display: "flex", flexDirection: "column" }}>
                <Text size="xl" color="red" weight={700} sx={{ lineHeight: 0 }}>
                  $ {sale_price}
                </Text>
                <Text
                  size="sm"
                  color="dimmed"
                  weight={700}
                  sx={{ lineHeight: 1 }}
                  style={{ textDecoration: "line-through" }}
                >
                  $ {price.toLocaleString()}
                </Text>
              </Group>
            ) : (
              <Text size="xl" weight={700} sx={{ lineHeight: 1 }}>
                $ {price.toLocaleString()}
              </Text>
            )}
            <Button
              radius="md"
              style={{ flex: 1 }}
              variant="gradient"
              gradient={{ from: "yellow", to: "red" }}
              onClick={() => props.onAddToCart(props.data)}
            >
              Add to cart
            </Button>
          </Group>
        </Card.Section>
      </Card>
      <Modal opened={opened} onClose={close} centered size="lg">
        <Card withBorder radius="md">
          <Card.Section className={classes.imageSection}>
            <Image src={image} alt="Tesla Model S" onClick={open} />
          </Card.Section>

          <Group position="apart" mt="10px">
            <Text weight={500} size="xl">
              {name}
            </Text>
            {sale_price ? (
              <Badge variant="outline" size="md">
                {percentage}%
              </Badge>
            ) : (
              ""
            )}
          </Group>

          <Card.Section className={classes.modalDescriptionSection} mt="md">
            <Group position="apart">
              <Text size="xs" color="dimmed" className={classes.label}>
                Description :
              </Text>
              <Text size="md" color="dimmed">
                Quantity: {quantity}
              </Text>
            </Group>
            <ScrollArea h={150}>
              <Box w={200}>{description}</Box>
            </ScrollArea>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Group spacing={30}>
              {sale_price ? (
                <Group style={{ display: "flex", flexDirection: "column" }}>
                  <Text
                    size="xl"
                    color="red"
                    weight={700}
                    sx={{ lineHeight: 0 }}
                  >
                    $ {sale_price}
                  </Text>
                  <Text
                    size="sm"
                    color="dimmed"
                    weight={700}
                    sx={{ lineHeight: 1 }}
                    style={{ textDecoration: "line-through" }}
                  >
                    $ {price.toLocaleString()}
                  </Text>
                </Group>
              ) : (
                <Text size="xl" weight={700} sx={{ lineHeight: 1 }}>
                  $ {price.toLocaleString()}
                </Text>
              )}
              <Text
                size="xs"
                color="dimmed"
                weight={500}
                sx={{ lineHeight: 1 }}
                mt={3}
              ></Text>
              <Button
                radius="md"
                style={{ flex: 1 }}
                variant="gradient"
                gradient={{ from: "yellow", to: "red" }}
                onClick={() => props.onAddToCart(props.data)}
              >
                Add to cart
              </Button>
            </Group>
          </Card.Section>
        </Card>
      </Modal>
    </div>
  );
};

export default ProductCardItem;
