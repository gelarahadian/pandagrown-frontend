import React, { createContext, useContext, useState } from "react";
import api from "utils/api";

export interface Market {
  benefit: number;
  benefit_type: number;
  buy_price: number;
  cover_img: string;
  id: number;
  name: string;
  size: string;
  stock: number;
  unit: number;
}
export interface MarketContext {
  markets: Market[];
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  loadingMarket: boolean;
  setLoadingMarket: React.Dispatch<React.SetStateAction<boolean>>;
  handleGetMarket: () => void;
}

export const MarketContext = createContext<MarketContext | undefined>(
  undefined
);

export interface MarketProviderProps {
  children: React.ReactNode;
}

export const MarketProvider: React.FC<MarketProviderProps> = ({ children }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loadingMarket, setLoadingMarket] = useState<boolean>(false);
  const handleGetMarket = () => {
    // setCartItems(items);
    setLoadingMarket(true);
    setTimeout(() => {
      api
        .get(`market`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data.results;
          if (res.data && Object.keys(data).length > 0) {
            // data.map
            const transformedData: Market[] = data.map((item: any) => {
              return {
                benefit: item.benefit,
                benefit_type: item.benefit_type,
                buy_price: item.buy_price,
                cover_img: item.cover_img,
                id: item.id,
                name: item.name,
                size: item.size,
                stock: item.stock,
                unit: item.unit,
              };
            });
            setMarkets(transformedData);
          }
          // notice
          console.log("get market data", data);
          setLoadingMarket(false);
        })
        .catch((err) => {
          console.log("get market data error", err);
          setLoadingMarket(false);
        });
    }, 200);
  };

  return (
    <MarketContext.Provider
      value={{
        markets,
        setMarkets,
        loadingMarket,
        setLoadingMarket,
        handleGetMarket,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = (): MarketContext => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
