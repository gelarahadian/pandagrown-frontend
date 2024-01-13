import { useState, useEffect, useContext, SyntheticEvent } from "react";

import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import Sidebar from "components/Layout/Sidebar";
import EmptyHouse from "components/Greenhouse/EmptyHouse";
import PlantCard from "components/Greenhouse/PlantCard";
import EmptyHouseMobile from "components/Greenhouse/mobile/EmptyHouseMobile";
import PlantCardMobile from "components/Greenhouse/mobile/PlantCardMobile";
import { Plant } from "types/common";
import LoadingSpinner from "components/common/LoadingSpinner";
import Dropdown from "components/common/Dropdown";
import api from "utils/api";
import { FaSearch, FaCheck } from "react-icons/fa";
import filter from "assets/images/Filter.png";
import IconPlant from "assets/icons/icon-plant.png";
import IconHarvest from "assets/icons/icon-harvest.png";
import IconProfit from "assets/icons/icon-profit.png";

function GreenHouse() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("-purchased_at");
  const [open, setOpen] = useState(false);

  const handleGetPlants = () => {
    setIsLoading(true);
    setTimeout(() => {
      api
        .get(
          `shop/${user.user_id}/greenhouse/?search=${searchQuery}&sort=${sort}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            const transformedData: Plant[] = data.map((item: any) => {
              return {
                id: item.id,
                seed_id: item.seed_id,
                user_id: item.user_id,
                name: item.name,
                image: item.cover_img,
                date: item.purchased_at,
                current_period: item.current_period,
                profit: item.profit,
                seed_price: item.buy_price,
                seed_weight: item.purchased_amount,
                seed_media: item.seed_media,
                harvest_rate: item.harvest_rate,
                // clone_rooting_period: item.clone_rooting_period,
                clone_rooting_period: 14,
                vegetation_mass_period: item.vegetation_mass_period,
                flowering_preharvest_period: item.flowering_preharvest_period,
                harvest_period: item.harvest_period,
                est_harvest_at: item.est_harvest_at,
                payment_method: item.payment_method,
                price_sum: item.price_sum,
                method_botanicare: item.method_botanicare,
                method_rhizo: item.method_rhizo,
                method_silica: item.method_silica,
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
                  <PlantCardMobile plants={plants} />
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
            <label className="text-4xl font-bold mb-2">My Green house</label>
          </div>
          {/* <div className="w-1/2 -mt-6 flex items-center justify-end">
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
              <label className="block pl-2 text-black">Profit(USD)</label>
              <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                ${formatNumber(user.profit, 2)}
              </label>
            </div>
            <div className="bg-white flex px-2 items-center h-full">
              <hr className="h-6 bg-black" style={{ width: "2px" }}></hr>
            </div>
            <div
              className="pr-4 py-2 bg-white rounded-r-lg relative"
              style={{ minWidth: "96px" }}
            >
              <label className="block pl-2 text-black">Profit(PGA)</label>
              <label className="pl-2 text-black block text-left font-bold text-xl relative truncate">
                ${formatNumber(user.profit_pga, 2)}
              </label>
            </div>
          </div> */}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : plants.length === 0 ? (
          <EmptyHouse />
        ) : (
          <PlantCard plants={plants} />
        )}
      </div>
    </>
  );
}

export default GreenHouse;
