import React, { useState, useContext, ChangeEvent, useEffect } from "react";
import { MyAuthContext } from "context/AuthContext";
import { useTabletContext } from "context/TabletContext";
import { NavLink } from "react-router-dom";
// import Slider from '@mui/material/Slider';
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { Item } from "pages/Dashboard/CloneShop";
import { MdClose } from "react-icons/md";
import { Scrollbars } from "rc-scrollbars";
import botanicare from "assets/cloneshop/botanicare.png";
import rhizo from "assets/cloneshop/rhizo.png";
import silica from "assets/cloneshop/silica.png";
import { MdAdd } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { bonusRate, calcEstimationIncome, formatPrice } from "utils/common";
import { useMobileContext } from "../../context/MobileContext";
import arrowUp from "../../assets/icons/Arrow - Up 2.svg";
import arrowDown from "../../assets/icons/Arrow - Down 2.svg";
import panda from "../../assets/icons/pandami.svg";
import wallet_line from "../../assets/icons/Wallet_line.svg";
import api from "../../utils/api";
import { BiWallet } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface ModalBuyPlantProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeedUp: (quantity: number) => void;
  onBuy: (quantity: number, selectedMethod: number, number: number) => void;
  onPriceSum: (price: number) => void;
  cartItem: Item;
  stockInCart: number;
  isLoading: boolean;
}

interface ButtonWithSpinnerProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isLoading,
  onClick,
  children,
}) => {
  return (
    <button
      disabled={isLoading}
      className={`purchase absolute w-full bottom-0 right-0 left-0 text-center bg-green !bg-green py-5 cursor-pointer hover:bg-green/80 text-white align-center`}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <FaSpinner className="spinner m-auto text-2xl" />
        </>
      ) : (
        children
      )}
    </button>
  );
};

