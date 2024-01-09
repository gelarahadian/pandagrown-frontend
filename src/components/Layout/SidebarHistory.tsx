import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import api from "utils/api";
import { toast } from "react-toastify";
import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";
import { MdContentCopy } from "react-icons/md";
// import avatarImg from 'assets/images/sample-avatar.jpg';
// import { MdSettings } from "react-icons/md";
import { FaFolderMinus, FaMapMarkerAlt } from "react-icons/fa";
import { MdNoteAdd, MdDescription } from "react-icons/md";
import document from "assets/icons/Document.svg";
import wallet from "assets/icons/Wallet.svg";

interface SidebarHistoryProps {
  usd_balance: string;
  invest_fund: string;
  total_profit: string;
}

function SidebarHistory(props: SidebarHistoryProps) {
  const { user } = useContext(MyAuthContext);
  const location = useLocation();
  const currentPath = location.pathname;
  const { usd_balance, invest_fund, total_profit } = props;
  const [referralLink, setReferralLink] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        toast.success("Referral Link Copied.");
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  useEffect(() => {
    setTimeout(() => {
      getReferralLink();
    }, 100);
  }, []);

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

  return (
    <div className="sidebar p-9 float-left bg-[#041D04] text-white pt-24 px-8">
      <div className="user-info pl-1 flex items-center">
        <NavLink to="/dashboard/profile/account">
          <img src={user?.profile_avatar} className="user-avatar mx-4" />
        </NavLink>
        <div>
          <span className="text-xl block font-bold name">{user?.username}</span>
          <div className="flex items-center pt-1">
            <FaMapMarkerAlt className="w-4 h-4 mr-1" />
            <span className="text-sm location">
              {user?.profile_country === "null" ? "" : user.profile_country}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-8 mb-11">
        <div className="pt-7 pl-7 pr-7 mb-10 h-40 bg-black/10 rounded">
          <label className="text-xl font-bold">Referral Link</label>
          <div className="flex items-center h-14 mt-3.5 bg-white border border-stone-300 rounded">
            <span className="w-full pl-3.5 pr-2 text-lg truncate">
              {referralLink}
            </span>
            <MdContentCopy
              className="w-6 h-6 mr-4 text-lime-700 cursor-pointer"
              onClick={copyToClipboard}
            />
          </div>
        </div>
      </div>
      <hr className="color-gray mb-10" />
      <label className="text-sm font-bold">Available balance</label>
      <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-white/10 rounded">
        <span className="w-1/3 font-bold text-left">USD</span>
        <span className="w-2/3 text-right">{usd_balance}</span>
      </button>
      <label className="text-sm font-bold">Fund in progress</label>
      <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-white/10 rounded">
        <span className="w-1/3 font-bold text-left">USD</span>
        <span className="w-2/3 text-right">{invest_fund}</span>
      </button>
      <label className="text-sm font-bold">Return on investment</label>
      <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-white/10 rounded">
        <span className="w-1/3 font-bold text-left">USD</span>
        <span className="w-2/3 text-right">{total_profit}</span>
      </button>
    </div>
  );
}

export default SidebarHistory;
