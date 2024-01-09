import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import Navbar from "components/Layout/Navbar";
import MobileSidebar from "./MobileSidebar";
import MobileSidebarWallet from "./MobileSidebarWallet";
import MobileSidebarProfile from "./MobileSidebarProfile";
import MobileFloatButton from "components/common/MobileFloatButton";
import bgDashboard from "assets/images/bg-dashboard.png";

function MobileLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(0);
  const [isHideNavbar, setIsHideNavbar] = useState(false);
  const [title, setTitle] = useState<string>("");

  const location = useLocation();

  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath.includes("/manage")) {
      setSidebarType(0);
      if (currentPath.includes("/cloneshop")) {
        setTitle("Clone Store");
      } else if (currentPath.includes("/greenhouse")) {
        setTitle("My Green House");
      } else if (currentPath.includes("/warehouse")) {
        setTitle("Warehouse");
      } else if (currentPath.includes("/sellorder")) {
        setTitle("Sell Order");
      } else {
        setTitle("");
      }
    } else if (currentPath.includes("/confirmation")) {
      setTitle("Confirmation");
      setSidebarType(0);
    } else if (currentPath.includes("/settings")) {
      setSidebarType(1);
      if (currentPath.includes("/deposit")) {
        setTitle("Deposit");
      } else if (currentPath.includes("/withdrawal")) {
        setTitle("Withdrawal");
      } else if (currentPath.includes("/history")) {
        setTitle("History");
      } else if (currentPath.includes("/support")) {
        setTitle("Support");
      } else if (currentPath.includes("/myticket")) {
        setTitle("My Tickets");
      }
    } else if (currentPath.includes("/ticket")) {
      setTitle("Create New Ticket");
      setSidebarType(1);
    } else if (currentPath.includes("/profile")) {
      setSidebarType(2);
      if (currentPath.includes("/account")) {
        setTitle("Profile");
      } else if (currentPath.includes("/referral")) {
        setTitle("Referral");
      }
    } else if (currentPath.includes("/notification")) {
      setTitle("Notification");
      setSidebarType(0);
    } else {
      setTitle("");
      setSidebarType(0);
    }
  }, [currentPath]);

  const handleHideSidebar = function () {
    setSidebarOpen(false);
  };

  const onHideNavbar = () => {
    setIsHideNavbar(!isHideNavbar);
  };

  return (
    <>
      <Navbar isHideNavbar={isHideNavbar} onHideNavbar={onHideNavbar} />
      <div
        className={`${isHideNavbar ? "px-2" : ""} page-wrapper w-full !ml-0 ${
          isHideNavbar ? "ease-in " : "ease-out pl-[88px]"
        } duration-200 transition-all`}
        style={{
          backgroundImage: `url(${bgDashboard})`,
          backgroundSize: "cover, contain",
        }}
      >
        <div className="w-full flex items-center mb-4 mr-2 pt-12 px-8">
          <label className="w-3/4 text-xl font-bold">{title}</label>
          <div className="w-1/4 text-right">
            {!currentPath.includes("/navhistory") ? (
              <MobileFloatButton onClick={() => setSidebarOpen(!sidebarOpen)} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <Outlet />
        {sidebarOpen ? (
          sidebarType == 1 ? (
            <MobileSidebarWallet onHideSidebar={handleHideSidebar} />
          ) : sidebarType == 2 ? (
            <MobileSidebarProfile onHideSidebar={handleHideSidebar} />
          ) : (
            <MobileSidebar onHideSidebar={handleHideSidebar} />
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default MobileLayout;