// function ModalBuyPlant({ isOpen, onClose, cartList }: ModalProps) {
const ModalBuyPlant: React.FC<ModalBuyPlantProps> = (props) => {
  const {
    isOpen,
    onClose,
    onBuy,
    onSpeedUp,
    onPriceSum,
    cartItem,
    stockInCart,
    isLoading,
  } = props;
  if (!isOpen) return null;
  const isTablet = useTabletContext();
  const isMobile = useMobileContext();
  const { user, setUser } = useContext(MyAuthContext);
  var totalPrice =
    0 +
    (user.methodBotani ? user.botaniPrice : 0) +
    (user.methodRhizo ? user.rhizoPrice : 0) +
    (user.methodSilica ? user.silicaPrice : 0);

  const defaultQuantity =
    user && user.quantity !== undefined ? user.quantity : "";
  const [buyQuantity, setBuyQuantity] = useState(defaultQuantity);
  const [isNoQuantity, setIsNoQuantity] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  var initialPaymentMethod = 0;
  if (user.payment_method) {
    initialPaymentMethod = user.payment_method;
  }
  const [selectedMethod, setSelectedMethod] = useState(initialPaymentMethod);

  const [pgaPrice, setPgaPrice] = useState(0);
  const [isLoadingPga, setIsLoadingPga] = useState(false);
  const calculateHarvestWeight = (
    seed_weight: number,
    harvest_rate: number
  ) => {
    const estimateProfit = seed_weight + (seed_weight * harvest_rate) / 100;
    return formatPrice(estimateProfit, 2);
  };

  const calculatePrice = (item: Item): string => {
    const price = item.buy_price * parseFloat(buyQuantity);
    return formatPrice(price, 1);
  };
  if (selectedMethod === 0) {
    if (!isLoadingPga) {
      totalPrice +=
        Math.round(
          (parseFloat(calculatePrice(cartItem)) / pgaPrice) * 0.9 * 100
        ) / 100;
      onPriceSum(totalPrice);
    }
  } else {
    onPriceSum(Math.round(parseFloat(calculatePrice(cartItem)) * 100) / 100);
  }
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const sliderValue = newValue as number;
    // if(sliderValue > 0) {
    // setIsNoQuantity(false);
    // }
    setBuyQuantity(formatPrice(sliderValue, 1));
  };

  const handleAddCart = () => {
    if (isLoadingPga) return;
    if (buyQuantity == 0 || buyQuantity == "") {
      setIsNoQuantity(true);
      return;
    }
    const priceSum = isLoadingPga
      ? 0
      : selectedMethod === 0
      ? Math.round(totalPrice * 100) / 100
      : Math.round(parseFloat(calculatePrice(cartItem)) * 100) / 100;

    onBuy(parseFloat(buyQuantity), selectedMethod, priceSum);
    setBuyQuantity("");
    setIsNoQuantity(false);
  };
  const handleSpeedUp = () => {
    if (buyQuantity == 0 || buyQuantity == "") {
      setIsNoQuantity(true);
      return;
    }
    onSpeedUp(parseFloat(buyQuantity));
    setIsNoQuantity(false);
    setBuyQuantity("");
  };

  const handleClose = () => {
    onClose();
    setBuyQuantity("");
    setIsNoQuantity(false);
  };

  const getMaxQuantity = (org_amount: number, use_amount: number) => {
    const remain_amount = org_amount - use_amount;
    return remain_amount < 0 ? 0 : remain_amount;
  };

  const trimValue = (value: number) => {
    const roundedNum = value.toFixed(1);
    return parseFloat(roundedNum);
  };

  const calculateBonusProfit = (bonusRate: number, selected_method: number) => {
    const totalProfit =
      (bonusRate + user.rhizoProfit / 100 + 1) *
      ((cartItem.buy_price * parseFloat(buyQuantity)) /
        (selected_method === 0 ? pgaPrice : 1));
    return formatPrice(totalProfit, 3);
  };
  const getPGAPrice = () => {
    setIsLoadingPga(true);
    api
      .get(`https://v1.pandagrownswap.io/pga_price`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res: any) => {
        console.log(res);
        const prices = res.data;
        // notice
        const price =
          parseFloat(prices.BNB) > parseFloat(prices.ETH)
            ? parseFloat(prices.ETH)
            : parseFloat(prices.BNB);
        setPgaPrice(price);
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoadingPga(false);
      });
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the input value from the event
    const inputValue = event.target.value;
    if (cartItem.stock == 0) {
      toast.error("Stock is empty.");
      return;
    }

    // Convert the input value to a number
    const parsedValue = parseFloat(inputValue);

    // Get the maximum allowed value (replace 1000 with your desired maximum value)
    const minValue = 0;
    const maxValue = getMaxQuantity(cartItem.stock, stockInCart);

    // Check if the parsedValue is a valid number
    if (!isNaN(parsedValue)) {
      // If the parsedValue exceeds the maximum value, set it to the maximum value
      const valueToSet =
        parsedValue > maxValue
          ? maxValue
          : parsedValue < minValue
          ? minValue
          : parsedValue;

      const trimedValue = trimValue(valueToSet);

      // Update the state with the value
      setBuyQuantity(trimedValue.toString());

      if (parsedValue > 0) {
        // setIsDisabled(false);
      }
    } else {
      // If the parsedValue is not a valid number (e.g., empty input or invalid characters), update the state with the original input value
      setBuyQuantity("");
      // setIsDisabled(true);
    }
  };
  // const handleSliderRelease = () => {
  //   // Handle the release event
  //   // alert('Slider released');
  // };
  useEffect(() => {
    if (isOpen) {
      getPGAPrice();
    }
  }, [isOpen]);
  useEffect(() => {
    if (selectedMethod === 0) {
      getPGAPrice();
    }
  }, [selectedMethod]);
  useEffect(() => {
    setUser((prevUser: typeof MyAuthContext) => ({
      ...prevUser,
      payment_method: selectedMethod,
    }));
  }, [selectedMethod]);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none">
        <Scrollbars className="" style={{ width: "100%", height: "100vh" }}>
          <div className="relative flex items-center h-fit min-h-screen w-auto py-6 mx-auto max-w-3x">
            <div
              className={`${
                isMobile ? "modal-buy" : "modal-buy-tablet"
              }  animation-fade-in mx-auto border-0 rounded-lg shadow-lg relative flex flex-col bg-[#041D04] text-white outline-none focus:outline-none px-8 py-7 z-40`}
            >
              <button
                className="bg-transparent border-0 text-white leading-none font-semibold outline-none focus:outline-none absolute top-7 right-7 z-50"
                onClick={handleClose}
              >
                <MdClose className="bg-transparent text-green h-6 w-6 text-2xl block outline-none focus:outline-none" />
              </button>
              {/*body*/}
              <div>
                <div className="flex items-center pt-10">
                  <div className="w-14">
                    <img
                      className="h-14 w-14 rounded-full border border-black/10"
                      src={cartItem.image}
                    />
                  </div>
                  <div className="pl-3 " style={{ width: "calc(100% - 56px)" }}>
                    <div className="flex w-full">
                      <label className="block w-2/3 font-bold text-base truncate">
                        {cartItem.name}
                      </label>
                      <label className="block w-1/3 text-right text-base text-green font-bold">
                        USD&nbsp;{cartItem.buy_price}
                      </label>
                    </div>
                    <div className="flex w-full">
                      <label className="block w-2/3 text-base truncate">
                        Harvest Amount
                      </label>
                      <label className="block w-1/3 text-right text-sm">
                        {buyQuantity !== ""
                          ? calculateHarvestWeight(
                              parseFloat(buyQuantity),
                              cartItem.harvest_rate
                            )
                          : "--"}
                        &nbsp;grams
                      </label>
                    </div>
                  </div>
                </div>
                {/* <div className="pt-1 pb-3">
                <div className="relative text-center">
                  <hr className="absolute w-full top-1/2 text-black/25" />
                  <label className="relative bg-white px-2 text-black/50">Estimation</label>
                </div>
                <div className="flex w-full pt-5">
                  <div className="w-1/2">
                    <label className="block text-left font-bold">Harvest Period</label>
                    <label className="block text-left">{calculateHarvestPeriod(cartItem)} days</label>
                  </div>
                </div>
              </div> */}
                <div className="pt-5 pb-4">
                  <div className="relative text-center">
                    <hr className="absolute w-full top-1/2 text-black/25" />
                    <label className="relative px-2 text-white">
                      Buy Details
                    </label>
                  </div>
                  <div className="w-full pt-5 pb-4">
                    <div className="flex items-center">
                      <div className="text-left">
                        <label className="font-bold">Quantity (grams)</label>
                      </div>
                      {/* <div className="w-1/2 text-right">
                      <label className="bg-black/10 px-2 py-1 rounded">USD {calculatePrice(cartItem)}</label>
                    </div> */}
                    </div>
                    <div className="pt-3">
                      <p className="text-sm">
                        Select the amount quantity of the plant.
                      </p>
                    </div>
                    {isNoQuantity ? (
                      <div className="pt-3">
                        <p
                          className="font-bold text-sm"
                          style={{ color: "#f00" }}
                        >
                          You have to select the amount quantity of the plant.
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    {/*{
                    isLoadingPga ? (
                        <div className="pt-3" >
                          <p className="font-bold text-sm" style={{ color: "#f00" }}>Getting the PGA Token Price to calculate...</p>
                        </div>
                    ) : (
                        <></>
                    )
                  }*/}
                  </div>
                  <div className="relative">
                    <span
                      className="absolute right-1 top-1 pt-2 pr-2 block z-10"
                      style={{ height: "44px" }}
                    >
                      grams
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={buyQuantity}
                      // defaultValue={defaultQuantity}
                      className="text-left pl-5 z-0 bg-transparent"
                      style={{ height: "52px" }}
                      onChange={handleInputChange}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="p-3 bg-black/10 rounded">
                  <label className="">
                    You will get{" "}
                    <strong>
                      {selectedMethod === 0 ? "PGA" : "USD"}&nbsp;
                      {buyQuantity == "" || isLoadingPga
                        ? "--"
                        : user.methodRhizo
                        ? Math.round(
                            parseFloat(
                              calculateBonusProfit(
                                bonusRate(
                                  (cartItem.buy_price *
                                    parseFloat(buyQuantity)) /
                                    (selectedMethod === 0 ? pgaPrice : 1),
                                  selectedMethod
                                ),
                                selectedMethod
                              )
                            ) * 100
                          ) / 100
                        : Math.round(
                            parseFloat(
                              calcEstimationIncome(
                                (cartItem.buy_price * parseFloat(buyQuantity)) /
                                  (selectedMethod === 0 ? pgaPrice : 1),
                                selectedMethod
                              )
                            ) * 100
                          ) / 100}
                    </strong>
                    &nbsp;from your&nbsp;
                    <strong>
                      {selectedMethod === 0 ? "PGA" : "USD"}&nbsp;
                      {buyQuantity !== "" && !isLoadingPga
                        ? Math.round(
                            (parseFloat(calculatePrice(cartItem)) /
                              (selectedMethod === 0 ? pgaPrice : 1)) *
                              100
                          ) / 100
                        : "--"}
                    </strong>{" "}
                    investment.
                  </label>
                </div>
                <div className="items-center mt-5 relative">
                  <div className="text-left">
                    <label className="font-bold">Payment method</label>
                  </div>
                  {selectedMethod === 0 ? (
                    <button
                      style={{
                        border: "1px solid #f6f6f6",
                        backgroundColor: "#041D04",
                      }}
                      className="w-full flex py-3 mt-3 px-5 text-base items-center rounded text-left"
                      onClick={() => setIsMethodOpen(!isMethodOpen)}
                    >
                      <img src={panda} className="h-8 pr-3" alt="PGA" />
                      <span className="font-bold text-md">
                        PGA
                        <div className="text-xs rounded-5 py-0">10% off</div>
                      </span>
                      <span
                        className="font-bold text-xs text-white ml-3 rounded-5 px-2 py-0"
                        style={{ backgroundColor: "#059033" }}
                      >
                        recommended
                      </span>

                      {isMethodOpen ? (
                        <IoIosArrowUp className="text-white w-6 h-6 ml-auto" />
                      ) : (
                        <IoIosArrowDown className="text-white w-6 h-6 ml-auto" />
                      )}
                    </button>
                  ) : (
                    <button
                      style={{
                        border: "1px solid #f6f6f6",
                        backgroundColor: "#041D04",
                      }}
                      className="w-full flex py-3 mt-3 px-5 text-base items-center rounded"
                      onClick={() => setIsMethodOpen(!isMethodOpen)}
                    >
                      <BiWallet className="text-white w-6 h-6 mr-3" />

                      <span className="font-bold text-md">US Dollar</span>
                      {isMethodOpen ? (
                        <IoIosArrowUp className="text-white w-6 h-6 ml-auto" />
                      ) : (
                        <IoIosArrowDown className="text-white w-6 h-6 ml-auto" />
                      )}
                    </button>
                  )}

                  {isMethodOpen ? (
                    <>
                      <div className="w-full flex flex-col absolute z-50">
                        <div
                          className="w-full rounded-b border-stone-400"
                          style={{ backgroundColor: "#041D04" }}
                        >
                          {/*<label className="text-sm font-bold">Cryptocurrency</label>*/}
                          <label className="text-sm px-5">
                            Other payment method
                          </label>
                          {selectedMethod === 0 ? (
                            <button
                              className="w-full flex py-3 px-5 text-base items-center rounded"
                              onClick={() => {
                                setSelectedMethod(1);
                                setIsMethodOpen(false);
                              }}
                            >
                              <BiWallet className="text-white w-6 h-6 mr-3" />
                              <span className="w-1/3 font-bold text-left">
                                US Dollar
                              </span>
                              <span className="w-2/3 text-right"></span>
                            </button>
                          ) : (
                            <button
                              className="w-full flex py-3 px-5 text-base items-center rounded"
                              onClick={() => {
                                setSelectedMethod(0);
                                setIsMethodOpen(false);
                              }}
                            >
                              <img src={panda} className="h-8 pr-3" alt="PGA" />
                              <span className="w-1/3 font-bold text-left">
                                PGA
                                <span
                                  className="font-bold text-xs text-white ml-3 rounded-5 px-2 py-0"
                                  style={{ backgroundColor: "#059033" }}
                                >
                                  recommended
                                </span>
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMethodOpen(!isOpen)}
                      ></div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {user.methodSilica ||
                user.methodBotani ||
                user.methodRhizo ||
                selectedMethod == 0 ||
                selectedMethod == 1 ? (
                  <>
                    <div className="mt-4 mb-14 ">
                      <label className="font-bold">Quick Harvester</label>
                      <div>
                        <ul
                          className="grid grid-cols-3 gap-4 my-1 list-none "
                          style={{ height: isMobile ? "92px" : "" }}
                        >
                          {user.methodSilica ? (
                            <li
                              className="relative"
                              style={{
                                paddingTop:
                                  isTablet || !isMobile ? "50%" : "100%",
                              }}
                              onClick={handleSpeedUp}
                            >
                              <label className="bg-green/10 border border-green absolute cursor-pointer top-0 h-full w-full justify-center items-center flex overflow-hidden text-center">
                                <img
                                  src={silica}
                                  className=""
                                  width={isMobile ? "68px" : "40px"}
                                />
                                {!isMobile ? (
                                  <span
                                    className={"font-bold ml-2"}
                                    style={{ width: "100px" }}
                                  >
                                    Silica Blast
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </label>
                            </li>
                          ) : (
                            <li
                              className="relative"
                              onClick={handleSpeedUp}
                              style={{
                                paddingTop:
                                  isTablet || !isMobile ? "50%" : "100%",
                              }}
                            >
                              <label className="bg-transparent cursor-pointer border  border-dashed absolute top-0 h-full w-full justify-center items-center flex overflow-hidden">
                                <MdAdd className="text-green w-5 h-5" />
                              </label>
                            </li>
                          )}
                          {user.methodBotani ? (
                            <li
                              className="relative"
                              style={{
                                paddingTop:
                                  isTablet || !isMobile ? "50%" : "100%",
                              }}
                              onClick={handleSpeedUp}
                            >
                              <label className="bg-green/10 border border-green absolute cursor-pointer top-0 h-full w-full justify-center items-center flex overflow-hidden text-center">
                                <img
                                  src={botanicare}
                                  className=""
                                  width={isMobile ? "68px" : "40px"}
                                />
                                {!isMobile ? (
                                  <span
                                    className={"font-bold ml-2"}
                                    style={{ width: "100px" }}
                                  >
                                    Botanicare Hydroguard
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </label>
                            </li>
                          ) : (
                            <li
                              className="relative"
                              onClick={handleSpeedUp}
                              style={{
                                paddingTop:
                                  isTablet || !isMobile ? "50%" : "100%",
                              }}
                            >
                              <label className="bg-transparent cursor-pointer border border-dashed absolute top-0 h-full w-full justify-center items-center flex overflow-hidden">
                                <MdAdd className="text-green w-5 h-5" />
                              </label>
                            </li>
                          )}
                          {user.methodRhizo ? (
                            <li
                              className="relative"
                              style={{
                                paddingTop:
                                  isTablet || !isMobile ? "50%" : "100%",
                              }}
                              onClick={handleSpeedUp}
                            >
                              <label className="bg-green/10 border border-green absolute cursor-pointer top-0 h-full w-full justify-center items-center flex overflow-hidden text-center">
                                <img
                                  src={rhizo}
                                  className=""
                                  width={isMobile ? "68px" : "40px"}
                                />
                                {!isMobile ? (
                                  <span
                                    className={"font-bold ml-2"}
                                    style={{ width: "100px" }}
                                  >
                                    Rhizo Blast
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </label>
                            </li>
                          ) : (
                            <li
                              className="relative"
                              onClick={handleSpeedUp}
                              style={{
                                paddingTop:
                                  isTablet || !isMobile ? "50%" : "100%",
                              }}
                            >
                              <label className="bg-transparent cursor-pointer border border-dashed absolute top-0 h-full w-full justify-center items-center flex overflow-hidden">
                                <MdAdd className="text-green w-5 h-5" />
                              </label>
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="mt-4 py-3 px-5 bg-black/10">
                        <label className="block font-bold pb-1">
                          Payment Summary
                        </label>
                        <div className="flex">
                          <div className="w-1/2">Seed Investment</div>
                          <div className="w-1/2 text-right">
                            {isLoadingPga
                              ? "--"
                              : selectedMethod === 0
                              ? Math.round(
                                  (parseFloat(calculatePrice(cartItem)) /
                                    pgaPrice) *
                                    100 *
                                    0.9
                                ) / 100
                              : Math.round(
                                  parseFloat(calculatePrice(cartItem)) * 100
                                ) / 100}{" "}
                            {selectedMethod === 0 ? "PGA" : "USD"}&nbsp;
                            {isLoadingPga ? (
                              "--"
                            ) : selectedMethod === 0 ? (
                              <span
                                style={{
                                  textDecoration:
                                    selectedMethod === 0 ? "line-through" : "",
                                }}
                              >
                                {Math.round(
                                  (parseFloat(calculatePrice(cartItem)) /
                                    pgaPrice) *
                                    100
                                ) / 100}{" "}
                                PGA
                              </span>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        {user.methodBotani ? (
                          <div className="flex">
                            <div className="w-5/6">Botanicare Hydroguard</div>
                            <div className="w-1/6 text-right">
                              {user.botaniPrice} PGA
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {user.methodRhizo ? (
                          <div className="flex">
                            <div className="w-5/6">Rhizo Blast</div>
                            <div className="w-1/6 text-right">
                              {user.rhizoPrice} PGA
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {user.methodSilica ? (
                          <div className="flex">
                            <div className="w-5/6">Silica Blast</div>
                            <div className="w-1/6 text-right">
                              {user.silicaPrice} PGA
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="flex pt-1 font-bold">
                          <div className="w-1/2">Total payment</div>
                          <div className="w-1/2 text-right">
                            {selectedMethod === 1 ? (
                              Math.round(
                                parseFloat(calculatePrice(cartItem)) * 100
                              ) /
                                100 +
                              " USD "
                            ) : (
                              <span className="text-lg font-bold text-green">
                                {
                                  Math.round(totalPrice * 100) / 100 + " PGA " // display with discount
                                }
                              </span>
                            )}
                            {selectedMethod === 1 ? (
                              <span>{totalPrice} PGA</span>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/*<div className="absolute bottom-0 left-0 w-full px-8 py-4 mb-14" style={{ boxShadow: "0px -2px 6px 0px rgba(0, 0, 0, 0.3)" }}>*/}
                    {/*  <div className="flex font-bold">*/}
                    {/*    <div className="w-2/3">PGA Token</div>*/}
                    {/*    <div className="w-1/3 text-right pr-4">{totalPrice}</div>*/}
                    {/*  </div>*/}
                    {/*  <label>Balance: PGA {Math.round(user.pga_balance * 100 ) / 100}</label>*/}
                    {/*</div>*/}
                    <ButtonWithSpinner
                      isLoading={isLoading}
                      onClick={handleAddCart}
                    >
                      Add to cart
                    </ButtonWithSpinner>
                  </>
                ) : (
                  <>
                    <div className="mt-4 mb-20 bg-green text-white rounded-lg">
                      <div
                        className="h-2 rounded-t-lg"
                        style={{ background: "#F7931A" }}
                      ></div>
                      <div className="p-3">
                        <p className="pb-2">
                          Speed up harvest time and get more profit.
                        </p>
                        <button
                          className="rounded-full px-2 py-2 text-green font-bold"
                          onClick={handleSpeedUp}
                          style={{ background: "#eee" }}
                        >
                          Yes. I want
                        </button>
                      </div>
                    </div>
                    <ButtonWithSpinner
                      isLoading={isLoading}
                      onClick={handleAddCart}
                    >
                      Add to cart
                    </ButtonWithSpinner>
                  </>
                )}
                {/* <div className="purchase absolute bottom-0 right-0 left-0 text-center flex bg-green px-8 py-6 cursor-pointer hover:bg-green/80" onClick={handleAddCart} >
                    <label className="mx-auto text-white cursor-pointer align-center">
                    Add to cart
                    </label>
                </div>  */}
              </div>
            </div>
            <div
              className="opacity-50 fixed inset-0 z-30 bg-black"
              onClick={handleClose}
            ></div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default ModalBuyPlant;
