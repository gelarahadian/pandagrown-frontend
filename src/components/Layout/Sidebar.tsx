import { useContext } from "react";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";

// import avatarImg from 'assets/images/sample-avatar.jpg';
import { MdHomeFilled, MdInventory, MdWarehouse } from "react-icons/md";
import { FaShoppingCart, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { IoStorefront } from "react-icons/io5";
import { RiP2PFill } from "react-icons/ri";
import SidebarBottom from "../common/SidebarBottom";

function Sidebar() {
  const { user } = useContext(MyAuthContext);

  return (
    <div className="sidebar p-9 float-left relative bg-[#041D04] text-white pt-24 px-8">
      <div className="user-info pl-1 flex items-center">
        <NavLink to="/dashboard/profile/account">
          <img src={user.profile_avatar} className="user-avatar mx-4" />
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
      <div className="ml-5">
        <NavLink
          to="/dashboard/manage/cloneshop"
          className="text-xl mt-6 flex "
        >
          <FaShoppingCart size={20} className="mr-4 my-auto" />
          <span>Clone Shop</span>
        </NavLink>
        <NavLink to="/dashboard/manage/market" className="text-xl mt-6 flex ">
          <IoStorefront size={20} className="mr-4 my-auto" />
          <span>Market</span>
        </NavLink>
        <NavLink
          to="/dashboard/manage/inventory"
          className="text-xl mt-6 flex "
        >
          <MdInventory size={20} className="mr-4 my-auto" />
          <span>Inverntory</span>
        </NavLink>
        <NavLink to="/dashboard/manage/p2p" className="text-xl mt-6 flex ">
          <RiP2PFill size={20} className="mr-4 my-auto" />
          <span>P2P</span>
        </NavLink>
        <NavLink
          to="/dashboard/manage/greenhouse"
          className="text-xl mt-6 flex "
        >
          <MdHomeFilled size={20} className="mr-4 my-auto" />
          <span>My Green house</span>
        </NavLink>
        <NavLink to="/dashboard/manage/warehouse" className="text-xl mt-6 flex">
          <MdWarehouse size={20} className="mr-4 my-auto " />
          <span>Warehouse</span>
        </NavLink>
        <NavLink to="/dashboard/manage/sellorder" className="text-xl mt-6 flex">
          <FaClock size={20} className="mr-4 my-auto" />
          <span>Sell Order</span>
        </NavLink>
      </div>
      <SidebarBottom />
    </div>
  );
}

export default Sidebar;
