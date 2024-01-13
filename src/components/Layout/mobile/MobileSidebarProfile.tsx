import { useContext } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";
import { Scrollbars } from "rc-scrollbars";
import {
  FaAngleLeft,
  FaMapMarkerAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import wallet from "assets/icons/Wallet.svg";
import MobileFloatButton from "components/common/MobileFloatButton";
import SidebarBottom from "../../common/SidebarBottom";

interface MobileSidebarProfileProps {
  onHideSidebar: () => void;
}

const MobileSidebarProfile: React.FC<MobileSidebarProfileProps> = (props) => {
  const { onHideSidebar } = props;
  const { user } = useContext(MyAuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="sidebar-mobile fixed w-full z-30 top-0 left-0">
      <div className="menubar relative z-50 bg-[#041D04] text-white pt-24 px-8">
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
        <div className="ml-5 pb-8">
          <NavLink
            to="/dashboard/profile/account"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <FaUser size={20} className="mr-4 my-auto" />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/dashboard/profile/referral"
            className="text-md mt-6 flex"
            onClick={onHideSidebar}
          >
            <FaUserPlus size={20} className="mr-4 my-auto" />
            <span>Referral</span>
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

export default MobileSidebarProfile;
