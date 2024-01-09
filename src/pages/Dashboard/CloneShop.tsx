import { useState, useContext, useEffect, useRef } from "react";

import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";

import Sidebar from "components/Layout/Sidebar";
import CloneItem from "components/CloneShop/CloneItem";
import MyCart from "components/CloneShop/MyCart";
import ModalBuyPlant from "components/CloneShop/ModalBuyPlant";
import ModalSpeedUp from "components/CloneShop/ModalSpeedUp";
import ModalPurchase from "components/CloneShop/ModalPurchase";
import ModalSuccessPurchase from "components/CloneShop/ModalSuccessPurchase";
import MyCartMobile from "components/CloneShop/Mobile/MyCartMobile";
import { toast } from "react-toastify";
import CloneItemMobile from "components/CloneShop/Mobile/CloneItemMobile";
import { Skeleton } from "@mui/material";
import Dropdown from "components/common/Dropdown";
import api from "utils/api";
import "styles/cloneshop.scss";
import "react-toastify/dist/ReactToastify.css";
import filter from "assets/images/Filter.png";
import { Scrollbars } from "rc-scrollbars";
import { FaSearch, FaCheck } from "react-icons/fa";

export interface Item {
  id: number;
  name: string;
  stock: number;
  image: string;
  buy_price: number;
  harvest_rate: number;
  clone_rooting_period: number;
  vegetation_mass_period: number;
  flowering_preharvest_period: number;
  harvest_period: number;
  curing_period: number;
  drying_period: number;
  packing_period: number;
}

export interface CartItemInfo {
  id: number;
  user_id: number;
  seed_id: number;
  name: string;
  purchase_amount: number;
  method_botanicare: boolean;
  method_rhizo: boolean;
  method_silica: boolean;
  pga_amount: number;
  image: string;
  buy_price: number;
  payment_method: number;
  price_sum: number;
}

