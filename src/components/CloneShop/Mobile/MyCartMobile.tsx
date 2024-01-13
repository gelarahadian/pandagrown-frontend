import React, { useState, useEffect, useContext } from "react";
import { CartItemInfo } from "pages/Dashboard/manage/CloneShop";
import { NavLink } from "react-router-dom";
import { MyAuthContext } from "../../../context/AuthContext";

interface CartInfo {
  name: string;
  harvest_days: string;
  weight_unit: string;
  weight: string;
  price_unit: string;
  price_per_unit: string;
}

interface MyCartMobileProps {
  cartItemList: CartItemInfo[];
}

const MyCartMobile: React.FC<MyCartMobileProps> = (props) => {
  const { cartItemList } = props;
  const { user, setUser } = useContext(MyAuthContext);
  // const [cartList, setCartList] = useState<CartInfo[]>([]);
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
  const handleDelCart = (index: number) => {
    alert(index);
  };

  useEffect(() => {
    // handleAddCart();
  }, []);

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
      <div className="relative bg-white">
        {cartItemList.length === 0 ? (
          <></>
        ) : (
          <NavLink to="/confirmation">
            <div className="mycart-mobile fixed bottom-0 right-0 bg-white left-0 px-3 py-3">
              <div className="bg-[#041D04] flex items-center hover:bg-green/80 px-6 py-3 rounded-md shadow-md cursor-pointer">
                <div className="text-white text-left w-1/2 ">
                  {total_usd > 0 ? (
                    <>
                      <label className="block cursor-pointer text-lg font-bold">
                        {formatPrice(total_usd, 2)}
                        &nbsp;USD
                      </label>
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
                  <label className="block -mt-1 cursor-pointer text-sm">
                    {/* Calculate the total price */}
                    {cartItemList.length} item selected
                  </label>
                </div>
                <label className="text-white text-right w-1/2 cursor-pointer">
                  Checkout&nbsp;&nbsp;&gt;
                </label>
              </div>
            </div>
          </NavLink>
        )}
      </div>
    </>
  );
};

export default MyCartMobile;
