import React, { useState, useEffect, useContext } from "react";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import { CartItemInfo } from "pages/Dashboard/CloneShop";
import { MyAuthContext } from "../../context/AuthContext";

interface MyCartProps {
  cartItemList: CartItemInfo[];
  onCheckout: () => void;
  onDelCart: (id: number) => void;
}

const MyCart: React.FC<MyCartProps> = (props) => {
  const { cartItemList, onCheckout, onDelCart } = props;
  const { user, setUser } = useContext(MyAuthContext);

  const handleDelCart = (index: number) => {
    // alert(index);
    onDelCart(index);
  };

  useEffect(() => {}, []);
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
  const formatPrice = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };
  var total_pga = 0;
  var total_usd = 0;
  cartItemList.map((cartItem) => {
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
      <div className="relative w-96 pt-12 pl-10 pr-8 bg-white">
        <h3 className="mb-9 text-xl font-bold">My Cart</h3>
        {cartItemList && cartItemList.length === 0 ? (
          <EmptyCart />
        ) : (
          <CartItem cartList={cartItemList} deleteCart={handleDelCart} />
        )}

        {cartItemList.length === 0 ? (
          <></>
        ) : (
          <div
            className="absolute bottom-3 right-3 left-3 flex items-center bg-[#041D04] px-8 py-4 cursor-pointer hover:bg-green/80 shadow-lg rounded-md"
            onClick={onCheckout}
          >
            <div className="text-white text-left w-1/2 ">
              <div className="flex justify-center align-middle">
                {total_usd > 0 ? (
                  <>
                    <label className="block cursor-pointer text-lg font-bold">
                      {formatPrice(total_usd, 2)}
                      &nbsp;USD
                    </label>
                    &nbsp;&nbsp;
                  </>
                ) : (
                  <></>
                )}
                {total_pga > 0 ? (
                  <>
                    <label className="block cursor-pointer text-lg font-bold">
                      {formatPrice(total_pga, 2)}
                      &nbsp;PGA
                    </label>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <label className="block -mt-1 cursor-pointer text-sm">
                {/* Calculate the total price */}
                {cartItemList.length} item selected
              </label>
            </div>
            <label className="text-white text-right w-1/2 cursor-pointer">
              Checkout&nbsp;&nbsp;&gt;
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default MyCart;
