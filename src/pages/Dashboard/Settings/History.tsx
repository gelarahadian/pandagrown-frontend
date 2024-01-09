import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import SidebarWallet from "components/Layout/SidebarWallet";
import DataTable from "components/common/DataTable";
import Dropdown from "components/common/Dropdown";
import LoadingSpinner from "components/common/LoadingSpinner";
import api from "utils/api";
import { Skeleton } from "@mui/material";
import filter from "assets/images/Filter.png";
import { config } from "config";
import "styles/deposit.scss";
import panda from "assets/icons/pandami.svg";
import coinbase from "assets/icons/Coinbase.svg";
import { formatNumber } from "../../../utils/common";
import { Scrollbars } from "rc-scrollbars";

export interface HistoryItem {
  id: number;
  date: string;
  type: number;
  method: string;
  method_icon: string;
  amount: number;
  coin_amount: number;
  address: string;
  unit: string;
  tx_hash: string;
}

function History() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepositChecked, setIsDepositChecked] = useState(true);
  const [isWithdrawChecked, setIsWithdrawChecked] = useState(true);
  const [isPendingWithdrawChecked, setIsPendingWithdrawChecked] =
    useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getHistoryData();
  }, [isDepositChecked, isWithdrawChecked, isPendingWithdrawChecked]);

  const getHistoryData = () => {
    setIsLoading(true);
    setTimeout(() => {
      api
        .get(`payment/transaction/log/`, {
          params: {
            user_id: user.user_id,
            deposit: isDepositChecked ? "1" : "0",
            withdraw: isWithdrawChecked ? "1" : "0",
            status: isPendingWithdrawChecked ? "0" : "1",
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res: any) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            const transformedData: HistoryItem[] = data
              .filter(
                (item: any) => getHistoryType(item.method, item.status) !== -1
              )
              .map((item: any) => {
                return {
                  id: item.id,
                  date: formatDate(item.updated_at),
                  type: getHistoryType(item.method, item.status),
                  method: item.type_id,
                  method_icon: item.icon,
                  amount: item.amount,
                  coin_amount: item.coin_amount,
                  address: item.address,
                  unit: item.unit,
                  tx_hash: item.tx_hash,
                };
              });
            setHistoryList(transformedData);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    });
  };

  const getHistoryType = (method: number, status: number) => {
    if (method == 0 && status == 1) {
      return 0;
    } else if (method == 1 && status == 0) {
      return 2;
    } else if (method == 1 && status == 1) {
      return 1;
    } else {
      return -1;
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);

    // Get day, month, and year
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    // Get hours and minutes
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Construct the formatted date and time string
    const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}`;

    return formattedDateTime;
  };

  const getTypeName = (idx: number) => {
    if (idx == 0) {
      return "Deposit Fund";
    } else if (idx == 1) {
      return "Withdraw Fund";
    } else if (idx == 2) {
      return "Pending to Withdraw";
    } else {
      return "";
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleCheckDepositChange = (event: any) => {
    setIsDepositChecked(event.target.checked);
  };

  const handleCheckWithdrawChange = (event: any) => {
    setIsWithdrawChecked(event.target.checked);
  };

  const handleCheckPendingWithdrawChange = (event: any) => {
    setIsPendingWithdrawChecked(event.target.checked);
  };

  if (isMobile) {
    return (
      <>
        <div className="pt-2 pb-4 px-4">
          <div className="w-full bg-white rounded">
            <div className="w-full flex items-center py-3 px-5 border-b border-black/10">
              <label className="text-base">Filter</label>
              <Dropdown
                open={open}
                onclose={handleOpen}
                trigger={
                  <div
                    className="!bg-white border border-black/10 h-10 w-10 ml-3 flex justify-center items-center rounded-md float-right"
                    onClick={handleOpen}
                  >
                    <img src={filter} />
                  </div>
                }
                menu={[
                  <label
                    className={`text-base ${
                      isDepositChecked ? "font-bold" : ""
                    } block `}
                    style={{ minWidth: "250px" }}
                  >
                    <input
                      type="checkbox"
                      checked={isDepositChecked}
                      onChange={handleCheckDepositChange}
                      className="h-4 w-4 mr-3 text-base align-middle"
                      disabled={isLoading}
                    />
                    Deposit Fund
                  </label>,
                  <label
                    className={`text-base ${
                      isWithdrawChecked ? "font-bold" : ""
                    } block`}
                    style={{ minWidth: "250px" }}
                  >
                    <input
                      type="checkbox"
                      checked={isWithdrawChecked}
                      onChange={handleCheckWithdrawChange}
                      className="h-4 w-4 mr-3 text-base align-middle"
                      disabled={isLoading}
                    />
                    Withdraw Fund
                  </label>,
                  <label
                    className={`text-base ${
                      isPendingWithdrawChecked ? "font-bold" : ""
                    } block`}
                    style={{ minWidth: "250px" }}
                  >
                    <input
                      type="checkbox"
                      checked={isPendingWithdrawChecked}
                      onChange={handleCheckPendingWithdrawChange}
                      className="h-4 w-4 mr-3 text-base align-middle"
                      disabled={isLoading}
                    />
                    Pending to Withdraw
                  </label>,
                ]}
              />
            </div>
            <div className="py-2">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                historyList.map((item, index) => (
                  <div className="px-5 py-2 odd:bg-black/10" key={index}>
                    <div className="flex w-full">
                      <div className="w-3/4 text-left truncate">
                        {item.date}
                      </div>
                      <div className="flex items-center w-1/4 text-right truncate">
                        <img
                          src={
                            item.method == "0"
                              ? panda
                              : item.method == "1"
                              ? coinbase
                              : config.api.API_URL +
                                "images/" +
                                item.method_icon
                          }
                          className="h-6 w-6 mr-2"
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        item.type == 2 ? "text-red-500" : ""
                      } font-bold py-2`}
                    >
                      {getTypeName(item.type)}
                    </div>
                    <div className="flex w-full">
                      <div className="w-2/3 text-left truncate">
                        {item.method == "1"
                          ? "$ " + item.amount
                          : item.method == "0"
                          ? formatNumber(item.coin_amount, 6) + " PGA"
                          : formatNumber(item.coin_amount, 6) + " " + item.unit}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isTablet ? <></> : <SidebarWallet />}
      <div className={`${isTablet ? "!ml-0" : ""} page-content relative pb-8`}>
        <div className="w-full pt-12">
          <label className="text-4xl font-bold">Transaction History</label>
          <div className="w-full mt-8 pt-2 bg-white rounded">
            <div className="border-b border-black/10 px-7 py-2">
              <label
                className={`text-base ${isDepositChecked ? "font-bold" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={isDepositChecked}
                  onChange={handleCheckDepositChange}
                  className="h-4 w-4 mr-3 text-base align-middle"
                />
                Deposit Fund
              </label>
              <label
                className={`text-base pl-10 ${
                  isWithdrawChecked ? "font-bold" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isWithdrawChecked}
                  onChange={handleCheckWithdrawChange}
                  className="h-4 w-4 mr-3 text-base align-middle"
                />
                Withdraw Fund
              </label>
              <label
                className={`text-base pl-10 ${
                  isPendingWithdrawChecked ? "font-bold" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isPendingWithdrawChecked}
                  onChange={handleCheckPendingWithdrawChange}
                  className="h-4 w-4 mr-3 text-base align-middle"
                />
                Pending to Withdraw
              </label>
            </div>
            <div className="pt-3 pb-7">
              {isLoading ? (
                <table className="w-full text-sm">
                  <tbody>
                    {Array.from({ length: 10 }, (_, index) => (
                      <tr className="h-12 odd:bg-black/10" key={index}>
                        <td className="pl-7 w-1/6">
                          <Skeleton
                            animation="wave"
                            className="w-2/3"
                            variant="rounded"
                          />
                        </td>
                        <td className={`w-1/6`}>
                          <Skeleton
                            animation="wave"
                            className="w-2/3"
                            variant="rounded"
                          />
                        </td>
                        <td className="w-1/6 h-12">
                          <div className="w-full flex items-center">
                            <Skeleton
                              animation="wave"
                              className="!h-6 w-6 mr-2"
                              variant="circular"
                            />
                            <Skeleton
                              animation="wave"
                              variant="rounded"
                              width={150}
                            />
                          </div>
                        </td>
                        <td className="pl-2" style={{ width: "22%" }}>
                          <Skeleton
                            className="w-2/3"
                            animation="wave"
                            variant="rounded"
                          />
                        </td>
                        <td className="w-1/12 pl-2">
                          <Skeleton
                            className="w-2/3"
                            animation="wave"
                            variant="rounded"
                          />
                        </td>
                        <td className="w-1/5 pr-10">
                          <Skeleton
                            className="w-2/3"
                            animation="wave"
                            variant="rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Scrollbars
                  style={{ width: "100%", height: "calc(100vh - 269px)" }}
                >
                  <DataTable data={historyList} />
                </Scrollbars>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default History;
