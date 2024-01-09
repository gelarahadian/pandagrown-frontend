import React, { useState } from "react";
import { HistoryItem } from "pages/Dashboard/Settings/History";
import { config } from "config";
import { MdContentCopy } from "react-icons/md";
import panda from "assets/icons/pandami.svg";
import coinbase from "assets/icons/Coinbase.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "@mui/material";
import { SiBlockchaindotcom, SiHiveBlockchain } from "react-icons/si";
import { GoLink } from "react-icons/go";
import { useTabletContext } from "../../context/TabletContext";
import { formatNumber } from "../../utils/common";

interface DataTableProps {
  data: HistoryItem[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isTablet = useTabletContext();
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

  const copyToClipboard = (address: string) => {
    navigator.clipboard
      .writeText(address)
      .then(() => setIsCopied(true))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const cutStringToFixedLength = (str: string, length: number): string => {
    if (str.length > length) {
      return str.slice(0, length) + "...";
    } else {
      return str;
    }
  };

  const formatNumber = (price: number, fixed_count: number): string => {
    let formattedPrice = price.toFixed(fixed_count);
    const parsedPrice = Number.parseFloat(formattedPrice);
    return parsedPrice.toString();
  };
  // const handleMouseEnter = (addr: string) => {
  //   navigator.clipboard.readText()
  //   .then((text) => {
  //     // 'text' contains the string content from the clipboard
  //     console.log('Clipboard text:', text);
  //     if(text == addr) {
  //       setIsCopied(true);
  //     } else {
  //       setIsCopied(false);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Failed to read clipboard text:', error);
  //   });
  // }

  const handleMouseLeave = () => {
    setIsCopied(false);
  };

  return (
    <div className="w-full">
      {isTablet ? (
        data.length > 0 ? (
          data.map((item, index) => (
            <div className="px-5 py-2 odd:bg-black/10" key={index}>
              <div className="flex w-full">
                <div className="w-3/4 text-left truncate">{item.date}</div>
                <div className="flex justify-end w-1/4 text-right truncate">
                  <img
                    src={
                      item.method == "0"
                        ? panda
                        : item.method == "1"
                        ? coinbase
                        : config.api.API_URL + "images/" + item.method_icon
                    }
                    className="h-6 w-6 mr-2"
                  />
                  <span className="block pl-2">
                    {item.method == "0"
                      ? "PGA"
                      : item.method == "1"
                      ? "COINBASE"
                      : item.unit}
                  </span>
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
                <div className="w-1/2 text-left truncate">
                  {item.method == "1"
                    ? "$ " + item.amount
                    : item.method == "0"
                    ? formatNumber(item.coin_amount, 6) + " PGA"
                    : formatNumber(item.coin_amount, 6) + " " + item.unit}
                </div>
                <div className="w-1/2 text-left truncate">
                  {cutStringToFixedLength(item.tx_hash || "", 30)}
                  {item.tx_hash ? (
                    <>
                      <button
                        className=""
                        onClick={() => window.open(item.tx_hash, "_blank")}
                      >
                        <GoLink />
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <tr className="h-12 bg-red-600/10">
            <td className="w-full text-center">There are no transactions</td>
          </tr>
        )
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr className="h-12 odd:bg-black/10" key={index}>
                  <td className="pl-7" style={{ width: "16%" }}>
                    {item.date}
                  </td>
                  <td
                    className={`${item.type == 2 ? "text-red-500" : ""}`}
                    style={{ width: "16%" }}
                  >
                    {getTypeName(item.type)}
                  </td>
                  <td className="flex items-center h-12">
                    <img
                      src={
                        item.method == "0"
                          ? panda
                          : item.method == "1"
                          ? coinbase
                          : config.api.API_URL + "images/" + item.method_icon
                      }
                      className="h-6 object-contain"
                    />
                    <span className="block pl-2">
                      {item.method == "0"
                        ? "PGA TOKEN"
                        : item.method == "1"
                        ? "COINBASE PAY"
                        : item.unit}
                    </span>
                  </td>
                  <td className="pl-2 text-center">
                    {item.method == "1"
                      ? "$ " + item.amount
                      : item.method == "0"
                      ? formatNumber(item.coin_amount, 6) + " PGA"
                      : formatNumber(item.coin_amount, 6) + " " + item.unit}
                  </td>
                  <td className="pr-10" style={{ width: "20%" }}>
                    {item.method == "1" ? (
                      ""
                    ) : (
                      <>
                        {cutStringToFixedLength(item.address || "", 15)}
                        <button
                          className=""
                          onClick={() => copyToClipboard(item.address)}
                          onMouseLeave={handleMouseLeave}
                          data-tooltip={`${isCopied ? "Copied!" : ""}`}
                        >
                          <MdContentCopy className="h-4 w-h ml-2" />
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    {cutStringToFixedLength(item.tx_hash || "", 20)}
                    {item.tx_hash ? (
                      <>
                        <button
                          className=""
                          onClick={() => window.open(item.tx_hash, "_blank")}
                        >
                          <GoLink />
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-12 bg-red-600/10">
                <td className="w-full text-center">
                  There are no transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTable;
