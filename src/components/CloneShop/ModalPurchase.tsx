import React, { useContext, useState } from "react";
// import Select from 'react-select';
import { NavLink } from "react-router-dom";
import { CartItemInfo } from "pages/Dashboard/manage/CloneShop";
import { MyAuthContext } from "context/AuthContext";
// import { FaBitcoin } from "react-icons/fa";
// import { FaDollarSign } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { Scrollbars } from "rc-scrollbars";
import { toast } from "react-toastify";
import CartItem from "./CartItem";

interface ModalPurchaseProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  cartList: CartItemInfo[];
  isLoading: boolean;
}

interface ButtonWithSpinnerProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isBalanceWarning: boolean;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isLoading,
  onClick,
  children,
  isBalanceWarning,
}) => {
  return (
    <button
      disabled={isLoading}
      className={`purchase absolute w-full bottom-0 right-0 left-0 text-center bg-green !bg-green py-6 cursor-pointer hover:bg-green/80 text-white align-center ${
        !isBalanceWarning ? "disabled" : ""
      }`}
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

// function ModalPurchase({ isOpen, onClose, cartList }: ModalProps) {
const ModalPurchase: React.FC<ModalPurchaseProps> = (props) => {
  const { isOpen, onClose, onPurchase, cartList, isLoading } = props;
  const { user } = useContext(MyAuthContext);
  const [isBalanceWarning, setIsBalanceWarning] = useState(true);

  if (!isOpen) return null;

  // const options = [
  //   { value: 'bitcoin', label: <div className="flex w-full items-center"><div><FaBitcoin style={{color: "#f7931a", height:30, width:30}} /></div><div className="pl-3"><label className="block font-bold">Bitcoin</label><label className="block text-sm">0.574</label></div></div> },
  //   { value: 'usd', label: <div className="flex w-full items-center"><div><FaDollarSign style={{color: "#f7931a", height:30, width:30}} /></div><div className="pl-3"><label className="block font-bold">USD</label><label className="block text-sm">0.819</label></div></div> }
  // ];

  const calculateTotalPrice = (price: number, weight: number): string => {
    const totalPrice = Number(price) * Number(weight);
    return formatPrice(totalPrice, 2);
  };

  const formatPrice = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  const handleOnPurchase = () => {
    if (user.balance < total_usd) {
      setIsBalanceWarning(false);
      return;
    }
    if (user.pga_balance < total_pga) {
      setIsBalanceWarning(false);
      return;
    }

    onPurchase();
  };

  const handleClose = () => {
    setIsBalanceWarning(true);
    onClose();
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
  var total_pga = 0;
  var total_usd = 0;
  cartList.map((cartItem) => {
    if (cartItem.payment_method === 0) {
      total_pga += cartItem.price_sum;
    } else {
      total_usd +=
        Number(cartItem.buy_price) * Number(cartItem.purchase_amount);
      total_pga += getPGABalance(
        Number(cartItem.method_botanicare),
        Number(cartItem.method_rhizo),
        Number(cartItem.method_silica)
      );
    }
  });

  total_pga = Math.round(total_pga * 100) / 100;
  total_usd = Math.round(total_usd * 100) / 100;
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <Scrollbars className="" style={{ width: "100%", height: "100vh" }}>
          <div className="relative flex items-center h-fit min-h-screen w-auto py-6 mx-auto max-w-3xl">
            <div className="animation-fade-in-top modal-checkout mx-auto border-0 rounded-lg shadow-lg relative flex flex-col bg-[#041D04] text-white outline-none focus:outline-none px-10 py-7 z-50">
              <button
                className="bg-transparent border-0 text-black leading-none font-semibold outline-none focus:outline-none absolute top-7 right-7"
                onClick={handleClose}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
              {/*body*/}
              <div>
                <h3 className="pt-2 pb-7 font-bold text-xl">Confirmation</h3>
                <div className="rounded py-4 px-5 shadow mb-20">
                  <div className="pt-2">
                    {cartList.map((cartItem, index) => (
                      <div className="checkout-item pb-6" key={index}>
                        <div className="flex w-full">
                          <div className="w-1/6">
                            <img
                              className="img-plant-logo rounded-full"
                              src={cartItem.image}
                            />
                          </div>
                          <div className="text-left w-4/6 pt-2">
                            <label className="block font-bold">
                              {cartItem.name}
                            </label>
                            <label className="block mt-2 text-sm">
                              {cartItem.purchase_amount}&nbsp;gram
                            </label>
                          </div>
                          <div className="w-1/6 text-right font-bold text-green pt-2">
                            {cartItem.payment_method === 1 ? (
                              <label className="block">
                                USD&nbsp;
                                {calculateTotalPrice(
                                  cartItem.buy_price,
                                  cartItem.purchase_amount
                                )}
                              </label>
                            ) : (
                              <></>
                            )}

                            {cartItem.pga_amount > 0 ||
                            cartItem.price_sum > 0 ? (
                              <label>
                                PGA&nbsp;
                                {cartItem.payment_method === 0
                                  ? Math.round(cartItem.price_sum * 100) / 100
                                  : cartItem.pga_amount}
                              </label>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {cartList.length > 1 ? (
                    <div className="flex pt-5 pb-3 w-full border-t border-black/10">
                      <div className="w-1/2 text-left">
                        <label className="block font-bold text-sm">
                          Total Price
                        </label>
                        <label className="block text-sm text-black/50">
                          {cartList.length}&nbsp;item selected
                        </label>
                      </div>
                      <div className="w-1/2 text-right">
                        {total_usd > 0 ? (
                          <>
                            <label className="block font-bold text-green">
                              USD&nbsp;
                              {/* Calculate the total price */}
                              {formatPrice(total_usd, 2)}
                            </label>
                          </>
                        ) : (
                          <></>
                        )}
                        {total_pga > 0 ? (
                          <>
                            <label className="font-bold text-green">
                              PGA&nbsp;
                              {/* Calculate the total price */}
                              {formatPrice(total_pga, 2)}
                            </label>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {/* <div className="pt-3">
                  <label className="text-xs font-bold text-black/60">Pay with</label>
                  <Select
                    className="mt-1 bg-black rounded"
                    defaultValue={options[0]}
                    options={options}
                    isSearchable={false}
                  />
                </div> */}
                </div>
                {user.balance < total_usd ? (
                  <div
                    className={`${
                      isBalanceWarning ? "hidden" : ""
                    } w-full flex mt-5 mb-20 py-5 pl-7 pr-5 rounded`}
                    style={{
                      background:
                        "linear-gradient(to bottom, #ff000015, #c2000020)",
                      border: "solid 1px #f00",
                    }}
                  >
                    <div className="w-1/12">
                      <span
                        className="block cursor-pointer flex items-center justify-center h-5 w-5 mt-1 bg-black/90 text-white text-center rounded"
                        onClick={() => setIsBalanceWarning(true)}
                      >
                        x
                      </span>
                    </div>
                    <div className="w-11/12">
                      <label className="text-black text-xl font-bold">
                        Insuficient Balance
                      </label>
                      <p className="text-black pt-2 text-sm">
                        Oops, sorry that you don't have enough balance. You can
                        top-up your balance and continue purchasing the plant.
                      </p>
                      <div className="w-full flex pt-5 text-black items-center">
                        <div className="w-4/6 text-left">
                          <label className="text-base font-bold">
                            Current Balance: ${" "}
                            {formatPrice(parseFloat(user.balance), 4)}
                          </label>
                        </div>
                        <div className="w-1/6 text-left">
                          <label
                            className="text-sm font-thin underline cursor-pointer"
                            onClick={() => setIsBalanceWarning(true)}
                          >
                            Dismiss
                          </label>
                        </div>
                        <div className="w-1/6 text-right">
                          <NavLink
                            to="/deposit"
                            className="block text-center rounded w-full py-1 text-white text-sm"
                            style={{ background: "#FF0000" }}
                          >
                            Top up
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {user.pga_balance < total_pga ? (
                  <div
                    className={`${
                      isBalanceWarning ? "hidden" : ""
                    } w-full flex mt-5 mb-20 py-5 pl-7 pr-5 rounded`}
                    style={{
                      background:
                        "linear-gradient(to bottom, #ff000015, #c2000020)",
                      border: "solid 1px #f00",
                    }}
                  >
                    <div className="w-1/12">
                      <span
                        className="block cursor-pointer flex items-center justify-center h-5 w-5 mt-1 bg-black/90 text-white text-center rounded"
                        onClick={() => setIsBalanceWarning(true)}
                      >
                        x
                      </span>
                    </div>
                    <div className="w-11/12">
                      <label className="text-black text-xl font-bold">
                        Insuficient PGA Balance
                      </label>
                      <p className="text-black pt-2 text-sm">
                        Oops, sorry that you don't have enough PGA balance. You
                        can top-up your PGA balance and continue purchasing the
                        plant.
                      </p>
                      <div className="w-full flex pt-5 text-black items-center">
                        <div className="w-5/6 text-left">
                          <label className="text-base font-bold">
                            Current PGA Balance: PGA{" "}
                            {formatPrice(parseFloat(user.pga_balance), 4)}
                          </label>
                        </div>
                        <div className="w-1/6 text-right">
                          <NavLink
                            to="/deposit"
                            className="block text-center rounded w-full py-1 text-white text-sm"
                            style={{ background: "#FF0000" }}
                          >
                            Top up
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <ButtonWithSpinner
                  isLoading={isLoading}
                  onClick={handleOnPurchase}
                  isBalanceWarning={isBalanceWarning}
                >
                  Buy
                </ButtonWithSpinner>
              </div>
            </div>
            <div
              className="opacity-50 fixed inset-0 z-40 bg-black"
              onClick={handleClose}
            ></div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default ModalPurchase;
