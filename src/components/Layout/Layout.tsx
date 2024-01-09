import { useState, useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MyAuthContext } from "context/AuthContext";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import Navbar from "components/Layout/Navbar";
import MobileLayout from "./mobile/MobileLayout";
import { toast } from "react-toastify";
import { config } from "config";
import TabletSidebar from "./tablet/TabletSidebar";
import TabletSidebarProfile from "./tablet/TabletSidebarProfile";
import TabletSidebarWallet from "./tablet/TabletSidebarWallet";
import api from "utils/api";
import topbarBackground from "assets/images/topbar.png";
import { Scrollbars } from "rc-scrollbars";
import { MdMenu } from "react-icons/md";
import "styles/layout.scss";
import SidebarHistory from "./SidebarHistory";
import TabletSidebarHistory from "./tablet/TabletSidebarHistory";
import topButtonIcon from "assets/top-button.svg";
import bgDashboard from "assets/images/bg-dashboard.png";

function Layout() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user, setUser } = useContext(MyAuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(0);
  const [title, setTitle] = useState<string>("");
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  const location = useLocation();

  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath == "/cloneshop") {
      setTitle("Clone Store");
      setSidebarType(0);
    } else if (currentPath == "/greenhouse") {
      setTitle("My Green House");
      setSidebarType(0);
    } else if (currentPath == "/confirmation") {
      setTitle("Confirmation");
      setSidebarType(0);
    } else if (currentPath == "/warehouse") {
      setTitle("Warehouse");
      setSidebarType(0);
    } else if (currentPath == "/sellorder") {
      setTitle("Sell Order");
      setSidebarType(0);
    } else if (currentPath.includes("/deposit")) {
      setTitle("Deposit");
      setSidebarType(1);
    } else if (currentPath.includes("/withdrawal")) {
      setTitle("Withdrawal");
      setSidebarType(1);
    } else if (currentPath.includes("/history")) {
      setTitle("History");
      setSidebarType(1);
    } else if (currentPath.includes("/support")) {
      setTitle("Support");
      setSidebarType(1);
    } else if (currentPath.includes("/myticket")) {
      setTitle("My Tickets");
      setSidebarType(1);
    } else if (currentPath.includes("/ticket")) {
      setTitle("Create New Ticket");
      setSidebarType(1);
    } else if (currentPath.includes("/notification")) {
      setTitle("Notification");
      setSidebarType(0);
    } else if (currentPath.includes("/account")) {
      setTitle("Profile");
      setSidebarType(2);
    } else if (currentPath.includes("/referral")) {
      setTitle("Referral");
      setSidebarType(2);
    }
    // else if(currentPath.includes('/navhistory')) {
    //   setTitle("History");
    //   setSidebarType(3);
    // }
  }, [currentPath]);

  const handleHideSidebar = function () {
    setSidebarOpen(false);
  };
  useEffect(() => {
    const ws = new WebSocket(config.api.WS_URL + user.user_id + `/`);

    ws.onmessage = (event) => {
      console.log("ws_message", event.data);
      const data = JSON.parse(event.data);

      if (data.type != "Ticket_Status") {
        toast.success(data.content);
      } else {
        toast.success("Pandagrown Admin has replied on your ticket.");
      }

      localStorage.setItem("noty", (Number(user.noty) + 1).toString());
      setUser((prevUser: any) => ({
        ...prevUser,
        noty: Number(prevUser.noty) + 1,
      }));

      if (data.type == "Ticket_Status") {
        console.log("Ticket_Status", data.id);
        setUser((prevUser: any) => ({
          ...prevUser,
          ticket_status: "1",
          ticket_type: data.state,
          ticket_id: data.id,
        }));
      }

      if (
        data.type == "Deposit_Balance" ||
        data.type == "Deposit_PGAToken" ||
        data.type == "Profile_Update" ||
        data.type == "Purchase" ||
        data.type == "Sell_Harvest" ||
        data.type == "Withdraw"
      ) {
        api
          .get(`user/${user.user_id}/status/`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            const data = res.data;
            if (data) {
              localStorage.setItem("balance", data.balance); // set token -> this means logged in
              localStorage.setItem("pga_balance", data.pga_balance);
              localStorage.setItem("plants", data.user_plants_count); // set token -> this means logged in
              localStorage.setItem("harvest", data.user_harvest_amount); // set token -> this means logged in
              localStorage.setItem("profit", data.user_profit); // set token -> this means logged in
              localStorage.setItem("profit_pga", data.user_profit_pga); // set token -> this means logged in
              setUser((prevUser: typeof MyAuthContext) => ({
                ...prevUser,
                balance: data.balance,
                pga_balance: data.pga_balance,
                plants: data.user_plants_count,
                harvest: data.user_harvest_amount,
                profit: data.user_profit,
                profit_pga: data.user_profit_pga,
              }));
            }
            // notice
            console.log("get profile data", data);
          })
          .catch((err) => {
            console.log("get profile data error", err);
          });
      }
    };

    ws.onopen = () => {
      console.log("OPEN");
    };

    ws.onclose = () => {
      console.log("CLOSED");
    };

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  const onHideNavbar = () => {
    return true;
  };

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <>
      <Navbar
        showNavbar={showNavbar}
        isHideNavbar={true}
        onHideNavbar={onHideNavbar}
      />
      <div className="absolute top-12 right-12 z-20">
        <button
          onClick={() => setShowNavbar(!showNavbar)}
          className="p-6 bg-[#059033]/10 hover:bg-[#059033]/20"
        >
          <img src={topButtonIcon} alt="top button icon" />
        </button>
      </div>

      <div
        style={{
          backgroundImage: `url(${bgDashboard})`,
          backgroundSize: "cover, contain",
        }}
        className={`page-wrapper ${
          showNavbar ? "pl-[88px] ease-in" : "ease-out"
        } transition-all duration-200  `}
      >
        {/*<Scrollbars style={{ width: '100%', height: '100vh' }}>*/}
        <Outlet />
        {/*</Scrollbars>*/}
        {sidebarOpen ? (
          sidebarType == 1 ? (
            <TabletSidebarWallet onHideSidebar={handleHideSidebar} />
          ) : sidebarType == 2 ? (
            <TabletSidebarProfile onHideSidebar={handleHideSidebar} />
          ) : (
            // sidebarType == 3 ? (
            //   <TabletSidebarHistory onHideSidebar={handleHideSidebar} />
            // ) : (
            <TabletSidebar onHideSidebar={handleHideSidebar} />
            // )
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Layout;
