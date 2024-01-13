import { useContext } from "react";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";
import { Scrollbars } from "rc-scrollbars";
// import avatarImg from 'assets/images/sample-avatar.jpg';
import { MdHomeFilled, MdInventory, MdWarehouse } from "react-icons/md";
import {
  FaShoppingCart,
  FaClock,
  FaMapMarkerAlt,
  FaAngleLeft,
} from "react-icons/fa";
import MobileFloatButton from "components/common/MobileFloatButton";
import SidebarBottom from "../../common/SidebarBottom";
import { RiP2PFill } from "react-icons/ri";
import { IoStorefront } from "react-icons/io5";

interface MobileSidebarProps {
  onHideSidebar: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = (props) => {
  const { onHideSidebar } = props;
  const { user } = useContext(MyAuthContext);

  return (
    <div className="sidebar-mobile fixed z-30 w-full top-0 left-0">
      <div className="menubar relative overflow-y-scroll relative z-50 bg-[#041D04] text-white pt-24 px-8 ">
        <div className="w-full flex">
          <div className="w-4/5 user-info flex items-center">
            <NavLink to="/dashboard/profile/account">
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
        <div className="ml-5 mb-8">
          <NavLink
            to="/dashboard/manage/cloneshop"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <FaShoppingCart size={20} className="mr-4 my-auto" />
            <span>Clone Shop</span>
          </NavLink>
          <NavLink
            to="/dashboard/manage/market"
            className="text-xl mt-6 flex "
            onClick={onHideSidebar}
          >
            <IoStorefront size={20} className="mr-4 my-auto" />
            <span>Market</span>
          </NavLink>
          <NavLink
            to="/dashboard/manage/inventory"
            className="text-xl mt-6 flex "
            onClick={onHideSidebar}
          >
            <MdInventory size={20} className="mr-4 my-auto" />
            <span>Inverntory</span>
          </NavLink>
          <NavLink
            to="/dashboard/manage/p2p"
            className="text-xl mt-6 flex "
            onClick={onHideSidebar}
          >
            <RiP2PFill size={20} className="mr-4 my-auto" />
            <span>P2P</span>
          </NavLink>
          <NavLink
            to="/dashboard/manage/greenhouse"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <MdHomeFilled size={20} className="mr-4 my-auto" />
            <span>My Green house</span>
          </NavLink>
          <NavLink
            to="/dashboard/manage/warehouse"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <MdWarehouse size={20} className="mr-4 my-auto" />
            <span>Warehouse</span>
          </NavLink>
          <NavLink
            to="/dashboard/manage/sellorder"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <FaClock size={20} className="mr-4 my-auto" />
            <span>Sell Order</span>
          </NavLink>
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

export default MobileSidebar;
