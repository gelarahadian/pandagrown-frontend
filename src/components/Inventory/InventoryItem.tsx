import { Market } from "context/MarketContext";
import React from "react";

interface InventoryItemProps {
  market: Market;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ market }) => {
  const handleSelect = () => {
    console.log("buy");
  };
  return (
    <div className="w-full bg-white p-6 rounded-5">
      <div className="w-full flex justify-between">
        <div>
          <h1 className="text-xl font-bold">{market.name}</h1>
          <p className="text-xs font-normal">Available Stock: {market.stock}</p>
        </div>
        <div>
          <h1 className="text-green text-right text-xl font-bold ">
            USD {market.buy_price}
          </h1>
          <p className="text-xs font-normal text-right">size ({market.size})</p>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <div>
          <img
            src={market.cover_img}
            alt={market.name}
            className="object-cover w-32 h-32"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => handleSelect()}
            className="rounded bg-green border-green text-white font-bold mt-auto py-1 px-3"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;
