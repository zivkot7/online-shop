import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Providers/Authentication/Authentication";
import { FaShopify } from "react-icons/fa";
import { showNotification } from "@mantine/notifications";
import { BsFillPersonFill, BsCart4 } from "react-icons/bs";
import {
  Header,
  AppShell,
  Navbar,
  Pagination,
  Text,
  Group,
  Burger,
  useMantineTheme,
  Button,
  Drawer,
  Input,
  ActionIcon,
  Radio,
  MediaQuery,
  Accordion,
} from "@mantine/core";
import { IconCheck, IconSearch } from "@tabler/icons";
import supabase from "../../Config/Config";
import ProductCardItem from "../../Components/ProductCardItem/ProductCardItem";
import ShoppingCartHeader from "../../Components/ShoppingCart/ShoppingCartHeader";
import ShoppingCartItem from "../../Components/ShoppingCart/ShoppingCartItem";
import ShoppingCartFooter from "../../Components/ShoppingCart/ShoppingCartFooter";
import { useDebouncedState } from "@mantine/hooks";

const PRODUCTS_PER_PAGE = 10;

const LandingPage = () => {
  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);
  const [openedCart, setOpenedCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useDebouncedState("", 500);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const auth = useAuth();
  /* console.log(auth); */

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const fetchData = async (searchQuery, categoryId) => {
    const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
    let query = supabase
      .from("products")
      .select("*", {
        count: "exact",
      })
      .range(offset, offset + PRODUCTS_PER_PAGE - 1);

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%`);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data: products, count, error } = await query;
    setProducts(products);
    setTotalPages(Math.ceil(count / PRODUCTS_PER_PAGE));
    console.log(count);
  };

  useEffect(() => {
    fetchData(searchQuery, selectedCategory);
    const savedCartProducts = JSON.parse(localStorage.getItem("cartProducts"));
    if (savedCartProducts) {
      setCartProducts(savedCartProducts);
    }
  }, [searchQuery, selectedCategory, currentPage]);

  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  const addToCart = (product) => {
    const isExists = cartProducts.some((cart) => {
      return cart.id === product.id;
    });
    if (isExists) {
      setCartProducts(
        cartProducts?.map((cart) => {
          if (cart.id === product.id) {
            return { ...cart, quantity: cart.quantity + 1 };
          }
          return cart;
        })
      );
    } else {
      return setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
    }
  };

  const onMinusClick = (product) => {
    const isExists = cartProducts.some((cart) => {
      return cart.id === product.id;
    });
    if (isExists) {
      setCartProducts(
        cartProducts?.map((cart) => {
          if (cart.id === product.id && cart.quantity > 1) {
            return { ...cart, quantity: cart.quantity - 1 };
          }
          return cart;
        })
      );
    } else {
      return setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
    }
  };

  const deleteProductFromCart = (id) => {
    setCartProducts(cartProducts.filter((product) => product.id !== id));
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const hideCart = () => {
    setOpenedCart(!openedCart);
  };
  const onCheckoutClick = async () => {
    const total = cartProducts.reduce((acc, cart) => {
      return cart.quantity * cart.price + acc;
    }, 0);

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: auth.user.id,
        total: total,
      })
      .single();
    if (error) {
      console.error(error);
      return;
    }

    return showNotification({
      icon: <IconCheck size={18} />,
      color: "green",
      title: "Order confirmation",
      message: "Your order is submited! 🙂",
    });
  };
  const showAllProducts = () => {
    setSelectedCategory("");
    setSearchQuery("");
  };
  return (
    <div>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
          >
            <Button
              mt="10px"
              onClick={showAllProducts}
              styles={() => ({
                root: {
                  height: "50px",
                  padding: "15px 185px 5px 20px",
                  color: "black",
                  fontWeight: "normal",
                  fontSize: "16px",
                  backgroundColor: "white",
                  border: "none",
                  borderBottom: "1px solid lightgrey",
                  borderRadius: "0px",
                  "&:not([data-disabled])": theme.fn.hover({
                    backgroundColor: "#fafafa",
                  }),
                },
              })}
            >
              Products
            </Button>
            <Accordion defaultValue={categories}>
              <Accordion.Item value="categories">
                <Accordion.Control>Categories</Accordion.Control>
                <Accordion.Panel>
                  <Radio.Group
                    orientation="vertical"
                    spacing="md"
                    size="md"
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                  >
                    {categories.map((category) => (
                      <Radio
                        key={category.id}
                        value={category.id}
                        label={category.name}
                      />
                    ))}
                  </Radio.Group>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Navbar>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaShopify size="20" color="#fb5e41" />
                    <Text
                      fw="bold"
                      ml="7px"
                      size="xl"
                      sx={{ fontFamily: "Martel, serif" }}
                    >
                      Online shop
                    </Text>
                    <Input
                      ml="180px"
                      style={{ width: "600px" }}
                      placeholder="Search for products"
                      onChange={(e) => onSearch(e.target.value)}
                      rightSection={
                        <ActionIcon>
                          <IconSearch size="17px" />
                        </ActionIcon>
                      }
                    />
                  </div>

                  {auth.user ? (
                    <Group align="center">
                      <BsFillPersonFill />
                      {auth.user.user_metadata.full_name}
                      <Drawer
                        opened={openedCart}
                        lockScroll={false}
                        onClose={() => setOpenedCart(false)}
                        padding="xl"
                        size="510px"
                        position="right"
                      >
                        <div style={{ textAlign: "center" }}>
                          <ShoppingCartHeader text={cartProducts?.length} />
                        </div>
                        <div>
                          <div>
                            {cartProducts.length === 0 ? (
                              <div
                                style={{
                                  height: "870px",
                                  textAlign: "center",
                                }}
                              >
                                No items in cart.
                              </div>
                            ) : (
                              <div
                                style={{
                                  overflowY: "scroll",
                                  minHeight: "850px",
                                  maxHeight: "850px",
                                }}
                              >
                                {cartProducts.map((product) => (
                                  <ShoppingCartItem
                                    key={product.id}
                                    product={product}
                                    onPlus={addToCart}
                                    onDelete={deleteProductFromCart}
                                    onMinus={onMinusClick}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <ShoppingCartFooter
                            total={cartProducts
                              .reduce((acc, cart) => {
                                return cart.quantity * cart.price + acc;
                              }, 0)
                              .toFixed(2)}
                            checkout={onCheckoutClick}
                          />
                        </div>
                      </Drawer>

                      <Group position="center">
                        <Button
                          size="xs"
                          variant="gradient"
                          gradient={{ from: "yellow", to: "red" }}
                          onClick={hideCart}
                        >
                          <BsCart4 size="17px" />({cartProducts?.length})
                        </Button>
                      </Group>
                      <Button
                        type="submit"
                        variant="gradient"
                        size="xs"
                        gradient={{ from: "yellow", to: "red" }}
                        onClick={onLogout}
                      >
                        Logout
                      </Button>
                    </Group>
                  ) : (
                    <Group align="center">
                      <Button
                        type="submit"
                        variant="gradient"
                        size="xs"
                        gradient={{ from: "orange", to: "red" }}
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        styles={() => ({
                          root: {
                            backgroundColor: "transparent",
                            border: "1px solid #fb5e41",
                            color: "#fb5e41",
                            "&:hover": {
                              transition: "0.2s",
                              backgroundImage: theme.fn.gradient({
                                from: "red",
                                to: "yellow",
                              }),
                              color: "white",
                            },
                          },
                        })}
                        onClick={() => navigate("/register")}
                      >
                        Register
                      </Button>
                    </Group>
                  )}
                </div>
              </Text>
            </div>
          </Header>
        }
      >
        <Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "10px 40px",
              justifyContent: "space-around",
            }}
          >
            {products.map((product) => {
              return (
                <ProductCardItem
                  data={product}
                  key={product.id}
                  onAddToCart={addToCart}
                />
              );
            })}
          </div>
          {
            <Pagination
              mt="100px"
              total={totalPages}
              onChange={onPageChange}
              position="center"
              styles={{
                control: {
                  backgroundImage: theme.fn.gradient({
                    from: "yellow",
                    to: "red",
                  }),
                  "&:last-child, &:first-of-type": { backgroundImage: "none" },
                },
              }}
            />
          }
        </Text>
      </AppShell>
    </div>
  );
};

export default LandingPage;
