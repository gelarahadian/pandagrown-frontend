import React, { createContext, useState, useContext, ReactNode } from "react";
import api from "utils/api";
import { AuthContent, MyAuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { usePlant } from "./PlantContext";

interface CartContextProps {
  loadingCloneCart: boolean;
  setLoadingCloneCart: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItemInfo[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemInfo[]>>;
  showPurchaseModal: boolean;
  setShowPurchaseModal: React.Dispatch<React.SetStateAction<boolean>>;
  loadingConfirm: boolean;
  setLoadingConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessPurchaseModal: boolean;
  setShowSuccessPurchaseModal: React.Dispatch<React.SetStateAction<boolean>>;
  getPGABalance: (
    botani_state: number,
    rhizo_state: number,
    silica_state: number
  ) => void;
  handleGetCartItems: () => void;
  onCheckout: () => void;
  onDelCart: (idx: number) => void;
  onClosePurchase: () => void;
  onCloseSuccessPurchase: () => void;
  onPurchase: () => void;
}

interface CartProviderProps {
  children: React.ReactNode;
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

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, setUser } = useContext<AuthContent>(MyAuthContext);
  const { handleGetItem } = usePlant();

  const [loadingCloneCart, setLoadingCloneCart] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemInfo[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [showSuccessPurchaseModal, setShowSuccessPurchaseModal] =
    useState(false);

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

  const onCheckout = () => {
    setShowPurchaseModal(true);
  };

  const onClosePurchase = () => {
    setShowPurchaseModal(false);
  };

  const onCloseSuccessPurchase = () => {
    setShowSuccessPurchaseModal(false);
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

  return (
    <CartContext.Provider
      value={{
        loadingCloneCart,
        setLoadingCloneCart,
        cartItems,
        setCartItems,
        showPurchaseModal,
        setShowPurchaseModal,
        getPGABalance,
        handleGetCartItems,
        onCheckout,
        onDelCart,
        onClosePurchase,
        onCloseSuccessPurchase,
        loadingConfirm,
        setLoadingConfirm,
        showSuccessPurchaseModal,
        setShowSuccessPurchaseModal,
        onPurchase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
