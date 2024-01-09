import { useContext } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";
import { Scrollbars } from 'rc-scrollbars';
import { FaMapMarkerAlt, FaUser, FaUserPlus } from 'react-icons/fa';
import wallet from 'assets/icons/Wallet.svg';
import MobileFloatButton from "components/common/MobileFloatButton";
import SidebarBottom from "../../common/SidebarBottom";


interface TabletSidebarProfileProps {
    onHideSidebar: () => void;
}
  
const TabletSidebarProfile: React.FC<TabletSidebarProfileProps> = (props) => {
  const { onHideSidebar } = props;
  const { user } = useContext(MyAuthContext);
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="sidebar-mobile fixed w-full z-30 top-0 left-0">
        <div className="menubar relative z-50 bg-white pt-12 pl-10 pr-10">
            <div className="w-full flex">
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
                <div className="w-1/5 text-right"><MobileFloatButton onClick={onHideSidebar} /></div>
            </div>
            <div className="mt-8 mb-11">
                <MyWallet />
            </div>
            <hr className="text-gray mb-10" />
            <div className="ml-5 pb-8">
                <NavLink to="/account" className="text-md mt-6 flex" onClick={onHideSidebar}>
                    <FaUser size={20} className="mr-4 my-auto" />
                    <span>Profile</span>
                </NavLink>
                <NavLink to="/referral" className="text-md mt-6 flex" onClick={onHideSidebar}>
                    <FaUserPlus size={20} className="mr-4 my-auto" />
                    <span>Referral</span>
                </NavLink>
            </div>

            <SidebarBottom/>
        </div>
        <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={onHideSidebar}></div>
    </div>
  )
}

export default TabletSidebarProfile;