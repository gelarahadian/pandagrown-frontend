import { useContext } from "react";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";

// import avatarImg from 'assets/images/sample-avatar.jpg';
import { FaMapMarkerAlt, FaUser, FaUserPlus } from "react-icons/fa";
import SidebarBottom from "../common/SidebarBottom";

function SidebarProfile() {
  const { user } = useContext(MyAuthContext);

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
      <div className="ml-5">
        <NavLink to="/dashboard/profile/account" className="text-xl mt-6 flex">
          <FaUser size={20} className="mr-4 my-auto" />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/dashboard/profile/referral" className="text-xl mt-6 flex">
          <FaUserPlus size={20} className="mr-4 my-auto" />
          <span>Referral</span>
        </NavLink>
      </div>
      <SidebarBottom />
    </div>
  );
}

export default SidebarProfile;
