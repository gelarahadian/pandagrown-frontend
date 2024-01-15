import { useMarket } from "context/MarketContext";
import React, { useEffect, useRef, useState } from "react";
import InventoryItem from "./InventoryItem";
import { Skeleton } from "@mui/material";

const InventoryContainer = () => {
  const [cloneContainerWidth, setCloneContainerWidth] = useState<number>(0);
  const myMarketContainer = useRef<HTMLDivElement | null>(null);

  const { markets, loadingMarket } = useMarket();

  const updateCloneContainerWidth = () => {
    if (myMarketContainer.current) {
      const { width } = myMarketContainer.current!.getBoundingClientRect();
      setCloneContainerWidth(width);
    }
  };

  useEffect(() => {
    if (myMarketContainer.current) {
      updateCloneContainerWidth();
    }

    const handleResize = () => {
      updateCloneContainerWidth();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const column = cloneContainerWidth < 720;
  return (
    <>
      <div
        ref={myMarketContainer}
        className={`w-full mt-8 mb-6 grid ${
          column ? "grid-cols-1" : "grid-cols-2"
        } gap-5`}
      >
        {loadingMarket ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="relative w-full clone-item bg-white rounded-5 border-none"
                key={index}
              >
                <section>
                  <div className="pt-6 pl-8 pr-10 flex w-full items-center">
                    <div className="w-3/5 text-left">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={80}
                        height={28}
                        className=""
                      />
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={120}
                        height={20}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-2/5 flex justify-end">
                      <div>
                        <div className="flex justify-end">
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            width={70}
                            height={28}
                            className=""
                          />
                        </div>
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          width={100}
                          height={20}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-5 w-full items-end">
                    <div
                      className="w-2/3 bottom-0 relative"
                      style={{ paddingTop: "36%" }}
                    ></div>
                    <div className="w-1/3 text-right pr-10 mb-8 flex justify-end">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={100}
                        height={44}
                      />
                    </div>
                  </div>
                </section>
              </div>
            ))}
          </>
        ) : (
          <>
            {markets && (
              <>
                {markets.map((market) => (
                  <InventoryItem key={market.id} market={market} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default InventoryContainer;
