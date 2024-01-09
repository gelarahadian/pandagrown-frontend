import { useContext } from "react";
import { NavLink } from "react-router-dom";

import MyWallet from "components/common/MyWallet";
import { MyAuthContext } from "context/AuthContext";
import { Scrollbars } from 'rc-scrollbars';
// import avatarImg from 'assets/images/sample-avatar.jpg';
import { MdHomeFilled, MdWarehouse } from "react-icons/md";
import { FaShoppingCart, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import MobileFloatButton from "components/common/MobileFloatButton";
import SidebarBottom from "../../common/SidebarBottom";


interface TabletSidebarProps {
    onHideSidebar: () => void;
}
  
const TabletSidebar: React.FC<TabletSidebarProps> = (props) => {
  const { onHideSidebar } = props;
  const { user } = useContext(MyAuthContext);
  
  return (
    <div className="sidebar-mobile fixed z-30 w-full top-0 left-0">
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
            <div className="ml-5 mb-8">
                <NavLink to="/cloneshop" className="text-md mt-6 flex" onClick={onHideSidebar}>
                <FaShoppingCart size={20} className="mr-4 my-auto" />
                <span>Clone Shop</span>
                </NavLink>
                <NavLink to="/greenhouse" className="text-md mt-6 flex" onClick={onHideSidebar}>
                <MdHomeFilled size={20} className="mr-4 my-auto" />
                <span>My Green house</span>
                </NavLink>
                <NavLink to="/warehouse" className="text-md mt-6 flex" onClick={onHideSidebar}>
                <MdWarehouse size={20} className="mr-4 my-auto" />
                <span>Warehouse</span>
                </NavLink>
                <NavLink to="/sellorder" className="text-md mt-6 flex" onClick={onHideSidebar}>
                <FaClock size={20} className="mr-4 my-auto" />
                <span>Sell Order</span>
                </NavLink>
            </div>
            <SidebarBottom/>
        </div>
        <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={onHideSidebar}></div>
    </div>
  )
}

export default TabletSidebar;