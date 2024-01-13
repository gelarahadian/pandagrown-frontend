import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";

import Sidebar from "components/Layout/Sidebar";
import EmptyWarehouse from "components/Warehouse/EmptyWarehouse";
import EmptyWarehouseMobile from "components/Warehouse/mobile/EmptyWarehouseMobile";
import WarehouseItem from "components/Warehouse/WarehouseItem";
import WarehouseItemMobile from "components/Warehouse/mobile/WarehouseItemMobile";

import { WarehousePlant } from "components/Warehouse/WarehouseItem";
import LoadingSpinner from "components/common/LoadingSpinner";
import { toast } from "react-toastify";
import Dropdown from "components/common/Dropdown";
import api from "utils/api";
import { FaSearch, FaCheck } from "react-icons/fa";
import filter from "assets/images/Filter.png";
import IconPlant from "assets/icons/icon-plant.png";
import IconHarvest from "assets/icons/icon-harvest.png";
import IconProfit from "assets/icons/icon-profit.png";
import "react-toastify/dist/ReactToastify.css";

function Warehouse() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);
  const [plants, setPlants] = useState<WarehousePlant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSellLoading, setIsSellLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [plantId, setPlantId] = useState(0);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("name");
  const navigate = useNavigate();

  const handleGetPlants = () => {
    setIsLoading(true);
    setTimeout(() => {
      api
        .get(
          `shop/${user.user_id}/warehouse/?search=${searchQuery}&sort=${sort}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            const transformedData: WarehousePlant[] = data.map((item: any) => {
              return {
                id: item.id,
                seed_id: item.seed,
                user_id: item.user,
                name: item.name,
                image: item.cover_img,
                date: item.purchased_at,
                current_period: item.current_period,
                profit: item.profit,
                seed_price: item.buy_price,
                seed_weight: item.purchased_amount,
                harvest_rate: item.harvest_rate,
                drying_period: item.drying_period,
                curing_period: item.curing_period,
                packing_period: item.packing_period,
                warehouse_period: item.warehouse_period,
                payment_method: item.payment_method,
                price_sum: item.price_sum,
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
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleGetPlants();
    }
  };

  const handleSellHarvest = () => {
    setIsSellLoading(true);
    api
      .post(`shop/${plantId}/sell/harvest/`, {})
      .then((res: any) => {
        const data = res.data;
        if (data.type == "success") {
          toast.success("Your plant successfully added to selling order page.");
          navigate("/sellorder");
        } else {
          toast.error("Failed to add sell order.");
        }
        setIsSellLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add sell order");
        setIsSellLoading(false);
      });
  };

  const handleClickSell = (idx: number) => {
    setPlantId(idx);
    setShowConfirmModal(true);
  };

  const handleDropdownChange = (order: string) => {
    setSort(order);
    setOpen(false);
  };

  const onCloseModal = () => {
    setShowConfirmModal(false);
  };

  const onSearch = () => {
    if (searchQuery) {
      handleGetPlants();
    }
  };

  const handleOpen = () => {
    setOpen(!open);
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
                <EmptyWarehouseMobile />
              ) : (
                <WarehouseItemMobile
                  plants={plants}
                  isShowModal={showConfirmModal}
                  onCloseModal={onCloseModal}
                  isLoading={isSellLoading}
                  onClickSell={handleClickSell}
                  onSellHarvest={handleSellHarvest}
                />
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
      <div className={`${isTablet ? "!ml-0" : ""} page-content relative`}>
        <div className="flex w-full pt-24">
          <div className="w-1/2 text-left">
            <label className="text-4xl font-bold mb-2">Warehouse</label>
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
          <EmptyWarehouse />
        ) : (
          <div className=" pb-12">
            <WarehouseItem
              plants={plants}
              isShowModal={showConfirmModal}
              onCloseModal={onCloseModal}
              isLoading={isSellLoading}
              onClickSell={handleClickSell}
              onSellHarvest={handleSellHarvest}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Warehouse;
