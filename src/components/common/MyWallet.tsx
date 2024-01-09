import { useContext, useEffect } from "react";
import { useMobileContext } from "context/MobileContext";
import { MyAuthContext } from "context/AuthContext";
import IconPlant from "assets/icons/icon-plant.png";
import IconHarvest from "assets/icons/icon-harvest.png";
import IconProfit from "assets/icons/icon-profit.png";
import api from "../../utils/api";

const MyWallet = () => {
  const isMobile = useMobileContext();
  const { user } = useContext(MyAuthContext);

  const formatNumber = (price: string, fixed_count: number): string => {
    let formattedPrice = Number(price).toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  // if (true) {
  //   return (
  //     <button className="btn-wallet text-xl w-full py-5 rounded-5">Setup My Wallet</button>
  //   )
  // }
  return (
    <>
      <button className="w-full flex h-16 px-5 text-base items-center bg-white/10 border-dashed border rounded ">
        <span className="w-1/3 font-bold text-left">USD</span>
        <span className="w-2/3 text-right">
          {formatNumber(user.balance, 4)}
        </span>
      </button>
      <button className="w-full flex h-16 px-5 mt-3 text-base items-center bg-white/10 border-dashed border rounded">
        <span className="w-1/3 font-bold text-left">PGA</span>
        <span className="w-2/3 text-right">
          {formatNumber(user.pga_balance, 4)}
        </span>
      </button>
      {isMobile ? (
        <div>
          <div className="flex items-center border bg-white border-black/10 rounded-lg my-6 px-3 py-2 ">
            <div className="text-black" style={{ width: "38%" }}>
              <label className="block">Plants</label>
              <label className="block text-left font-bold text-xl relative truncate">
                {formatNumber(user.plants, 0)}
              </label>
            </div>
            <div className="" style={{ width: "8%" }}>
              <hr
                className="h-6 mx-auto bg-black"
                style={{ width: "2px" }}
              ></hr>
            </div>
            <div className="text-black" style={{ width: "38%" }}>
              <label className="block">Harvest</label>
              <label className="block text-left font-bold text-xl relative truncate">
                {formatNumber(user.harvest, 1)}g
              </label>
            </div>
          </div>
          <div
            className="flex items-center border border-black/10 bg-white rounded-lg my-6 px-3 py-2 "
            style={{ width: "38%" }}
          >
            <div className="text-black ">
              <label className="block">Profit(USD)</label>
              <label className="block text-left font-bold text-xl relative truncate">
                ${formatNumber(user.profit, 2)}
              </label>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <select>
      <option>Option1</option>
    </select>
  );
};

export default MyWallet;
