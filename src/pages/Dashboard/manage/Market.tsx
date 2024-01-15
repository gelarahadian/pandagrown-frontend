import React, { useContext, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import ModalPurchase from "components/CloneShop/ModalPurchase";
import ModalSuccessPurchase from "components/CloneShop/ModalSuccessPurchase";
import MyCart from "components/CloneShop/MyCart";
import Sidebar from "components/Layout/Sidebar";
import Dropdown from "components/common/Dropdown";
import { MyAuthContext } from "context/AuthContext";
import { useCart } from "context/CartContext";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import filter from "assets/images/Filter.png";

import { FaCheck } from "react-icons/fa";
import { useMarket } from "context/MarketContext";
import MarketContainer from "components/Market/MarketContainer";

const Market = () => {
  const isTablet = useTabletContext();
  const isMobile = useMobileContext();
  const { user, setUser } = useContext(MyAuthContext);

  const [sort, setSort] = useState<string>("");
  const [open, setOpen] = useState(false);

  const {
    loadingCloneCart,
    cartItems,
    showPurchaseModal,
    handleGetCartItems,
    onCheckout,
    onDelCart,
    onClosePurchase,
    onCloseSuccessPurchase,
    loadingConfirm,
    showSuccessPurchaseModal,
    onPurchase,
  } = useCart();

  const { handleGetMarket } = useMarket();

  useEffect(() => {
    if (user?.token) {
      handleGetCartItems();
      handleGetMarket();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // if (event.key === "Enter") {
    //   handleGetItem();
    // }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDropdownChange = (order: string) => {
    setSort(order);
    setOpen(false);
  };

  const formatNumber = (price: string, fixed_count: number): string => {
    let formattedPrice = Number(price).toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };
  return (
    <>
      {isTablet ? <></> : <Sidebar />}
      <div className={`${!isTablet && "pl-[392px] h-screen flex"}`}>
        <div className={`flex-1 ${!isMobile && "pt-24"} px-8`}>
          {!isMobile && (
            <div className="flex w-full">
              <div className="w-1/2 text-left">
                <label className="text-4xl font-bold mb-2">Market</label>
              </div>
              <div className="w-1/2 -mt-6 flex items-center justify-end">
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
          )}

          <div className="w-full flex mt-8 mb-6">
            <div className="relative flex-1">
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
            {isTablet ? (
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
            ) : (
              <div className=" pl-2">
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
            )}
          </div>

          <MarketContainer />
        </div>
        {!isTablet && (
          <>
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
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            width={60}
                          />
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
          </>
        )}
      </div>
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

export default Market;
