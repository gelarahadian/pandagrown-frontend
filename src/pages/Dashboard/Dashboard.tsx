import Sidebar from "components/Layout/Sidebar";
import SidebarHistory from "components/Layout/SidebarHistory";
import SidebarProfile from "components/Layout/SidebarProfile";
import SidebarWallet from "components/Layout/SidebarWallet";
import logoPandagrown from "assets/images/logo-pandagrown.png";
import { MyAuthContext } from "context/AuthContext";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";

const Dashboard = () => {
  const { user } = useContext(MyAuthContext);
  const isMobile = useMobileContext();

  const [usd_balance, setUsdBalance] = useState("-1");
  const [invest_fund, setInvestFund] = useState("-1");
  const [total_profit, setTotalProfit] = useState("-1");
  const location = useLocation();

  let sidebar = <></>;
  if (location.pathname.includes("/manage")) {
    sidebar = <Sidebar />;
  } else if (location.pathname.includes("/navhistory")) {
    sidebar = (
      <SidebarHistory
        usd_balance={usd_balance}
        invest_fund={invest_fund}
        total_profit={total_profit}
      />
    );
  } else if (location.pathname.includes("/profile")) {
    sidebar = <SidebarProfile />;
  } else if (location.pathname.includes("/settings")) {
    sidebar = <SidebarWallet />;
  } else {
    sidebar = <></>;
  }
  return (
    <>
      {!isMobile && sidebar}
      <div className="w-full h-screen flex justify-center items-center flex-col">
        <div className="relative flex justify-center">
          <h1 className="text-center text-3xl md:text-5xl font-bold absolute top-8">
            Welcome, {user.username}!
          </h1>
          <img src={logoPandagrown} alt="logo pandagrown" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
