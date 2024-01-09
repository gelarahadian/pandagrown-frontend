import { useState, useEffect, useContext, SyntheticEvent } from "react";

import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";

import Sidebar from "components/Layout/Sidebar";
import EmptySellOrder from "components/SellOrder/EmptySellOrder";
import SellItem from "components/SellOrder/SellItem";
import EmptyHouseMobile from "components/Greenhouse/mobile/EmptyHouseMobile";
import SellItemMobile from "components/SellOrder/mobile/SellItemMobile";
import { SellPlant } from "components/SellOrder/SellItem";
import LoadingSpinner from "components/common/LoadingSpinner";
import Dropdown from "components/common/Dropdown";
import api from "utils/api";
import { FaSearch, FaCheck } from "react-icons/fa";
import filter from "assets/images/Filter.png";
import IconPlant from "assets/icons/icon-plant.png";
import IconHarvest from "assets/icons/icon-harvest.png";
import IconProfit from "assets/icons/icon-profit.png";
import "styles/sellorder.scss";

function SellOrder() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);
  const [plants, setPlants] = useState<SellPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("");
  const [open, setOpen] = useState(false);

  const handleGetPlants = () => {
    setIsLoading(true);
    setTimeout(() => {
      api
        .get(
          `shop/${user.user_id}/sell/order?search=${searchQuery}&sort=${sort}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            const transformedData: SellPlant[] = data.map((item: any) => {
              return {
                id: item.id,
                seed_id: item.seed,
                user_id: item.user,
                name: item.name,
                image: item.cover_img,
                date: item.purchased_at,
                seed_price: item.buy_price,
                seed_weight: item.purchased_amount,
                harvest_rate: item.harvest_rate,
                profit: item.profit,
                clone_rooting_period: item.clone_rooting_period,
                vegetation_mass_period: item.vegetation_mass_period,
                flowering_preharvest_period: item.flowering_preharvest_period,
                harvest_period: item.harvest_period,
                harvest_amount: item.harvest_amount,
                total_price: item.total_purchase,
                total_profit: item.total_profit,
                total_period: item.total_period,
                status: item.status,
                payment_method: item.payment_method,
              };
            });

            setPlants(transformedData);
            setIsLoading(false);
          }
          // notice
        })
        .catch((err) => {
          // console.log('get cart data error', err);
          setIsLoading(false);
        });
    });
  };

  useEffect(() => {
    handleGetPlants();
  }, [sort]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleGetPlants();
    }
  };

  const onSearch = () => {
    if (searchQuery) {
      handleGetPlants();
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDropdownChange = (order: string) => {
    setSort(order);
    setOpen(false);
  };

  const formatNumber = (price: string, fixed_count: number): string => {
    let formattedPrice = Number(price).toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  if (isMobile) {
    return (
      <>
        <div className="relative">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="w-full flex px-8 mt-7 mb-5">
                <div className="relative flex-1 pr-2">
                  <input
                    type="input"
                    className="w-full h-12 py-1 pl-10 rounded-md shadow-sm"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <FaSearch
                    className="absolute top-4 left-3 mr-3 flex-none text-xl"
                    onClick={onSearch}
                  />
                </div>
                <div className=" pl-2 text-right">
                  <Dropdown
                    open={open}
                    onclose={handleOpen}
                    trigger={
                      <div
                        className="!bg-white h-12 w-12 flex justify-center items-center rounded-md float-right"
                        onClick={handleOpen}
                      >
                        <img src={filter} />
                      </div>
                    }
                    menu={[
                      <button
                        onClick={() => handleDropdownChange("-purchased_at")}
                        className={`${
                          sort == "-purchased_at" ? "" : "pl-7"
                        } flex items-center`}
                      >
                        {sort == "-purchased_at" ? (
                          <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                        ) : (
                          ""
                        )}{" "}
                        Sort by Newest Plant
                      </button>,
                      <button
                        onClick={() => handleDropdownChange("purchased_at")}
                        className={`${
                          sort == "purchased_at" ? "" : "pl-7"
                        } flex items-center`}
                      >
                        {sort == "purchased_at" ? (
                          <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                        ) : (
                          ""
                        )}{" "}
                        Sort by Oldest Plant
                      </button>,
                      <button
                        onClick={() => handleDropdownChange("name")}
                        className={`${
                          sort == "name" ? "" : "pl-7"
                        } flex items-center`}
                      >
                        {sort == "name" ? (
                          <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                        ) : (
                          ""
                        )}{" "}
                        Sort by Asc Name
                      </button>,
                      <button
                        onClick={() => handleDropdownChange("-name")}
                        className={`${
                          sort == "-name" ? "" : "pl-7"
                        } flex items-center`}
                      >
                        {sort == "-name" ? (
                          <FaCheck className="w-5 h-5 mr-2 text-black/80" />
                        ) : (
                          ""
                        )}{" "}
                        Sort by Dsc Name
                      </button>,
                    ]}
                  />
                </div>
              </div>
              {plants.length === 0 ? (
                <EmptyHouseMobile />
              ) : (
                <div>
                  <SellItemMobile plants={plants} />
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {isTablet ? <></> : <Sidebar />}
      <div className={`${isTablet ? "!ml-0" : ""} page-content relative pb-10`}>
        <div className="flex w-full pt-24">
          <div className="w-1/2 text-left">
            <label className="text-4xl font-bold mb-2">Sell Order</label>
          </div>
          <div className="w-1/2 -mt-6 flex items-center justify-end">
            <div
              className="pl-4 py-2 bg-white rounded-l-lg relative"
              style={{ minWidth: "96px" }}
            >
              <label className="block pl-2 text-black">Plants</label>
              <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                {formatNumber(user.plants, 0)}
              </label>
            </div>
            <div className="bg-white flex px-2 items-center h-full">
              <hr className="h-6 bg-black" style={{ width: "2px" }}></hr>
            </div>
            <div
              className="py-2 bg-white relative"
              style={{ minWidth: "96px" }}
            >
              <label className="block pl-2 text-black">Harvest</label>
              <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                {formatNumber(user.harvest, 1)}g
              </label>
            </div>
            <div className="bg-white flex px-2 items-center h-full">
              <hr className="h-6 bg-black" style={{ width: "2px" }}></hr>
            </div>
            <div
              className="pr-4 py-2 bg-white rounded-r-lg relative"
              style={{ minWidth: "96px" }}
            >
              <label className="block pl-2 text-black">Profit</label>
              <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                {formatNumber(user.profit, 2)}
              </label>
            </div>
          </div>
        </div>

        <div className="w-full flex mt-8">
          <div className="relative w-3/4 pr-2">
            <input
              type="input"
              className="w-full h-12 py-1 pl-10 rounded-md shadow-sm"
              placeholder="Search"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <svg
              width="24"
              height="24"
              fill="none"
              aria-hidden="true"
              className="absolute top-3 left-2 mr-3 flex-none"
            >
              <path
                d="m19 19-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></circle>
            </svg>
          </div>
          <div className="w-1/4 pl-2">
            <select
              className="w-full bg-white h-12 px-3 rounded-md shadow-sm focus:outline-none"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">Sort by Asc Name</option>
              <option value="-name">Sort by Dsc Name</option>
              <option value="-price">Sort by Lowest Price</option>
              <option value="price">Sort by Largest Price</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : plants.length === 0 ? (
          <EmptySellOrder />
        ) : (
          <div>
            <SellItem plants={plants} />
          </div>
        )}
      </div>
    </>
  );
}

export default SellOrder;
