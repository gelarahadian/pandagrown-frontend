import React, { useContext, useState } from "react";
import { MyAuthContext } from "context/AuthContext";
import { NavLink } from "react-router-dom";
// import Select from 'react-select'
import { CartItemInfo } from "pages/Dashboard/CloneShop";
// import { FaBitcoin } from "react-icons/fa";
// import { FaDollarSign } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

interface ConfirmationMobileProps {
  cartList: CartItemInfo[];
  onSuccess: () => void;
  isLoading: boolean;
  onDelCart: (idx: number) => void;
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
      className={`!bg-green flex w-full text-white items-center justify-center hover:bg-green/80 px-6 py-4 rounded-md shadow-md cursor-pointer align-center ${
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

// function ConfirmationMobile({ isOpen, onClose, cartList }: ModalProps) {
const ConfirmationMobile: React.FC<ConfirmationMobileProps> = (props) => {
  const { cartList, onSuccess, isLoading, onDelCart } = props;
  const { user } = useContext(MyAuthContext);
  const [isBalanceWarning, setIsBalanceWarning] = useState(true);

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

  const handleDelCart = (idx: number) => {
    onDelCart(idx);
  };

  const handleSuccess = () => {
    if (user.balance < total_usd) {
      setIsBalanceWarning(false);
      return;
    }
    if (user.pga_balance < total_pga) {
      setIsBalanceWarning(false);
      return;
    }
    onSuccess();
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
      <div className="pt-2 pb-20">
        <div className="shadow py-4 px-5 rounded">
          <div className="">
            {cartList.map((cartItem, index) => (
              <div
                className="checkout-item rounded mb-6 py-4 relative"
                key={index}
              >
                <button
                  className="bg-transparent border-0 text-black leading-none font-semibold outline-none focus:outline-none absolute top-3 right-3"
                  onClick={() => handleDelCart(cartItem.id)}
                >
                  {/* <FaTrashAlt className="bg-transparent text-rose-400 hover:text-rose-500 text-sm block outline-none focus:outline-none"/>
                   */}
                  <div className="QpoLy">
                    <div className="mGATq XG5Jd BsnNQ AL3kQ YsOlD DUi8v Cr9Ge">
                      <svg className="KBPxt hn2lg" viewBox="0 0 40 40">
                        <g transform="matrix(.35 0 0 .35 3.2 3.2)">
                          <path
                            d="M7-6H2.5a2.5 2.5 0 1 0-5 0H-7c-.3 0-.5.2-.5.5s.3.5.5.5H7a.5.5 0 0 0 0-1zm-8.5 0a1.5 1.5 0 0 1 3 0h-3z"
                            transform="matrix(4 0 0 4 48 48)"
                          ></path>
                        </g>
                      </svg>
                      <svg className="Z0dEQ IKEiQ" viewBox="0 0 40 40">
                        <g transform="matrix(.35 0 0 .35 3.2 3.2)">
                          <path
                            d="M0 3.5c.3 0 .5-.2.5-.4v-6.2c0-.2-.3-.4-.5-.4-.3 0-.5.2-.5.4v6.2c0 .2.3.4.5.4z"
                            transform="matrix(4 0 0 4 54 52)"
                          ></path>
                          <path
                            d="M0 3.5c.3 0 .5-.2.5-.4v-6.2c0-.2-.3-.4-.5-.4-.3 0-.5.2-.5.4v6.2c0 .2.3.4.5.4z"
                            transform="matrix(4 0 0 4 42 52)"
                          ></path>
                          <path
                            d="M5.4-6.5 4.2 4.6c-.1.5-.5.9-1 .9h-6.4a1 1 0 0 1-1-.9L-5.4-6.5h-1l1.3 11.2a2 2 0 0 0 2 1.8h6.3a2 2 0 0 0 2-1.8L6.4-6.5h-1z"
                            transform="matrix(4 0 0 4 48 54)"
                          ></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </button>
                <div className="">
                  <img
                    className="img-plant-logo rounded-full"
                    src={cartItem.image}
                  />
                </div>
                <div className="flex w-full">
                  <div className="text-left w-1/2 pt-2">
                    <div className="flex items-center">
                      <label className="text-xs pr-2">
                        {cartItem.purchase_amount}x{" "}
                      </label>
                      <label className="text-base font-bold truncate">
                        {cartItem.name}
                      </label>
                    </div>
                    <label className="block mt-1 text-xs">
                      USD {cartItem.buy_price}/gr
                    </label>
                  </div>
                  <div className="w-1/2 text-right font-bold text-green pt-2">
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

                    {cartItem.pga_amount > 0 || cartItem.price_sum > 0 ? (
                      <label>
                        PGA&nbsp;
                        {cartItem.payment_method === 0
                          ? cartItem.price_sum
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
            <div className="flex pt-2 pb-4 w-full border-t border-black/10">
              <div className="w-1/2 text-left">
                <label className="block font-bold text-sm">Total Price</label>
                <label className="block text-sm text-black/50">
                  {cartList.length}&nbsp;item selected
                </label>
              </div>
              <div className="w-1/2 text-right">
                <label className="block font-bold text-green">
                  USD&nbsp;
                  {/* Calculate the total price */}
                  {formatPrice(total_usd, 2)}
                </label>
                {cartList.reduce(
                  (total, cartItem) => total + cartItem.pga_amount,
                  0
                ) > 0 ? (
                  <label className="font-bold text-green">
                    PGA&nbsp;
                    {/* Calculate the total price */}
                    {formatPrice(total_pga, 2)}
                  </label>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {user.balance < total_usd ? (
          <div
            className={`${
              isBalanceWarning ? "hidden" : ""
            } w-full mt-5 py-5 pl-7 pr-5 rounded`}
            style={{
              background: "linear-gradient(to bottom, #ff000015, #c2000020)",
              border: "solid 1px #f00",
            }}
          >
            <div className="w-full flex">
              <div className="w-2/12">
                <span
                  className="block cursor-pointer flex items-center justify-center h-5 w-5 mt-1 bg-black/90 text-white text-center rounded"
                  onClick={() => setIsBalanceWarning(true)}
                >
                  x
                </span>
              </div>
              <div className="w-10/12">
                <label className="text-black text-lg font-bold">
                  Insuficient Balance
                </label>
              </div>
            </div>
            <div className="w-full">
              <p className="text-black pt-2 text-sm">
                Oops, sorry that you don't have enough balance. You can top-up
                your balance and continue purchasing the plant.
              </p>
              <div className="w-full flex pt-5 text-black items-center">
                <div className="w-7/12 text-left">
                  <label className="text-sm font-bold">
                    Current Balance: ${formatPrice(parseFloat(user.balance), 4)}
                  </label>
                </div>
                <div className="w-3/12 text-left">
                  <label
                    className="text-sm font-thin underline cursor-pointer"
                    onClick={() => setIsBalanceWarning(true)}
                  >
                    Dismiss
                  </label>
                </div>
              </div>
              <div className="w-full mt-5">
                <div className="text-right">
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
              background: "linear-gradient(to bottom, #ff000015, #c2000020)",
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
                Oops, sorry that you don't have enough PGA balance. You can
                top-up your PGA balance and continue purchasing the plant.
              </p>
              <div className="w-full flex pt-5 text-black items-center">
                <div className="w-5/6 text-left">
                  <label className="text-base font-bold">
                    Current PGA Balance: PGA{" "}
                    {formatPrice(parseFloat(user.pga_balance), 4)}
                  </label>
                </div>
              </div>
              <div className="w-full mt-5">
                <div className="text-right">
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

        <div className="mycart-mobile fixed bottom-0 right-0 bg-white left-0 px-2 py-2">
          <ButtonWithSpinner
            isLoading={isLoading}
            onClick={handleSuccess}
            isBalanceWarning={isBalanceWarning}
          >
            Buy
          </ButtonWithSpinner>
        </div>
      </div>
    </>
  );
};

export default ConfirmationMobile;
