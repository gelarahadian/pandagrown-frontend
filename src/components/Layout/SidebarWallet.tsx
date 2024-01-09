import { useContext } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";

// import avatarImg from 'assets/images/sample-avatar.jpg';
// import { MdSettings } from "react-icons/md";
import {
  FaDocker,
  FaFolderMinus,
  FaGoogleWallet,
  FaListAlt,
  FaMapMarkerAlt,
  FaWallet,
} from "react-icons/fa";
import { MdNoteAdd, MdDescription } from "react-icons/md";
import document from "assets/icons/Document.svg";
import wallet from "assets/icons/Wallet.svg";
import SidebarBottom from "../common/SidebarBottom";

function SidebarWallet() {
  const { user } = useContext(MyAuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="sidebar p-9 float-left relative bg-[#041D04] text-white pt-24 px-8">
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
        <MyWallet />
      </div>
      <hr className="color-gray mb-10" />
      <div className="ml-5">
        <NavLink to="/dashboard/settings/deposit" className="text-xl mt-6 flex">
          <FaFolderMinus size={20} className="mr-4 my-auto" />
          <span>Deposit</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings/withdrawal"
          className="text-xl mt-6 flex"
        >
          {/*<img src={wallet} className="mr-4 my-auto" />*/}
          <FaWallet size={20} className="mr-4 my-auto" />
          <span>Withdrawal</span>
        </NavLink>
        <NavLink to="/dashboard/settings/history" className="text-xl mt-6 flex">
          {/*<img src={document} className="mr-4 my-auto" />*/}
          <FaListAlt size={20} className="mr-4 my-auto" />
          <span>Transaction History</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings/support"
          className={`${
            currentPath == "/ticket" ? "active" : ""
          } text-xl mt-6 flex`}
        >
          <MdNoteAdd size={20} className="mr-4 my-auto" />
          <span>Support</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings/myticket"
          className="text-xl mt-6 flex"
        >
          <MdDescription size={20} className="mr-4 my-auto" />
          <span>My Ticket</span>
        </NavLink>
        {/* <NavLink to="/" className="text-xl mt-6 flex">
          <MdSettings size={20} className="mr-4 my-auto" />
          <span>Wallet Settings</span>
        </NavLink> */}
      </div>
      <SidebarBottom />
    </div>
  );
}

export default SidebarWallet;
