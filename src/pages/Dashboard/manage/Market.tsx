import { Skeleton } from "@mui/material";
import Sidebar from "components/Layout/Sidebar";
import { useTabletContext } from "context/TabletContext";
import React from "react";

const Market = () => {
  const isTablet = useTabletContext();
  // const [loadingCloneCart, setLoadingCloneCart] = useState(true);

  return (
    <>
      {isTablet ? <></> : <Sidebar />}
      <div className={`${!isTablet && "pl-[392px] flex"}`}>
        <div className="flex-1 pt-24"></div>
        {/* {loadingCloneCart ? (
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
        )} */}
      </div>
    </>
  );
};

export default Market;
