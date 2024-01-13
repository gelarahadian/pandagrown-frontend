import React, { createContext, useContext, useState } from "react";
import api from "utils/api";

export interface PlantProviderProps {
  children: React.ReactNode;
}

export interface Item {
  id: number;
  name: string;
  stock: number;
  image: string;
  buy_price: number;
  harvest_rate: number;
  clone_rooting_period: number;
  vegetation_mass_period: number;
  flowering_preharvest_period: number;
  harvest_period: number;
  curing_period: number;
  drying_period: number;
  packing_period: number;
}

export interface PlantContext {
  loadingCloneItem: boolean;
  setLoadingCloneItem: React.Dispatch<React.SetStateAction<boolean>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  handleGetItem: () => void;
}

export const PlantContext = createContext<PlantContext | undefined>(undefined);

export const PlantProvider: React.FC<PlantProviderProps> = ({ children }) => {
  const [loadingCloneItem, setLoadingCloneItem] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("-purchased_count");

  const handleGetItem = () => {
    setLoadingCloneItem(true);
    setTimeout(() => {
      api
        .get(`shop/seed/list/?search=${searchQuery}&ordering=${sort}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            // data.map
            const transformedData: Item[] = data.map((item: any) => {
              return {
                id: item.id,
                name: item.name,
                stock: item.stock,
                image: item.cover_img,
                buy_price: item.buy_price,
                harvest_rate: item.harvest_rate,
                clone_rooting_period: 14,
                vegetation_mass_period: item.vegetation_mass_period,
                flowering_preharvest_period: item.flowering_preharvest_period,
                harvest_period: item.harvest_period,
                curing_period: item.curing_period,
                drying_period: item.drying_period,
                packing_period: item.packing_period,
              };
            });
            setItems(transformedData);
          }
          // notice
          setLoadingCloneItem(false);
          console.log("get seed data", data);
        })
        .catch((err) => {
          console.log("get seed data error", err);
          setLoadingCloneItem(false);
        });
    }, 100);
  };
  return (
    <PlantContext.Provider
      value={{
        loadingCloneItem,
        setLoadingCloneItem,
        items,
        setItems,
        searchQuery,
        setSearchQuery,
        sort,
        setSort,
        handleGetItem,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlant = (): PlantContext => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
