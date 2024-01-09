import { useState, useEffect, useContext } from "react";

import { useMobileContext } from "context/MobileContext";
import { MyAuthContext } from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "components/common/LoadingSpinner";
import ConfirmationMobile from "components/CloneShop/Mobile/ConfirmationMobile";
import BuySuccessMobiles from "components/CloneShop/Mobile/BuySuccessMobile";
import { CartItemInfo } from "./Dashboard/CloneShop";
import "react-toastify/dist/ReactToastify.css";
import api from "utils/api";
import "styles/cloneshop.scss";

function Confirmation() {
  const isMobile = useMobileContext();
  const [showSuccessPurchaseModal, setShowSuccessPurchaseModal] =
    useState(false);
  const [items, setItems] = useState<CartItemInfo[]>([]);
  const { user } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  const navigate = useNavigate();

  const handleGetCartItems = function () {
    // setCartItems(items);
    setIsLoading(true);
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
                user_id: item.user_id,
                seed_id: item.seed_id,
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
                image: item.cover_img,
                buy_price: item.seed_price,
                payment_method: item.payment_method,
                price_sum: item.price_sum,
              };
            });

            setItems(transformedData);
          }
          // notice
          console.log("get cart data", data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("get cart data error", err);
          setIsLoading(false);
        });
    });
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

  const onSuccess = () => {
    setIsConfirming(true);
    setTimeout(() => {
      api
        .post(`shop/${user.user_id}/purchase/`, {})
        .then((res: any) => {
          console.log("add success.");
          // toast.success("add success.");
          setShowSuccessPurchaseModal(true);
          setItems([]);
          setIsConfirming(false);
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
          // toast.error("Failed to add cart");
          setIsConfirming(false);
        });
    });
  };

  useEffect(() => {
    handleGetCartItems();
  }, []);

  useEffect(() => {
    if (
      ((items.length == 0 && !isLoading) || !isMobile) &&
      !showSuccessPurchaseModal
    ) {
      navigate("/cloneshop");
    }
  }, [items]);

  const onDelCart = (idx: number) => {
    // console.log(idx);
    // setLoadingCloneCart(true);
    api
      .delete(`shop/cart/${idx}/`, {})
      .then((res: any) => {
        toast.success("delete cart success.");
        setItems(items.filter((item) => item.id !== idx));
        // setLoadingCloneCart(false);
      })
      .catch((err) => {
        toast.error("delete failed.");
        console.log(err);
        // setLoadingCloneCart(false);
      });
  };

  if (isMobile) {
    return (
      <>
        <div className="confirmation px-8 relative">
          {isLoading ? (
            <LoadingSpinner />
          ) : !showSuccessPurchaseModal ? (
            <ConfirmationMobile
              onSuccess={() => onSuccess()}
              cartList={items}
              isLoading={isConfirming}
              onDelCart={onDelCart}
            />
          ) : (
            ""
          )}
          <BuySuccessMobiles isOpen={showSuccessPurchaseModal} />
        </div>
      </>
    );
  }

  return <></>;
}

export default Confirmation;
