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
} from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  card: {
    width: "370px",
    height: "430px",
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
  const { title, description, location, sqft, monthly_price, image, onClick } =
    props.data;
  const { classes } = useStyles();
  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size={10} className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <div className="product-card-item" onClick={onClick}>
      <Card withBorder radius="md" className={classes.card} mt="50px">
        <Card.Section className={classes.imageSection}>
          <Image
            src="https://i.imgur.com/ZL52Q2D.png"
            alt="Tesla Model S"
            onClick={open}
          />
        </Card.Section>

        <Group position="apart" mt="md">
          <div>
            <Text weight={500}>{title}</Text>
            <Text size="xs" color="dimmed">
              {description}
            </Text>
          </div>
          <Badge variant="outline" size="xs">
            25% off
          </Badge>
        </Group>

        <Card.Section className={classes.section} mt="md">
          <Text size="xs" color="dimmed" className={classes.label}>
            {description}
          </Text>

          <Group spacing={8} mb={-8}>
            {features}
          </Group>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Group spacing={30}>
            <div>
              <Text size="md" weight={700} sx={{ lineHeight: 1 }}>
                ${monthly_price}
              </Text>
              <Text
                size="xs"
                color="dimmed"
                weight={500}
                sx={{ lineHeight: 1 }}
                mt={3}
              >
                per day
              </Text>
            </div>

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
      <Modal opened={opened} onClose={close} centered>
        <Card withBorder radius="md" className={classes.card} mt="50px">
          <Card.Section className={classes.imageSection}>
            <Image
              src="https://i.imgur.com/ZL52Q2D.png"
              alt="Tesla Model S"
              onClick={open}
            />
          </Card.Section>

          <Group position="apart" mt="md">
            <div>
              <Text weight={500}>{title}</Text>
              <Text size="xs" color="dimmed">
                {description}
              </Text>
            </div>
            <Badge variant="outline" size="xs">
              25% off
            </Badge>
          </Group>

          <Card.Section className={classes.section} mt="md">
            <Text size="xs" color="dimmed" className={classes.label}>
              {description}
            </Text>

            <Group spacing={8} mb={-8}>
              {features}
            </Group>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Group spacing={30}>
              <div>
                <Text size="md" weight={700} sx={{ lineHeight: 1 }}>
                  ${monthly_price}
                </Text>
                <Text
                  size="xs"
                  color="dimmed"
                  weight={500}
                  sx={{ lineHeight: 1 }}
                  mt={3}
                >
                  per day
                </Text>
              </div>

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
