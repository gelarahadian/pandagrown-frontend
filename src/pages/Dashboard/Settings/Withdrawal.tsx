import React, { useState, useEffect, useContext, useRef } from "react";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import SidebarWallet from "components/Layout/SidebarWallet";
import { toast } from "react-toastify";
import { config } from "config";
import api from "utils/api";
import { FaSpinner, FaBitcoin, FaEthereum } from "react-icons/fa";
import Select from "react-select";
import "styles/deposit.scss";
import "react-toastify/dist/ReactToastify.css";
import { CoinInfo, OptionInfo } from "types/common";
import { Scrollbars } from "rc-scrollbars";
import panda from "../../../assets/icons/pandami.svg";
import arrowUp from "../../../assets/icons/Arrow - Up 2.svg";
import arrowDown from "../../../assets/icons/Arrow - Down 2.svg";
import wallet_line from "../../../assets/icons/Wallet_line.svg";
import ModalPurchase from "../../../components/CloneShop/ModalPurchase";
import ModalConfirm from "../../../components/Withdraw/ModalConfirm";
import ModalConfirmMobile from "../../../components/Withdraw/mobile/ModalConfirmMobile";

function Withdrawal() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const { user } = useContext(MyAuthContext);
  const [isDisabled, setIsDisabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [letterWidth, setLetterWidth] = useState(0);
  const [address, setAddress] = useState("");
  const [coinList, setCoinList] = useState<CoinInfo[]>([]);
  const [options, SetOptions] = useState<OptionInfo[]>([]);
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [balanceMethod, setBalanceMethod] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const [pgaPrice, setPgaPrice] = useState(0);
  const [isLoadingPga, setIsLoadingPga] = useState(true);
  const [coinAmount, setCoinAmount] = useState(0);
  const [selCoin, setSelCoin] = useState<CoinInfo>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [minWithdrawal, setMinWithdrawal] = useState(false);
  useEffect(() => {
    if (inputRef.current) {
      const span = document.createElement("span");
      span.textContent = "a";
      span.style.position = "absolute";
      span.style.visibility = "hidden";
      document.body.appendChild(span);
      const letterWidth = span.offsetWidth;
      document.body.removeChild(span);
      setLetterWidth(letterWidth);
    }

    handleGetCoinList();
  }, []);

  useEffect(() => {
    updatePrefixPosition();
    setFeeAmount(
      formatNumber(balanceMethod === 0 ? 0 : config.withdraw_fee, 2)
    );
    if (withdrawAmount) {
      if (parseFloat(withdrawAmount) < config.min_withdraw) {
        setMinWithdrawal(true);
      } else {
        setMinWithdrawal(false);
      }
      setReceiveAmount(
        formatNumber(
          parseFloat(withdrawAmount) -
            (balanceMethod === 0 ? 0 : config.withdraw_fee),
          2
        )
      );
    }
    const selCoinInfo = coinList.find((item) => item.id == paymentMethod);
    if (selCoinInfo) {
      setSelCoin(selCoinInfo);
      let coin_amount = 0;
      if (
        selCoinInfo.symbol === "PGA_BSC" ||
        selCoinInfo.symbol === "PGA_ETH"
      ) {
        coin_amount = Number(withdrawAmount);
      } else {
        coin_amount =
          (balanceMethod === 0
            ? Number(withdrawAmount) * pgaPrice
            : Number(withdrawAmount)) / Number(selCoinInfo.currency);
      }
      setCoinAmount(Math.round(coin_amount * 1000000) / 1000000);
    }
  }, [withdrawAmount, paymentMethod, balanceMethod, coinList]);

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setAddress(inputValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const parsedValue = parseFloat(inputValue);

    // Get the maximum allowed value (replace 1000 with your desired maximum value)
    const maxValue = formatNumber(parseFloat(user.balance), 4);

    // Check if the parsedValue is a valid number
    if (!isNaN(parsedValue)) {
      // If the parsedValue exceeds the maximum value, set it to the maximum value
      const valueToSet =
        parsedValue > parseFloat(maxValue) ? parseFloat(maxValue) : parsedValue;

      // Update the state with the value
      setWithdrawAmount(valueToSet.toString());
      setFeeAmount(
        formatNumber(balanceMethod === 0 ? 0 : config.withdraw_fee, 2)
      );
      setReceiveAmount(
        formatNumber(
          valueToSet - (balanceMethod === 0 ? 0 : config.withdraw_fee),
          2
        )
      );
      setIsDisabled(false);
    } else {
      // If the parsedValue is not a valid number (e.g., empty input or invalid characters), update the state with the original input value
      setWithdrawAmount(inputValue);
      setFeeAmount("");
      setReceiveAmount("");
      setIsDisabled(true);
    }
  };

  const updatePrefixPosition = () => {
    if (inputRef.current) {
      const inputWidth = withdrawAmount.length * (letterWidth - 1);
      inputRef.current.style.paddingRight = inputWidth + "px";
    }
  };

  const selAmount = (amount: string) => {
    setWithdrawAmount(amount);
    setFeeAmount(
      formatNumber(balanceMethod === 0 ? 0 : config.withdraw_fee, 2)
    );
    setReceiveAmount(
      formatNumber(
        parseFloat(amount) - (balanceMethod === 0 ? 0 : config.withdraw_fee),
        2
      )
    );
    setIsDisabled(false);
  };

  const formatNumber = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };

  const handleSelectPayMethod = (selectOption: any) => {
    setPaymentMethod(selectOption.value);
  };
  const onClose = () => {
    setShowConfirmModal(false);
  };
  const onConfirm = () => {
    setIsLoading(true);
    api
      .post(`payment/${user.user_id}/withdraw/request/`, {
        balance_method: balanceMethod,
        amount: withdrawAmount,
        currency: paymentMethod,
        address: address,
        coin_amount: formatNumber(coinAmount, 6),
      })
      .then((res: any) => {
        const data = res.data;
        if (data.type === "success") {
          toast.success("Withdrawal request has been sent successfully.");
        } else if (data.type === "failed") {
          toast.error(data.detail);
        } else {
          toast.error("One withdrawal request is still pending to process.");
        }
        setIsLoading(false);
        setShowConfirmModal(false);
        setMinWithdrawal(false);
        setSelCoin(undefined);
        setAddress("");
        setReceiveAmount("");
        setWithdrawAmount("");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast.error(
          "Duplicated of request. You can only request withdraw at once."
        );
      });
  };
  const handleGetCoinList = () => {
    api
      .get(`base/currency/`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          // data.map
          if (isMobile) {
            const transformedMobileData: OptionInfo[] = data.map(
              (item: any) => {
                return {
                  value: item.id,
                  label: (
                    <div className="flex w-full items-center" key={item.id}>
                      <div className="w-2/5 text-left flex items-center">
                        <img src={item.icon} className="h-6 w-6 mr-2" />
                        <label className="block text-sm font-bold">
                          {item.name}
                        </label>
                      </div>
                      <div className="w-3/5 text-right">
                        <label className="text-sm">$---/{item.unit}</label>
                      </div>
                    </div>
                  ),
                };
              }
            );
            SetOptions(transformedMobileData);
          }
          const transformedData: CoinInfo[] = data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              icon: item.icon,
              symbol: item.symbol,
              unit: item.unit,
              currency: "---",
            };
          });
          fetchCoinData(transformedData);
          setCoinList(transformedData);
        }
        // notice
      })
      .catch((err) => {
        console.log("get seed data error", err);
      });
  };
  const fetchCoinData = async (coinInfo: CoinInfo[]) => {
    try {
      if (coinInfo && coinInfo.length > 0) {
        const ids = coinInfo.map((coin) => coin.symbol.toLowerCase()).join(",");
        api
          .get(`https://v1.pandagrownswap.io/pga_price`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(async (res: any) => {
            console.log(res);
            const prices = res.data;
            // notice
            const price =
              parseFloat(prices.BNB) > parseFloat(prices.ETH)
                ? parseFloat(prices.ETH)
                : parseFloat(prices.BNB);
            setPgaPrice(price);

            await api
              .get(config.api.COIN_PRICE_URL, {
                headers: {
                  "Content-Type": "application/json",
                },
                params: {
                  ids: ids, // Replace with the coins you want to get data for
                  vs_currencies: "usd", // Replace with the currency you want to get data in (e.g., 'usd', 'eur', etc.)
                  // apiKey: apiKey,
                },
              })
              .then((res) => {
                let currencyData = res.data;
                currencyData = {
                  ...currencyData,
                  pga_bsc: { usd: parseFloat(prices.BNB) },
                  pga_eth: { usd: parseFloat(prices.ETH) },
                };
                // return;
                const updatedCoinList = coinInfo.map((item) => {
                  if (currencyData[item.symbol.toLowerCase()] !== undefined) {
                    return {
                      ...item,
                      currency: currencyData[item.symbol.toLowerCase()].usd,
                    };
                  }
                  return item;
                });

                setCoinList(updatedCoinList);
                if (isMobile) {
                  const transformedMobileData: OptionInfo[] =
                    updatedCoinList.map((item: any) => {
                      return {
                        value: item.id,
                        label: (
                          <div
                            className="flex w-full items-center"
                            key={item.id}
                          >
                            <div className="w-2/5 text-left flex items-center">
                              <img src={item.icon} className="h-6 w-6 mr-2" />
                              <label className="block text-sm font-bold">
                                {item.name}
                              </label>
                            </div>
                            <div className="w-3/5 text-right">
                              <label className="text-sm">
                                ${item.currency}/{item.unit}
                              </label>
                            </div>
                          </div>
                        ),
                      };
                    });
                  SetOptions(transformedMobileData);
                }
              })
              .catch((err) => {
                console.error("Error fetching coin data:", err);
              });
          })
          .catch((err) => {});
      }
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  const handleConfirm = () => {
    if (!minWithdrawal) {
      setShowConfirmModal(true);
    }
  };

  if (isMobile) {
    return (
      <div className="pt-2 pb-4 px-4">
        <div className="w-full bg-white rounded">
          <div className="w-full py-3 px-5 border-b border-black/10">
            <label className="text-base font-bold">Fund Withdrawal</label>
          </div>
          <div className="w-full py-3 px-5">
            <div className="pt-1 pb-2">
              <label className="text-base font-bold">Available Balance</label>
              {balanceMethod === 0 ? (
                <button
                  style={{
                    border: "1px solid #f6f6f6",
                    backgroundColor: "#f6f6f6",
                  }}
                  className="w-full flex py-3 mt-3 px-5 text-base items-center rounded text-left"
                  onClick={() => setIsMethodOpen(!isMethodOpen)}
                >
                  <span className="font-bold text-md">
                    PGA {formatNumber(parseFloat(user.pga_balance), 4)}{" "}
                  </span>
                  <span
                    className="font-bold text-xs text-white ml-3 rounded-5 px-2 py-0"
                    style={{ backgroundColor: "#059033" }}
                  >
                    No Fee
                  </span>
                  <img
                    className="ml-auto"
                    src={isMethodOpen ? arrowUp : arrowDown}
                  />
                </button>
              ) : (
                <button
                  style={{
                    border: "1px solid #f6f6f6",
                    backgroundColor: "#f6f6f6",
                  }}
                  className="w-full flex py-3 mt-3 px-5 text-base items-center rounded text-left"
                  onClick={() => setIsMethodOpen(!isMethodOpen)}
                >
                  <span className="font-bold text-md">
                    USD {formatNumber(parseFloat(user.balance), 4)}
                  </span>
                  <img
                    className="ml-auto"
                    src={isMethodOpen ? arrowUp : arrowDown}
                  />
                </button>
              )}
              {isMethodOpen ? (
                <>
                  <div
                    className={"flex flex-col absolute z-50 w-full"}
                    style={{ backgroundColor: "rgb(246, 246, 246)" }}
                  >
                    <button
                      className="w-full flex py-3 px-5 text-base items-center rounded"
                      onClick={() => {
                        setBalanceMethod(1);
                        setIsMethodOpen(false);
                      }}
                    >
                      <img src={wallet_line} className="h-8 pr-3" alt="USD" />
                      <span className="w-1/3 font-bold text-left">
                        USD {formatNumber(parseFloat(user.balance), 4)}
                      </span>
                      <span className="w-2/3 text-right"></span>
                    </button>
                    <button
                      className="w-full flex py-3 px-5 text-base items-center rounded"
                      onClick={() => {
                        setBalanceMethod(0);
                        setIsMethodOpen(false);
                      }}
                    >
                      <img src={panda} className="h-8 pr-3" alt="PGA" />
                      <span className="font-bold text-left">
                        PGA {formatNumber(parseFloat(user.pga_balance), 4)}
                      </span>
                      <span
                        className="font-bold text-xs text-white ml-3 rounded-5 px-2 py-0"
                        style={{ backgroundColor: "#059033" }}
                      >
                        No Fee
                      </span>
                    </button>
                  </div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMethodOpen(!isMethodOpen)}
                  ></div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="pt-1 pb-2">
              <div className="w-full relative text-base pt-2">
                <input
                  type="number"
                  className="text-left pl-3"
                  style={{ height: "52px" }}
                  onChange={handleInputChange}
                  value={withdrawAmount}
                  max={formatNumber(parseFloat(user.balance), 4)}
                  min={0}
                  placeholder={balanceMethod === 0 ? "PGA" : "USD"}
                />
              </div>
            </div>
            <div className="w-full flex mt-3">
              <div className="text-right text-red-600">
                <label>
                  Fee: {balanceMethod === 0 ? "No Fee" : "USD " + feeAmount}
                </label>
              </div>
            </div>
            <div className="w-full flex mt-3 pb-4 border-b border-black/10">
              <div className="w-4/5 text-left font-bold">
                <label>Amount will be received</label>
              </div>
              <div className="w-1/5 text-right font-bold">
                <label>
                  {balanceMethod === 0 ? "PGA" : "USD"} {receiveAmount}
                </label>
              </div>
            </div>
            <div className="w-full pt-4 pb-2">
              <div className="mb-5">
                <div className="">
                  <label className="text-base font-bold">Select Currency</label>
                </div>
                <div className="">
                  <Select
                    className="mt-1 bg-black rounded"
                    defaultValue={options[0]}
                    options={options}
                    isSearchable={false}
                    onChange={handleSelectPayMethod}
                  />
                </div>
              </div>
            </div>
            <div className="pt-1 pb-3">
              <label className="text-base font-bold">Withdrawal Address</label>
              <div className="w-full relative text-base pt-2">
                <input
                  type="text"
                  className="text-left"
                  style={{ height: "52px" }}
                  placeholder=""
                  value={address}
                  onChange={handleChangeAddress}
                />
              </div>
              {paymentMethod > 0 && receiveAmount && !minWithdrawal ? (
                <span className="flex w-full text-xs mt-1items-center justify-end pb-0 mt-1 text-black/50">
                  You will get almost {coinAmount || ""} {selCoin?.unit}
                </span>
              ) : minWithdrawal ? (
                <span className={"text-red-600"}>
                  Minimal withdrawal amount is 50 USD
                </span>
              ) : (
                <></>
              )}
            </div>
            <ModalConfirmMobile
              address={address}
              coin={selCoin}
              fee={feeAmount}
              amount={coinAmount}
              isOpen={showConfirmModal}
              onClose={onClose}
              onConfirm={onConfirm}
              isLoading={isLoading}
            />
            <ButtonWithSpinner
              isDisabled={
                isDisabled ||
                paymentMethod == 0 ||
                address == "" ||
                minWithdrawal
              }
              isLoading={isLoading}
              isMobile={isMobile}
              onConfirm={handleConfirm}
            >
              Withdrawal
            </ButtonWithSpinner>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isTablet ? <></> : <SidebarWallet />}
      <div className={`${isTablet ? "!ml-0" : ""} page-content relative pb-8`}>
        <div className="w-full pt-12">
          <label className="text-4xl font-bold">Withdrawal</label>
          <div className="w-full mt-8 pt-2 bg-white rounded">
            <div className="border-b border-black/10 px-7 py-2">
              <label className="text-xl font-bold">Fund Withdrawal</label>
            </div>
            <Scrollbars
              className=""
              style={{ width: "100%", height: "calc(100vh - 269px)" }}
            >
              <div className="py-5 pl-6 pr-9 border-b border-black/10">
                <div className="flex w-full items-center pb-4">
                  <div className="w-1/3 ">
                    <label className="block font-bold">Available Balance</label>
                  </div>
                  <div className="w-2/3">
                    <div className="relative w-full">
                      {balanceMethod === 0 ? (
                        <button
                          style={{
                            border: "1px solid #f6f6f6",
                            backgroundColor: "#f6f6f6",
                          }}
                          className="w-full flex py-3 mt-3 px-5 text-base items-center rounded text-left"
                          onClick={() => setIsMethodOpen(!isMethodOpen)}
                        >
                          <span className="font-bold text-md">
                            PGA {formatNumber(parseFloat(user.pga_balance), 4)}{" "}
                          </span>
                          <span
                            className="font-bold text-xs text-white ml-3 rounded-5 px-2 py-0"
                            style={{ backgroundColor: "#059033" }}
                          >
                            No Fee
                          </span>
                          <img
                            className="ml-auto"
                            src={isMethodOpen ? arrowUp : arrowDown}
                          />
                        </button>
                      ) : (
                        <button
                          style={{
                            border: "1px solid #f6f6f6",
                            backgroundColor: "#f6f6f6",
                          }}
                          className="w-full flex py-3 mt-3 px-5 text-base items-center rounded text-left"
                          onClick={() => setIsMethodOpen(!isMethodOpen)}
                        >
                          <span className="font-bold text-md">
                            USD {formatNumber(parseFloat(user.balance), 4)}
                          </span>
                          <img
                            className="ml-auto"
                            src={isMethodOpen ? arrowUp : arrowDown}
                          />
                        </button>
                      )}
                      {isMethodOpen ? (
                        <>
                          <div
                            className={"flex flex-col absolute z-50 w-full"}
                            style={{ backgroundColor: "rgb(246, 246, 246)" }}
                          >
                            <button
                              className="w-full flex py-3 px-5 text-base items-center rounded"
                              onClick={() => {
                                setBalanceMethod(1);
                                setIsMethodOpen(false);
                              }}
                            >
                              <img
                                src={wallet_line}
                                className="h-8 pr-3"
                                alt="USD"
                              />
                              <span className="w-1/3 font-bold text-left">
                                USD {formatNumber(parseFloat(user.balance), 4)}
                              </span>
                              <span className="w-2/3 text-right"></span>
                            </button>
                            <button
                              className="w-full flex py-3 px-5 text-base items-center rounded"
                              onClick={() => {
                                setBalanceMethod(0);
                                setIsMethodOpen(false);
                              }}
                            >
                              <img src={panda} className="h-8 pr-3" alt="PGA" />
                              <span className="font-bold text-left">
                                PGA{" "}
                                {formatNumber(parseFloat(user.pga_balance), 4)}
                              </span>
                              <span
                                className="font-bold text-xs text-white ml-3 rounded-5 px-2 py-0"
                                style={{ backgroundColor: "#059033" }}
                              >
                                No Fee
                              </span>
                            </button>
                          </div>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsMethodOpen(!isMethodOpen)}
                          ></div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center pb-4 relative mb-10">
                  <div className="w-1/3 ">
                    <label className="block font-bold">
                      Amount ({balanceMethod === 0 ? "PGA" : "USD"})
                    </label>
                    {/*<label>Select the amount of fund <br />you want to withdrawal. ({balanceMethod === 0 ? 'PGA' : 'USD'})</label>*/}
                  </div>
                  <div className="w-2/3">
                    <div className="relative w-full">
                      <div
                        ref={inputRef}
                        className="absolute top-3 left-4 text-base font-bold "
                        style={{
                          pointerEvents: "none",
                          paddingTop: "1px",
                        }}
                      ></div>
                      <input
                        type="number"
                        className="w-full h-12 py-1 rounded-md shadow-sm text-base text-left font-bold"
                        value={withdrawAmount}
                        onChange={handleInputChange}
                        placeholder={balanceMethod === 0 ? "PGA" : "USD"}
                        max={formatNumber(parseFloat(user.balance), 4)}
                        min={0}
                      />
                    </div>
                    {/*<div className="w-full mt-2">*/}
                    {/*  <ul className="grid grid-cols-4 gap-3 list-none">*/}
                    {/*    <li>*/}
                    {/*      <button*/}
                    {/*          className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"*/}
                    {/*          onClick={() => selAmount('100')}*/}
                    {/*          disabled={user.balance > 100 ? false : true}*/}
                    {/*      >*/}
                    {/*        {balanceMethod === 0 ? 'PGA' : 'USD'} 100*/}
                    {/*      </button>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*      <button*/}
                    {/*          className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"*/}
                    {/*          onClick={() => selAmount('200')}*/}
                    {/*          disabled={user.balance > 200 ? false : true}*/}
                    {/*      >*/}
                    {/*        {balanceMethod === 0 ? 'PGA' : 'USD'} 200*/}
                    {/*      </button>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*      <button*/}
                    {/*          className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"*/}
                    {/*          onClick={() => selAmount('300')}*/}
                    {/*          disabled={user.balance > 300 ? false : true}*/}
                    {/*      >*/}
                    {/*        {balanceMethod === 0 ? 'PGA' : 'USD'} 300*/}
                    {/*      </button>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*      <button*/}
                    {/*          className="w-full bg-gradient-to-b from-gray/10 to-gray/60 text-base font-bold items-center py-3 px-4 rounded text-center border border-black/10 hover:from-gray/40 hover:to-gray hover:border-black/20"*/}
                    {/*          onClick={() => selAmount('400')}*/}
                    {/*          disabled={user.balance > 400 ? false : true}*/}
                    {/*      >*/}
                    {/*        {balanceMethod === 0 ? 'PGA' : 'USD'} 400*/}
                    {/*      </button>*/}
                    {/*    </li>*/}
                    {/*  </ul>*/}
                    {/*</div>*/}
                  </div>
                  <span
                    className={
                      "font-bold text-red-600 absolute font-bold text-red-600 right-0"
                    }
                    style={{ bottom: "-15px" }}
                  >
                    Fee: {balanceMethod === 0 ? "No Fee" : "USD " + feeAmount}
                  </span>
                </div>
                {/*<div className="flex w-full items-center pb-4">*/}
                {/*  <div className="w-1/3 ">*/}
                {/*    <label className="block font-bold">Administration Fee</label>*/}
                {/*  </div>*/}
                {/*  <div className="w-2/3">*/}
                {/*    <div className="relative w-full">*/}
                {/*      <input*/}
                {/*          type="text"*/}
                {/*          className="w-full h-12 py-1 pr-6 rounded-md shadow-sm text-base text-left font-bold"*/}
                {/*          value={"$ " + feeAmount}*/}
                {/*          placeholder=""*/}
                {/*          disabled*/}
                {/*          readOnly*/}
                {/*      />*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                <div className="flex w-full items-center pb-4">
                  <div className="w-1/3">
                    <label className="block font-bold">
                      Total amount you will received
                    </label>
                  </div>
                  <div className="w-2/3">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="w-full h-12 py-1 pr-6 rounded-md shadow-sm text-base text-left font-bold"
                        value={
                          (balanceMethod === 0 ? "PGA " : "USD ") +
                          receiveAmount
                        }
                        onChange={handleInputChange}
                        placeholder=""
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mt-2 pb-6">
                  <div className="">
                    <label className="block font-bold mb-2">
                      Select Currency
                    </label>
                  </div>
                  <div className="">
                    <ul className="grid grid-cols-7 gap-3 list-none">
                      {coinList.map((item, index) => (
                        <li key={index}>
                          <button
                            className={`${
                              paymentMethod === item.id
                                ? "bg-gradient-to-b from-green/10 to-green/50 border-2 border-green/80"
                                : "bg-gradient-to-b from-gray/10 to-gray/60 border-black/10 hover:from-gray/30 hover:to-gray/80 hover:border-black/20"
                            } w-full py-5 px-4 rounded text-center border`}
                            onClick={() => setPaymentMethod(item.id)}
                          >
                            <div className="w-full flex justify-center text-base font-bold items-center">
                              <img src={item.icon} className="h-8 pr-2" />
                              {item.name}
                            </div>
                            <div className="text-sm pt-4">
                              <label className="block text-center">
                                Price per {item.unit}
                              </label>
                              <label className="block font-bold text-center">
                                ${item.currency}
                              </label>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex w-full items-center pb-6">
                  <div className="w-1/3 ">
                    <label className="block font-bold">Withdraw Address</label>
                  </div>
                  <div className="w-2/3">
                    <input
                      type="text"
                      className="w-full h-12 py-1 pr-6 rounded-md shadow-sm text-base text-left font-bold"
                      placeholder=""
                      value={address}
                      onChange={handleChangeAddress}
                    />
                  </div>
                </div>
                {paymentMethod > 0 && receiveAmount && !minWithdrawal ? (
                  <span className="flex w-full items-center justify-end pb-6 text-black/50">
                    You will get almost {coinAmount || ""} {selCoin?.unit}
                  </span>
                ) : minWithdrawal ? (
                  <span
                    className={
                      "flex w-full items-center justify-end pb-6 text-red-600"
                    }
                  >
                    *Minimal withdrawal amount is 50 USD
                  </span>
                ) : (
                  <></>
                )}

                <div className="w-full text-right">
                  <ButtonWithSpinner
                    isDisabled={
                      isDisabled ||
                      paymentMethod === 0 ||
                      address === "" ||
                      minWithdrawal
                    }
                    isLoading={isLoading}
                    isMobile={isMobile}
                    onConfirm={handleConfirm}
                  >
                    Withdraw
                  </ButtonWithSpinner>
                </div>
              </div>
            </Scrollbars>
            <ModalConfirm
              address={address}
              coin={selCoin}
              fee={feeAmount}
              amount={coinAmount}
              isOpen={showConfirmModal}
              onClose={onClose}
              onConfirm={onConfirm}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}

interface ButtonWithSpinnerProps {
  isDisabled: boolean;
  isLoading: boolean;
  isMobile: boolean;
  onConfirm: () => void;
  children: React.ReactNode;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isDisabled,
  isLoading,
  isMobile,
  onConfirm,
  children,
}) => {
  return (
    <button
      disabled={isDisabled || isLoading}
      className={`${!isDisabled ? "btn-green !bg-green" : "btn-gray"} ${
        isMobile ? "w-full" : "w-1/4"
      }  text-white text-base font-bold items-center mt-2 mx-auto py-5 px-4 rounded-5`}
      onClick={onConfirm}
    >
      {isLoading ? <FaSpinner className="spinner m-auto text-xl" /> : children}
    </button>
  );
};

export default Withdrawal;
