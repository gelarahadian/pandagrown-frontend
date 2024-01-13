import { useContext } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";
import { Scrollbars } from "rc-scrollbars";
// import avatarImg from 'assets/images/sample-avatar.jpg';
// import { MdSettings } from "react-icons/md";
import {
  FaAngleLeft,
  FaFolderMinus,
  FaListAlt,
  FaMapMarkerAlt,
  FaWallet,
} from "react-icons/fa";
import { MdNoteAdd, MdDescription } from "react-icons/md";
import document from "assets/icons/Document.svg";
import wallet from "assets/icons/Wallet.svg";
import MobileFloatButton from "components/common/MobileFloatButton";
import SidebarBottom from "../../common/SidebarBottom";

interface TabletSidebarWalletProps {
  onHideSidebar: () => void;
}

const TabletSidebarWallet: React.FC<TabletSidebarWalletProps> = (props) => {
  const { onHideSidebar } = props;
  const { user } = useContext(MyAuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="sidebar-mobile fixed w-full z-30 top-0 left-0">
      <div className="menubar relative z-50 bg-[#041D04] text-white pt-24 px-8">
        <div className="w-full flex">
          <div className="w-4/5 user-info flex items-center">
            <NavLink to="/account">
              <img
                src={user?.profile_avatar}
                className="user-avatar h-10 w-10 mx-4"
              />
            </NavLink>
            <div>
              <span className="text-xl block font-bold name">
                {user?.username}
              </span>
              <div className="flex items-center pt-1">
                <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                <span className="text-sm location">
                  {user?.profile_country === "null" ? "" : user.profile_country}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute top-8 left-8 text-white text-right cursor-pointer">
            <FaAngleLeft className="w-6 h-6" onClick={onHideSidebar} />
          </div>
        </div>
        <div className="mt-8 mb-11">
          <MyWallet />
        </div>
        <div className="ml-5 pb-8">
          <NavLink
            to="/dashboard/settings/deposit"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <FaFolderMinus size={20} className="mr-4 my-auto" />
            <span>Deposit</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings/withdrawal"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            {/*<img src={wallet} className="mr-4 my-auto" />*/}
            <FaWallet size={20} className="mr-4 my-auto" />
            <span>Withdrawal</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings/history"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            {/*<img src={document} className="mr-4 my-auto" />*/}
            <FaListAlt size={20} className="mr-4 my-auto" />
            <span>Transaction History</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings/support"
            className={`${
              currentPath == "/ticket" ? "active" : ""
            } text-md mt-6 flex`}
            onClick={onHideSidebar}
          >
            <MdNoteAdd size={20} className="mr-4 my-auto" />
            <span>Support</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings/myticket"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <MdDescription size={20} className="mr-4 my-auto" />
            <span>My Ticket</span>
          </NavLink>
          {/* <NavLink to="/" className="text-xl mt-6 flex" onClick={onHideSidebar}>
                    <MdSettings size={20} className="mr-4 my-auto" />
                    <span>Wallet Settings</span>
                </NavLink> */}
        </div>
        <SidebarBottom />
      </div>
      <div
        className="opacity-50 fixed inset-0 z-40 bg-black"
        onClick={onHideSidebar}
      ></div>
    </div>
  );
};

export default TabletSidebarWallet;
