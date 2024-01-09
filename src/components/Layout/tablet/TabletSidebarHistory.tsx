import { useContext } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "utils/api";
import { toast } from 'react-toastify';
import MyWallet from "components/common/MyWallet";
import panda from 'assets/icons/pandami.svg';
import { MyAuthContext } from "context/AuthContext";
import { MdContentCopy } from 'react-icons/md';
import { Scrollbars } from 'rc-scrollbars';
import { FaMapMarkerAlt, FaUser, FaUserPlus } from 'react-icons/fa';
import wallet from 'assets/icons/Wallet.svg';
import MobileFloatButton from "components/common/MobileFloatButton";

import arrowUp from 'assets/icons/Arrow - Up 2.svg';
import arrowDown from 'assets/icons/Arrow - Down 2.svg';


const TabletSidebarHistory = () => {
  const { user } = useContext(MyAuthContext);
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoading, setIsLoading] = useState(false);

  const [referralLink, setReferralLink] = useState('');
  
  const [usd_balance, setUsdBalance] = useState("-1");
  const [invest_fund, setInvestFund] = useState("-1");
  const [total_profit, setTotalProfit] = useState("-1");
  const [total_pga_purchased, setTotalPgaPurchased] = useState("-1");
  const [total_pga_deposit, setTotalPgaDeposit] = useState("-1");
  const [total_pga_withdraw, setTotalPgaWithdraw] = useState("-1");
  const [referral_earning, setReferralEarning] = useState("-1");

  const [isOpen, setIsOpen] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success('Referral Link Copied.');
      })
      .catch((err) => console.error('Failed to copy: ', err));
  }
  const getReferralLink = () => {
    api.get(`user/${user.user_id}/referr/link/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && data.type == "success") {
          setReferralLink(data.link);
        }
    })
    .catch(err => {
        console.log(err);
    });
  }
  useEffect(() => {

    setTimeout(() => {
        getReferralLink();
        api.get(`user/${user.user_id}/report/`, {
          headers: {
              'Content-Type': 'application/json',
          },
        })
        .then((res: any) => {
          const data = res.data;
          if(data.type === 'success') {
            const res = data.data;
            setReportData(res);
          }
          setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        });
        }, 100);
  }, []);

  const setReportData = (data : any) => {
    setUsdBalance(data.usd_balance);
    setInvestFund(data.invest_fund);
    setTotalProfit(data.total_profit);
    setTotalPgaPurchased(data.total_pga_purchased);
    setTotalPgaDeposit(data.total_pga_deposit);
    setTotalPgaWithdraw(data.total_pga_withdraw);
  }

  return (
        <div className="w-full h-full bg-translate pr-10">
            {/* <div className="w-full flex">
                <div className="w-4/5 user-info flex items-center">
                    <NavLink to="/account">
                    <img src={user?.profile_avatar} className="border border-black/10 rounded-full user-avatar h-10 w-10 mr-4" />
                    </NavLink>
                    <div style={{ width:"calc(100% - 66px)" }}>
                        <span className="text-lg block font-bold name truncate">{user?.username}</span>
                        <div className="flex items-center pt-1">
                            <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                            <span className="text-sm location">{ user?.profile_country === "null" ? '' : user.profile_country }</span>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="mt-6">
                <div className="p-7 bg-black/10 rounded">
                    <label className="text-xl font-bold">Referral Link</label>
                    <div className="flex items-center h-14 bg-white border border-stone-300 rounded">
                        <span className="w-full pl-3.5 pr-2 text-lg truncate">{referralLink}</span>
                        <MdContentCopy className="w-6 h-6 mr-4 text-lime-700 cursor-pointer" onClick={copyToClipboard}/>
                    </div>
                </div>
            </div>
            <button className="w-full flex py-3 px-5 mt-6 text-base items-center bg-white rounded" onClick={()=>setIsOpen(!isOpen)}>
                <span className="font-bold text-xl">PGA Token Report</span>
                <img className="ml-auto" src={isOpen ? arrowUp : arrowDown} />
            </button>
            {
                isOpen ? 
                <>
                <div className="w-80 flex flex-col absolute z-50 pr-10">
                    <div className="w-full rounded-b border-t border-stone-400 bg-white pt-6 pr-3 pl-3 pb-3">
                        {/*<label className="text-sm font-bold">Cryptocurrency</label>*/}
                        <div className="flex mt-2 mb-10 px-5 py-3 w-full items-center bg-black/10 rounded text-sm font-bold"><img src={panda} className="h-8 pr-3" alt="Coinbase" /><div className="truncate"><label className="block text-sm truncate">Pandanami</label></div></div>
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
                        <label className="text-sm font-bold">Referral Earnings</label>
                        <button className="w-full flex py-3 px-5 mt-1 mb-3 text-base items-center bg-black/10 rounded">
                            <span className="w-1/3 font-bold text-left">PGA</span>
                            <span className="w-2/3 text-right">{referral_earning}</span>
                        </button>
                    </div>                    
                </div>
                <div className="fixed inset-0 z-40" onClick={()=>setIsOpen(!isOpen)}></div>
                </>
                : <></>
            }

            <div className="p-3 tabletsidebar-data mt-3 bg-white rounded-t">
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
        </div>
  )
}

export default TabletSidebarHistory;