import React, { useState } from "react";
import { CartItemInfo } from "pages/Dashboard/CloneShop";
import { FaTrashAlt } from "react-icons/fa";

interface CartItemProps {
  cartList: CartItemInfo[];
  deleteCart: (index: number) => void;
}

const CartItem: React.FC<CartItemProps> = (props) => {
  const { cartList, deleteCart } = props;

  // const [updatedCartList, setUpdatedCartList] = useState<CartItemInfo[]>(cartList);

  const calculateTotalPrice = (price: number, weight: number): string => {
    const totalPrice = Number(price) * Number(weight);
    return formatPrice(totalPrice, 2);
  };

  const formatPrice = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  const handleDelCart = (index: number) => {
    deleteCart(index);
  };

  return (
    <div className="mt-6 mb-24">
      {cartList.map((cartItem, index) => (
        <div
          className="relative cart-item rounded bg-black/5 mb-6 pt-4 p-3"
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
          <div className="pb-3">
            <img className="rounded-full" src={cartItem.image} />
          </div>
          <div className="flex w-full">
            <div className="w-2/3 text-left">
              <div className="flex items-center">
                <label className="text-sm">{cartItem.purchase_amount}x </label>
                <label className="pl-1 text-base font-bold truncate">
                  {cartItem.name}
                </label>
              </div>
              <label className="text-sm text-black/50">
                USD&nbsp;{cartItem.buy_price}/gram
              </label>
            </div>
            <div className="w-1/3 text-right">
              {cartItem.payment_method === 1 ? (
                <label className="block text-green font-bold">
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
                <label className="text-green font-bold">
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
  );
};

export default CartItem;
