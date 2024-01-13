import { useState, useContext } from "react";
import { useLocation } from "react-router";
import { MyAuthContext } from "context/AuthContext";
import { useMobileContext } from "context/MobileContext";
import { NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import logo from "assets/logo-main.svg";
import { BsGridFill } from "react-icons/bs";
import { FaBell, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoMdListBox } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import NavbarHide from "assets/mobile/navbar-hide.png";
import NavbarShow from "assets/mobile/navbar-show.png";
import { useTabletContext } from "context/TabletContext";

interface NavbarProps {
  onHideNavbar: () => void;
  isHideNavbar: boolean;
  showNavbar?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { isHideNavbar, onHideNavbar, showNavbar } = props;
  const { user } = useContext(MyAuthContext);
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const location = useLocation();

  const getActiveClassName = (type: number) => {
    const currentPath = location.pathname;
    if (
      type == 1 &&
      (currentPath.includes("/greenhouse") ||
        currentPath.includes("/warehouse") ||
        currentPath.includes("/sellorder") ||
        currentPath.includes("/confirmation"))
    ) {
      return "active";
    }
    if (
      type == 5 &&
      (currentPath.includes("/withdrawal") ||
        currentPath.includes("/support") ||
        currentPath.includes("/ticket") ||
        currentPath.includes("/myticket"))
    ) {
      return "active";
    }
    if (type == 4 && currentPath.includes("/referral")) {
      return "active";
    }
    return "";
  };

  return (
    <>
      {isMobile && isHideNavbar ? (
        <>
          <div
            className="fixed left-0 bottom-0 flex items-center justify-center"
            style={{ width: "34px", height: "84px" }}
          >
            <img src={NavbarShow} onClick={onHideNavbar} />
          </div>
        </>
      ) : (
        <div
          className={`${isMobile ? "navbar-mobile" : "navbar"} ${
            isMobile || isTablet
              ? "translate-x-[0] ease-in"
              : showNavbar
              ? "translate-x-0 ease-in"
              : "translate-x-[-100%] ease-out"
          } transition-all duration-200 bg-white flex flex-col justify-between`}
        >
          <div>
            <img src={logo} className="logo" />
            <Tooltip title="Seed Manage" placement="right" arrow>
              <NavLink
                to="/dashboard/manage"
                className={`${getActiveClassName(1)}`}
              >
                <span>
                  <BsGridFill size={19} />
                </span>
              </NavLink>
            </Tooltip>
            <Tooltip title="Notifications" placement="right" arrow>
              <NavLink to="dashboard/notification" className="relative">
                <span>
                  <FaBell size={19} />
                </span>
                {Number(user.noty) > 0 ? (
                  <span
                    className="absolute bottom-0 right-0 rounded-full h-4 w-4 text-white text-xs text-center"
                    style={{ background: "#f00" }}
                  >
                    {user.noty}
                  </span>
                ) : (
                  <></>
                )}
              </NavLink>
            </Tooltip>
            <Tooltip title="My Reports" placement="right" arrow>
              <NavLink to="dashboard/navhistory">
                <span>
                  <IoMdListBox size={19} />
                </span>
              </NavLink>
            </Tooltip>
            <Tooltip title="Profile" placement="right" arrow>
              <NavLink
                to="dashboard/profile"
                className={`${getActiveClassName(4)}`}
              >
                <span>
                  <FaUser size={19} />
                </span>
              </NavLink>
            </Tooltip>
            <Tooltip title="Settings" placement="right" arrow>
              <NavLink
                to="dashboard/settings"
                className={`${getActiveClassName(5)}`}
              >
                <span>
                  <FaCog size={19} />
                </span>
              </NavLink>
            </Tooltip>
          </div>

          <div className={`${isMobile && "pb-20"}`}>
            <div className="border-b pt-9 mb-8 mx-2 text-black/50 mt-auto"></div>
            <Tooltip title="Logout" placement="right" arrow>
              <NavLink to="/logout">
                <span>
                  <FaSignOutAlt size={19} />
                </span>
              </NavLink>
            </Tooltip>
          </div>

          {isMobile ? (
            <div
              className="fixed left-0 bottom-0 flex items-center justify-center"
              style={{ width: "78px", height: "84px", background: "#0590330e" }}
            >
              <img src={NavbarHide} onClick={onHideNavbar} />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
