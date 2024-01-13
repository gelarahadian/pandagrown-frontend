import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import SidebarWallet from "components/Layout/SidebarWallet";
import { MdContentCopy } from "react-icons/md";
import Select from "react-select";
import panda from "assets/icons/pandami.svg";
import coinbase from "assets/icons/Coinbase.svg";
import DataTable from "components/common/DataTable";
import Dropdown from "components/common/Dropdown";
import LoadingSpinner from "components/common/LoadingSpinner";
import api from "utils/api";
import { Skeleton } from "@mui/material";
import filter from "assets/images/Filter.png";
import { config } from "config";
import "styles/deposit.scss";
import SidebarHistory from "components/Layout/SidebarHistory";
import TabletSidebarHistory from "components/Layout/tablet/TabletSidebarHistory";
import { formatNumber } from "../../../utils/common";
import arrowUp from "assets/icons/Arrow - Up 2.svg";
import arrowDown from "assets/icons/Arrow - Down 2.svg";

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

function NavHistory() {
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
  const [usd_balance, setUsdBalance] = useState("-1");
  const [invest_fund, setInvestFund] = useState("-1");
  const [total_profit, setTotalProfit] = useState("-1");
  const [total_pga_purchased, setTotalPgaPurchased] = useState("-1");
  const [total_pga_deposit, setTotalPgaDeposit] = useState("-1");
  const [total_pga_withdraw, setTotalPgaWithdraw] = useState("-1");
  const [referral_earning, setReferralEarning] = useState("-1");

  const [referralLink, setReferralLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {})
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const getReferralLink = () => {
    api
      .get(`user/${user.user_id}/referr/link/`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res: any) => {
        const data = res.data;
        if (res.data && data.type == "success") {
          setReferralLink(data.link);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      getHistoryData();
      getReferralLink();
      getReportData();
    }, 100);
  }, [isDepositChecked, isWithdrawChecked, isPendingWithdrawChecked]);

  const getReportData = () => {
    setTimeout(() => {
      api
        .get(`user/${user.user_id}/report/`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res: any) => {
          const data = res.data;
          if (data.type === "success") {
            const res = data.data;
            setReportData(res);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    });
  };

  const setReportData = (data: any) => {
    setUsdBalance(data.usd_balance);
    setInvestFund(data.invest_fund);
    setTotalProfit(data.total_profit);
    setTotalPgaPurchased(data.total_pga_purchased);
    setTotalPgaDeposit(data.total_pga_deposit);
    setTotalPgaWithdraw(data.total_pga_withdraw);
  };

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
          <span className="text-xl font-bold">My Report</span>
          <button
            className="w-full flex h-16 px-5 mt-6 text-base items-center bg-white rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="font-bold text-xl">PGA Token Report</span>
            <img className="ml-auto" src={isOpen ? arrowUp : arrowDown} />
          </button>
          {isOpen ? (
            <div className="w-full flex flex-col ">
              <div className="w-full rounded-b border-t border-stone-400 bg-white pt-6 pr-3 pl-3 pb-3">
                {/*<label className="text-sm font-bold">Cryptocurrency</label>*/}
                <div className="flex mt-2 mb-10 px-5 py-3 w-full items-center bg-black/10 rounded text-sm font-bold">
                  <img src={panda} className="h-8 pr-3" alt="Coinbase" />
                  <div className="truncate">
                    <label className="block text-sm truncate">Pandanami</label>
                  </div>
                </div>
                <label className="text-sm font-bold">On investment</label>
                <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
                  <span className="w-1/3 font-bold text-left">PGA</span>
                  <span className="w-2/3 text-right">
                    {total_pga_purchased}
                  </span>
                </button>
                <label className="text-sm font-bold">Deposit</label>
                <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
                  <span className="w-1/3 font-bold text-left">PGA</span>
                  <span className="w-2/3 text-right">{total_pga_deposit}</span>
                </button>
                <label className="text-sm font-bold">Withdrawn</label>
                <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
                  <span className="w-1/3 font-bold text-left">PGA</span>
                  <span className="w-2/3 text-right">{total_pga_withdraw}</span>
                </button>
                <label className="text-sm font-bold">Referral Earnings</label>
                <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
                  <span className="w-1/3 font-bold text-left">PGA</span>
                  <span className="w-2/3 text-right">{referral_earning}</span>
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="w-full flex flex-col p-3 mt-8 mb-10 bg-white rounded-t">
            <div className="p-3 mb-3 bg-black/10 rounded">
              <label className="text-md font-bold">Referral Link</label>
              <div className="flex justify-between items-center h-14 bg-white border border-stone-300 rounded">
                <span
                  className="pl-3.5 pr-2 text-md truncate"
                  style={{ width: isMobile ? "160px" : "" }}
                >
                  {referralLink}
                </span>
                <MdContentCopy
                  className="w-6 h-6 mr-4 text-lime-700 cursor-pointer"
                  onClick={copyToClipboard}
                />
              </div>
            </div>
            <label className="text-sm font-bold">Available balance</label>
            <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
              <span className="w-1/3 font-bold text-left">USD</span>
              <span className="w-2/3 text-right">{usd_balance}</span>
            </button>
            <label className="text-sm font-bold">Fund in progress</label>
            <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
              <span className="w-1/3 font-bold text-left">USD</span>
              <span className="w-2/3 text-right">{invest_fund}</span>
            </button>
            <label className="text-sm font-bold">Return on investment</label>
            <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
              <span className="w-1/3 font-bold text-left">USD</span>
              <span className="w-2/3 text-right">{total_profit}</span>
            </button>
          </div>
          <span className="text-base font-bold">Transaction History</span>
          <div className="w-full bg-white rounded mt-3">
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
                      <div className="flex justify-end w-1/4 text-right truncate">
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
      {isTablet ? (
        <></>
      ) : (
        <SidebarHistory
          usd_balance={usd_balance}
          invest_fund={invest_fund}
          total_profit={total_profit}
        />
      )}
      <div
        className={`${
          isTablet ? "!ml-0" : ""
        } page-content relative !pr-0 flex`}
      >
        <div
          className={`${
            isTablet ? "transaction-history-content" : "w-3/4"
          } pb-8 pr-8 pt-12`}
        >
          <label className="text-4xl font-bold">My Report</label>
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
                <DataTable data={historyList} />
              )}
            </div>
          </div>
        </div>
        {isTablet ? (
          <div className="flex w-80">
            <TabletSidebarHistory />
          </div>
        ) : (
          <div className="flex flex-col w-1/4 bg-white p-9">
            <label className="text-xl font-bold mt-12">
              PandaGrown Token Report
            </label>
            {/*<label className="text-sm font-bold mt-4">Cryptocurrency</label>*/}
            <div className="flex mt-2 px-5 py-3 w-full items-center bg-black/10 rounded text-sm font-bold">
              <img src={panda} className="h-8 pr-3" alt="PGA Token" />
              <div className="truncate">
                <label className="block text-sm truncate">Pandanami</label>
              </div>
            </div>
            <hr className="color-gray mt-10 mb-10" />
            <label className="text-sm font-bold">On investment</label>
            <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
              <span className="w-1/3 font-bold text-left">PGA</span>
              <span className="w-2/3 text-right">{total_pga_purchased}</span>
            </button>
            <label className="text-sm font-bold">Deposit</label>
            <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
              <span className="w-1/3 font-bold text-left">PGA</span>
              <span className="w-2/3 text-right">{total_pga_deposit}</span>
            </button>
            <label className="text-sm font-bold">Withdrawn</label>
            <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
              <span className="w-1/3 font-bold text-left">PGA</span>
              <span className="w-2/3 text-right">{total_pga_withdraw}</span>
            </button>
            <label className="text-sm font-bold hidden">
              Referral Earnings
            </label>
            <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded hidden">
              <span className="w-1/3 font-bold text-left">PGA</span>
              <span className="w-2/3 text-right">{referral_earning}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default NavHistory;