const CloneShop = () => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user, setUser } = useContext(MyAuthContext);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSpeedUpModal, setShowSpeedUpModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<Item>();
  const [items, setItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<CartItemInfo[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessPurchaseModal, setShowSuccessPurchaseModal] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("-purchased_count");
  const [stockInCart, setStockInCart] = useState(0);
  const [priceSum, setPriceSum] = useState(0);
  const [loadingCloneItem, setLoadingCloneItem] = useState(true);
  const [loadingCloneCart, setLoadingCloneCart] = useState(true);
  const [loadingAddCart, setLoadingAddCart] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [cloneContainerWidth, setCloneContainerWidth] = useState<number>(0);
  const myCloneContainerRef = useRef<HTMLDivElement | null>(null);

  const column = cloneContainerWidth < 800;

  // const addItem = (newItem: Item) => {
  //   setItems(prevItems => [...prevItems, newItem]);
  // };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleGetItem();
    }
  };

  const onSearch = () => {
    if (searchQuery) {
      handleGetItem();
    }
  };

  const updateCloneContainerWidth = () => {
    if (myCloneContainerRef.current) {
      const { width } = myCloneContainerRef.current!.getBoundingClientRect();
      setCloneContainerWidth(width);
    }
  };

  const handleGetItem = () => {
    setLoadingCloneItem(true);
    setTimeout(() => {
      api
        .get(`shop/seed/list/?search=${searchQuery}&ordering=${sort}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            // data.map
            const transformedData: Item[] = data.map((item: any) => {
              return {
                id: item.id,
                name: item.name,
                stock: item.stock,
                image: item.cover_img,
                buy_price: item.buy_price,
                harvest_rate: item.harvest_rate,
                clone_rooting_period: 14,
                vegetation_mass_period: item.vegetation_mass_period,
                flowering_preharvest_period: item.flowering_preharvest_period,
                harvest_period: item.harvest_period,
                curing_period: item.curing_period,
                drying_period: item.drying_period,
                packing_period: item.packing_period,
              };
            });
            setItems(transformedData);
          }
          // notice
          setLoadingCloneItem(false);
          console.log("get seed data", data);
        })
        .catch((err) => {
          console.log("get seed data error", err);
          setLoadingCloneItem(false);
        });
    }, 100);
  };

  const onCloseBuyModal = () => {
    setShowBuyModal(false);
  };

  const onSpeedUp = (quantity: number) => {
    setUser((prevUser: typeof MyAuthContext) => ({
      ...prevUser,
      quantity: quantity.toString(),
    }));

    setShowBuyModal(false);
    setShowSpeedUpModal(true);
  };

  const onPriceSum = (price: number) => {
    setPriceSum(price);
  };

  const onCloseSpeedUpModal = () => {
    setShowSpeedUpModal(false);
  };

  const onBuyItem = (
    quantity: number,
    payment_method: number,
    price_sum: number
  ) => {
    // if (selectedCartItem) {
    //   setCartItems(prevItems => [...prevItems, selectedCartItem]);
    // }
    setLoadingAddCart(true);
    //const existingCartItem = cartItems.find((item) => item.seed_id === selectedCartItem?.id && item.payment_method === payment_method);

    // if (existingCartItem) {
    //   // If an existing cart item with the same seed_id is found, update purchase_amount
    //   const new_amount = (existingCartItem.purchase_amount + quantity).toFixed(1);
    //   const updated_amount = Number.parseFloat(new_amount);
    //   const price_sum = Number.parseFloat(existingCartItem.price_sum + user.price_sum);
    //   api.patch(`shop/cart/${existingCartItem.id}/`, {
    //     seed: existingCartItem.seed_id,
    //     user: user.user_id,
    //     purchased_amount: updated_amount,
    //     method_botanicare: user.methodBotani ? Number(existingCartItem.method_botanicare) + 1 : 0,
    //     method_rhizo: user.methodRhizo ? Number(existingCartItem.method_rhizo) +1 : 0,
    //     method_silica: user.methodSilica ? Number(existingCartItem.method_silica) +1 : 0,
    //       payment_method: user.payment_method,
    //       price_sum: price_sum,
    //     status: 0,
    //   }).then((res: any) => {
    //     const data = res.data;
    //     if (res.data && Object.keys(data).length > 0) {
    //       const newCart: CartItemInfo = {
    //         id: data.id,
    //         user_id: data.user,
    //         seed_id: data.seed,
    //         name: data.name,
    //         method_botanicare: data.method_botanicare,
    //         method_rhizo: data.method_rhizo,
    //         method_silica: data.method_silica,
    //         purchase_amount: data.purchased_amount,
    //         pga_amount: getPGABalance(data.method_botanicare, data.method_rhizo, data.method_silica),
    //         image: data.cover_img,
    //         buy_price: data.seed_price,
    //           payment_method: data.payment_method,
    //           price_sum: data.price_sum
    //       };
    //       addCartItem(newCart);
    //       toast.success("Add to cart success.");
    //     }
    //   }).catch(err => {
    //     console.log(err);
    //     toast.error("Failed to add cart");
    //   });
    //   setLoadingAddCart(false);
    //   setShowBuyModal(false);
    //   setShowSpeedUpModal(false);
    // } else {
    // If no existing cart item with the same seed_id is found, add the new item
    api
      .post(`shop/${user.user_id}/cart/`, {
        seed: selectedCartItem?.id,
        user: user.user_id,
        purchased_amount: quantity,
        method_botanicare: user.methodBotani ? 1 : 0,
        method_rhizo: user.methodRhizo ? 1 : 0,
        method_silica: user.methodSilica ? 1 : 0,
        payment_method: user.payment_method,
        price_sum: price_sum,
        status: 0,
      })
      .then((res: any) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          const newCart: CartItemInfo = {
            id: data.id,
            user_id: data.user,
            seed_id: data.seed,
            name: data.name,
            purchase_amount: data.purchased_amount,
            method_botanicare: data.method_botanicare,
            method_rhizo: data.method_rhizo,
            method_silica: data.method_silica,
            pga_amount:
              data.payment_method == 0
                ? data.price_sum
                : getPGABalance(
                    data.method_botanicare,
                    data.method_rhizo,
                    data.method_silica
                  ),
            image: data.cover_img,
            buy_price: data.seed_price,
            payment_method: data.payment_method,
            price_sum: data.price_sum,
          };
          addCartItem(newCart);
          toast.success("Add to cart success.");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add cart");
      });
    setLoadingAddCart(false);
    setShowBuyModal(false);
    setShowSpeedUpModal(false);
    // }
  };

  const addCartItem = (newCart: CartItemInfo) => {
    // const existingCartItem = cartItems.find((item) => item.seed_id === newCart.seed_id && item.payment_method === newCart.payment_method);
    //
    // if (existingCartItem) {
    //   // If an existing cart item with the same seed_id is found, update purchase_amount
    //   const updatedCartItems = cartItems.map((item) =>
    //     item.seed_id === newCart.seed_id && item.payment_method === newCart.payment_method
    //       ? { ...item
    //         , purchase_amount: newCart.purchase_amount
    //         , method_botanicare: newCart.method_botanicare
    //         , method_rhizo: newCart.method_rhizo
    //         , method_silica: newCart.method_silica
    //         , pga_amount: newCart.pga_amount
    //         , price_sum: newCart.price_sum
    //         }
    //       : item
    //   );
    //   console.log("updatedCartItems", updatedCartItems);
    //   setCartItems(updatedCartItems);
    // } else {
    // If no existing cart item with the same seed_id is found, add the new item
    setCartItems([...cartItems, newCart]);
    // }
  };

  const getPGABalance = (
    botani_state: number,
    rhizo_state: number,
    silica_state: number
  ) => {
    let pga_amount = 0;
    if (botani_state == 1) {
      pga_amount += user.botaniPrice;
    }

    if (rhizo_state == 1) {
      pga_amount += user.rhizoPrice;
    }

    if (silica_state == 1) {
      pga_amount += user.silicaPrice;
    }

    return pga_amount;
  };

  const handleSelectItem = (idx: number) => {
    setSelectedCartItem(items.find((item) => item.id === idx));
    const existingCartItem = cartItems.find((item) => item.seed_id === idx);
    if (existingCartItem) {
      setStockInCart(existingCartItem.purchase_amount);
    } else {
      setStockInCart(0);
    }

    setUser((prevUser: typeof MyAuthContext) => ({
      ...prevUser,
      methodBotani: false,
      methodRhizo: false,
      methodSilica: false,
      quantity: "0",
    }));
    setShowBuyModal(true);
    // alert(id);
  };

  const handleGetCartItems = () => {
    // setCartItems(items);
    setLoadingCloneCart(true);
    setTimeout(() => {
      api
        .get(`shop/${user.user_id}/cart/`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            const transformedData: CartItemInfo[] = data.map((item: any) => {
              return {
                id: item.id,
                user_id: item.user,
                seed_id: item.seed,
                name: item.name,
                purchase_amount: item.purchased_amount,
                method_botanicare: item.method_botanicare,
                method_rhizo: item.method_rhizo,
                method_silica: item.method_silica,
                pga_amount: getPGABalance(
                  item.method_botanicare,
                  item.method_rhizo,
                  item.method_silica
                ),
                payment_method: item.payment_method,
                price_sum: item.price_sum,
                image: item.cover_img,
                buy_price: item.seed_price,
              };
            });

            setCartItems(transformedData);
          }
          // notice
          console.log("get cart data", data);
          setLoadingCloneCart(false);
        })
        .catch((err) => {
          console.log("get cart data error", err);
          setLoadingCloneCart(false);
        });
    }, 200);
  };

  const onPurchase = () => {
    setLoadingConfirm(true);
    api
      .post(`shop/${user.user_id}/purchase/`, {})
      .then((res: any) => {
        const data = res.data;
        // toast.success("add success.");
        if (data.type == "success") {
          localStorage.setItem("balance", data.balance); // set token -> this means logged in
          setUser((prevUser: typeof MyAuthContext) => ({
            ...prevUser,
            balance: data.balance,
          }));
          localStorage.setItem("pga_balance", data.pga_balance); // set token -> this means logged in
          setUser((prevUser: typeof MyAuthContext) => ({
            ...prevUser,
            pga_balance: data.pga_balance,
          }));
          handleGetItem();
        }
        setShowPurchaseModal(false);
        setShowSuccessPurchaseModal(true);
        setCartItems([]);
        setLoadingConfirm(false);
      })
      .catch((err) => {
        const responseData = err.response.data;
        // Handle the response data in case of an error
        // You can access the properties of the responseData object

        if (responseData.type == "failure") {
          // alert(responseData.message);
          toast.error(responseData.detail);
        } else {
          toast.error("Confirm failed.");
        }

        console.log(err);
        setLoadingConfirm(false);
      });
  };

  const onDelCart = (idx: number) => {
    // console.log(idx);
    // setLoadingCloneCart(true);
    api
      .delete(`shop/cart/${idx}/`, {})
      .then((res: any) => {
        toast.success("delete cart success.");
        setCartItems(cartItems.filter((item) => item.id !== idx));
        // setLoadingCloneCart(false);
      })
      .catch((err) => {
        toast.error("delete failed.");
        console.log(err);
        // setLoadingCloneCart(false);
      });
  };

  const onClosePurchase = () => {
    setShowPurchaseModal(false);
  };

  const onCheckout = () => {
    setShowPurchaseModal(true);
  };

  const onCloseSuccessPurchase = () => {
    setShowSuccessPurchaseModal(false);
  };

  const onBack = () => {
    setShowSpeedUpModal(false);
    setShowBuyModal(true);
  };

  useEffect(() => {
    if (user?.token) {
      handleGetCartItems();
    }
  }, []);

  useEffect(() => {
    handleGetItem();
  }, [sort]);

  useEffect(() => {
    if (myCloneContainerRef.current) {
      updateCloneContainerWidth();
    }

    const handleResize = () => {
      updateCloneContainerWidth();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDropdownChange = (order: string) => {
    setSort(order);
    setOpen(false);
  };

  const onSpeedUpItem = (itemPrice: number) => {
    onBuyItem(
      parseFloat(user.quantity),
      parseFloat(user.payment_method),
      user.payment_method === 0 ? priceSum + itemPrice : priceSum
    );
  };

  const formatNumber = (price: string, fixed_count: number): string => {
    let formattedPrice = Number(price).toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  if (isMobile) {
    return (
      <>
        <div className="w-full flex px-8 mt-7 mb-5">
          <div className="relative flex-1 pr-2">
            <input
              type="input"
              className="w-full h-12 py-1 pl-10 rounded-md shadow-sm"
              placeholder="Search"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <FaSearch
              className="absolute top-4 left-3 mr-3 flex-none text-xl"
              onClick={onSearch}
            />
          </div>
          <div className=" pl-2 text-right">
            <Dropdown
              open={open}
              onclose={handleOpen}
              trigger={
                <div
                  className="!bg-white h-12 w-12 flex justify-center items-center rounded-md float-right"
                  onClick={handleOpen}
                >
                  <img src={filter} />
                </div>
              }
              menu={[
                <button
                  onClick={() => handleDropdownChange("-purchased_count")}
                  className={`${
                    sort == "-purchased_count" ? "" : "pl-7"
                  } flex items-center`}
                >
                  {sort == "-purchased_count" ? (
                    <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                  ) : (
                    ""
                  )}{" "}
                  Sort by Popular
                </button>,
                <button
                  onClick={() => handleDropdownChange("-buy_price")}
                  className={`${
                    sort == "-buy_price" ? "" : "pl-7"
                  } flex items-center`}
                >
                  {sort == "-buy_price" ? (
                    <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                  ) : (
                    ""
                  )}{" "}
                  Sort by Price
                </button>,
                <button
                  onClick={() => handleDropdownChange("-total_period")}
                  className={`${
                    sort == "-total_period" ? "" : "pl-7"
                  } flex items-center`}
                >
                  {sort == "-total_period" ? (
                    <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                  ) : (
                    ""
                  )}{" "}
                  Sort by Period
                </button>,
                <button
                  onClick={() => handleDropdownChange("-stock")}
                  className={`${
                    sort == "-stock" ? "" : "pl-7"
                  } flex items-center`}
                >
                  {sort == "-stock" ? (
                    <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                  ) : (
                    ""
                  )}{" "}
                  Sort by Stock
                </button>,
              ]}
            />
          </div>
        </div>
        <div className="px-8 pb-20">
          {loadingCloneItem ? (
            <ul className="grid grid-cols-1 gap-4 my-1 list-none ">
              {Array.from({ length: 3 }).map((_, index) => (
                <li
                  className="clone-item px-8 py-4 pr-10 bg-white rounded-5 w-full"
                  key={index}
                >
                  <section>
                    <div className="flex w-full items-center">
                      <div className="img-plant w-1/2">
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={50}
                          height={50}
                          className=""
                        />
                      </div>
                      <div className="w-1/2 text-right">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          width={80}
                          className="float-right"
                        />
                      </div>
                    </div>
                    <div className="flex mt-5 w-full items-end">
                      <div className="w-2/3 text-left">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={25}
                          width={80}
                          className="mb-1"
                        />
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={20}
                          width={150}
                        />
                      </div>
                      <div className="w-1/3 text-right">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          width={56}
                          height={32}
                          className="float-right"
                        />
                      </div>
                    </div>
                  </section>
                </li>
              ))}
            </ul>
          ) : items.length === 0 ? (
            <div className="my-6 py-2 bg-green/10 text-center rounded">
              <label>no item</label>
            </div>
          ) : (
            <CloneItemMobile cards={items} onSelect={handleSelectItem} />
          )}
        </div>
        {cartItems.length === 0 ? (
          <></>
        ) : (
          <MyCartMobile cartItemList={cartItems} />
        )}
        {selectedCartItem && (
          <>
            <ModalBuyPlant
              isOpen={showBuyModal}
              onClose={onCloseBuyModal}
              onSpeedUp={onSpeedUp}
              onPriceSum={onPriceSum}
              onBuy={onBuyItem}
              cartItem={selectedCartItem}
              stockInCart={stockInCart}
              isLoading={loadingAddCart}
            />
            <ModalSpeedUp
              isOpen={showSpeedUpModal}
              onClose={onCloseSpeedUpModal}
              onBack={onBack}
              onBuy={onSpeedUpItem}
              cartItem={selectedCartItem}
              priceSum={priceSum}
              isLoading={loadingAddCart}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {isTablet ? <></> : <Sidebar />}
      <div className={`${isTablet ? "!ml-0" : ""} page-content !pr-0 flex`}>
        <div className="flex-1 pt-24">
          <div className="flex w-full">
            <div className="w-1/2 text-left">
              <label className="text-4xl font-bold mb-2">Clone Store</label>
            </div>
            <div className="w-1/2 pr-9 -mt-6 flex items-center justify-end">
              <div
                className="pl-4 py-2 bg-white rounded-l-lg relative"
                style={{ minWidth: "96px" }}
              >
                <label className="block pl-2 text-black">Plants</label>
                <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                  {formatNumber(user.plants, 0)}
                </label>
              </div>
              <div className="bg-white flex px-2 items-center h-full">
                <hr className="h-6 bg-black" style={{ width: "2px" }}></hr>
              </div>
              <div
                className="py-2 bg-white relative"
                style={{ minWidth: "96px" }}
              >
                <label className="block pl-2 text-black">Harvest</label>
                <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                  {formatNumber(user.harvest, 1)}g
                </label>
              </div>
              <div className="bg-white flex px-2 items-center h-full">
                <hr className="h-6 bg-black" style={{ width: "2px" }}></hr>
              </div>
              <div
                className="pr-4 py-2 bg-white rounded-r-lg relative"
                style={{ minWidth: "96px" }}
              >
                <label className="block pl-2 text-black">Profit(USD)</label>
                <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                  ${formatNumber(user.profit, 2)}
                </label>
              </div>
            </div>
          </div>
          <div className="w-full pr-9 flex mt-8 mb-6">
            <div className="relative w-3/4 pr-2">
              <input
                type="input"
                className="w-full h-12 py-1 pl-10 rounded-md shadow-sm"
                placeholder="Search"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="absolute top-3 left-2 mr-3 flex-none"
              >
                <path
                  d="m19 19-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></circle>
              </svg>
            </div>
            <div className="w-1/4 pl-2">
              <select
                className="w-full bg-white h-12 px-3 rounded-md shadow-sm focus:outline-none"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="-purchased_count">Sort by Popular</option>
                <option value="-buy_price">Sort by Price</option>
                <option value="-total_period">Sort by Period</option>
                <option value="-stock">Sort by Stock</option>
              </select>
            </div>
          </div>
          <Scrollbars
            className=""
            style={{ width: "100%", height: "calc(100vh - 269px)" }}
          >
            <div className="pr-9 " ref={myCloneContainerRef}>
              {loadingCloneItem ? (
                <ul
                  className={`grid ${
                    column ? "grid-cols-1" : "grid-cols-2"
                  }grid-cols-2 gap-5 mb-6 list-none `}
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <li
                      className="relative w-full clone-item bg-white rounded-5 border-none"
                      key={index}
                    >
                      <section>
                        <div className="pt-6 pl-8 pr-10 flex w-full items-center">
                          <div className="w-3/5 text-left">
                            <Skeleton
                              animation="wave"
                              variant="rounded"
                              width={80}
                              height={28}
                              className=""
                            />
                            <Skeleton
                              animation="wave"
                              variant="rounded"
                              width={120}
                              height={20}
                              className="mt-1"
                            />
                          </div>
                          <div className="w-2/5 flex justify-end">
                            <div>
                              <div className="flex justify-end">
                                <Skeleton
                                  animation="wave"
                                  variant="rounded"
                                  width={70}
                                  height={28}
                                  className=""
                                />
                              </div>
                              <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={100}
                                height={20}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-5 w-full items-end">
                          <div
                            className="w-2/3 bottom-0 relative"
                            style={{ paddingTop: "36%" }}
                          ></div>
                          <div className="w-1/3 text-right pr-10 mb-8 flex justify-end">
                            <Skeleton
                              animation="wave"
                              variant="rounded"
                              width={100}
                              height={44}
                            />
                          </div>
                        </div>
                      </section>
                    </li>
                  ))}
                </ul>
              ) : items.length === 0 ? (
                <div className="mb-6 py-2 bg-green/10 text-center rounded">
                  <label>no item</label>
                </div>
              ) : (
                <CloneItem
                  cards={items}
                  cartItems={cartItems}
                  onSelect={handleSelectItem}
                  column={column}
                />
              )}
            </div>
          </Scrollbars>
        </div>
        {loadingCloneCart ? (
          <div className="relative w-96 pt-12 pl-10 pr-8 bg-white">
            <h3 className="mb-9 text-xl font-bold">My Cart</h3>
            <div className="mt-6 mb-24">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="relative cart-item rounded bg-black/5 mb-6 pt-4 p-3"
                  key={index}
                >
                  <div className="pb-3">
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      height={32}
                      width={32}
                    />
                  </div>
                  <div className="flex w-full">
                    <div className="w-2/3 text-left">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={140}
                        className="mb-2"
                      />
                      <Skeleton animation="wave" variant="rounded" width={60} />
                    </div>
                    <div className="w-1/3 text-right">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={50}
                        className="float-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <MyCart
            cartItemList={cartItems}
            onCheckout={onCheckout}
            onDelCart={onDelCart}
          />
        )}
      </div>
      {selectedCartItem && (
        <>
          <ModalBuyPlant
            isOpen={showBuyModal}
            onClose={onCloseBuyModal}
            onSpeedUp={onSpeedUp}
            onPriceSum={onPriceSum}
            onBuy={onBuyItem}
            cartItem={selectedCartItem}
            stockInCart={stockInCart}
            isLoading={loadingAddCart}
          />
          <ModalSpeedUp
            isOpen={showSpeedUpModal}
            onClose={onCloseSpeedUpModal}
            onBack={onBack}
            onBuy={onSpeedUpItem}
            cartItem={selectedCartItem}
            priceSum={priceSum}
            isLoading={loadingAddCart}
          />
        </>
      )}
      <ModalPurchase
        isOpen={showPurchaseModal}
        onClose={onClosePurchase}
        onPurchase={onPurchase}
        cartList={cartItems}
        isLoading={loadingConfirm}
      />
      <ModalSuccessPurchase
        isOpen={showSuccessPurchaseModal}
        onClose={onCloseSuccessPurchase}
      />
    </>
  );
};

export default CloneShop;
