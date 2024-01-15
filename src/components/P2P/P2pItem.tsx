import React from "react";

interface P2pItemProps {}

const P2pItem: React.FC<P2pItemProps> = ({}) => {
  const handleSelect = () => {
    console.log("buy");
  };
  return (
    <div className="w-full bg-white p-6 rounded-5 flex">
      <div className="border-r border-gray px-3 space-y-1">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Rizhoblast</h1>
          <p className="text-xs font-normal">
            <span className="text-green text-right text-xl font-bold">1</span>{" "}
            Liter
          </p>
        </div>
        <div className="flex space-x-4 items-center">
          <img
            src="https://api.pandagrown.com/images/market/cover/rhizoblast_1.png"
            className="w-14 h-14 object-contain"
            alt="Rizhoblast"
          />
          <div className="flex-1 space-y-1">
            <h2 className="text-xs font-normal">Nazwa Nabila</h2>
            <p className="text-xs font normal text-gray">January 6th 2023</p>
          </div>
        </div>
      </div>
      <div className="flex-1 pl-4">
        <h1 className="text-xl text-end">
          Price:{" "}
          <span className="text-green text-right text-xl font-bold ">
            1 USD
          </span>
        </h1>
        <div>
          <p className="text-xs font-bold">Reducement</p>
          <p className="text-xs text-gray">6 Day</p>
        </div>
        <div className="flex justify-end mt-auto w-full">
          <button className="rounded bg-green border-green text-white font-bold mt-auto py-1 px-3">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default P2pItem;
