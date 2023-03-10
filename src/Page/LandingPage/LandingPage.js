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
  const [productQuantities, setProductQuantities] = useState(0);

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
    setProductQuantities(
      products.reduce((acc, product) => {
        acc[product.id] = product.quantity;
        return acc;
      }, {})
    );
    setTotalPages(Math.ceil(count / PRODUCTS_PER_PAGE));
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
      const updatedCartProducts = cartProducts.map((cart) => {
        if (cart.id === product.id) {
          const newQuantity = cart.quantity + 1;
          console.log(newQuantity);
          if (newQuantity <= productQuantities[product.id]) {
            return { ...cart, quantity: newQuantity };
          } else {
            return cart;
          }
        }
        return cart;
      });
      setCartProducts(updatedCartProducts);
    } else {
      return setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
    }
  };

  const onPlus = (product) => {
    const isExists = cartProducts.some((cart) => cart.id === product.id);

    if (isExists) {
      const updatedCartProducts = cartProducts.map((cart) => {
        if (cart.id === product.id) {
          const newQuantity = cart.quantity + 1;

          if (newQuantity <= productQuantities[product.id]) {
            return { ...cart, quantity: newQuantity };
          }
        }
        return cart;
      });
      setCartProducts(updatedCartProducts);
    } else {
      setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
    }
  };

  const onMinusClick = (product) => {
    const updatedCartProducts = cartProducts.map((cart) => {
      if (cart.id === product.id && cart.quantity > 1) {
        return { ...cart, quantity: cart.quantity - 1 };
      }
      return cart;
    });
    setCartProducts(updatedCartProducts);
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
    let total = cartProducts.reduce((acc, cart) => {
      return cart.quantity * cart.price + acc;
    }, 0);

    for (const cart of cartProducts) {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", cart.id)
        .single();

      if (productError) {
        console.error(productError);
        return;
      }

      const newQuantity = productData.quantity - cart.quantity;

      const { data: updateData, error: updateError } = await supabase
        .from("products")
        .update({ quantity: newQuantity })
        .eq("id", cart.id);

      if (updateError) {
        console.error(updateError);
        return;
      }
    }

    const { data, error: errorOrder } = await supabase
      .from("orders")
      .upsert({
        user_id: auth.user.id,
        total: total,
      })
      .select("id");
    const orderId = data[0].id;
    console.log("order id:", orderId);

    if (errorOrder) {
      console.error(errorOrder);
      return;
    }
    console.log("order:", data);
    if (!data) {
      console.error("Failed to create order");
      return;
    } else {
    }

    for (const cart of cartProducts) {
      const { data, error } = await supabase
        .from("order_products")
        .insert({
          user_id: auth.user.id,
          product_id: cart.id,
          order_id: orderId,
        })
        .single();

      console.log("cart:", cart);
    }

    setCartProducts([]);

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
                    <FaShopify size="25" color="#fb5e41" />
                    <Text
                      fw="bold"
                      ml="7px"
                      size="30px"
                      sx={{ fontFamily: "Martel, serif" }}
                    >
                      Online shop
                    </Text>
                    <Input
                      ml="130px"
                      styles={() => ({
                        wrapper: {
                          backgroundColor: "transparent",
                          width: "600px",
                          color: "#fb5e41",
                          "&:hover": {
                            transition: "all .3s ease-in-out",
                            transform: "scale(1.05)",
                          },
                        },
                      })}
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
                      <BsFillPersonFill size="20px" />
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
                                    onPlus={onPlus}
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
                          styles={() => ({
                            root: {
                              "&:hover": {
                                transition: "all .2s ease-in-out",
                                transform: "scale(1.1)",
                              },
                            },
                          })}
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
                        styles={() => ({
                          root: {
                            "&:hover": {
                              transition: "all .2s ease-in-out",
                              transform: "scale(1.1)",
                            },
                          },
                        })}
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
                        styles={() => ({
                          root: {
                            "&:hover": {
                              transition: "all .2s ease-in-out",
                              transform: "scale(1.1)",
                            },
                          },
                        })}
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
                              transition: "all .2s ease-in-out",
                              transform: "scale(1.05)",
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
                  boxShadow: "0px 0px 4px -1px rgba(0,0,0,0.75)",
                  backgroundImage: theme.fn.gradient({
                    from: "yellow",
                    to: "red",
                  }),
                  "&:last-child, &:first-of-type": { backgroundImage: "none" },
                  "&:hover": {
                    transition: "all .2s ease-in-out",
                    transform: "scale(1.1)",
                  },
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
