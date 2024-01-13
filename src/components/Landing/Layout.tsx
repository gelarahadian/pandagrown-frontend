import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { useMobileContext } from "context/MobileContext";
import Topbar from "components/Landing/Topbar";
import MobileSidebar from "components/Landing/MobileSidebar";
import Footer from "components/Landing/Home/Footer";
import { Scrollbars } from "rc-scrollbars";
import { useTabletContext } from "context/TabletContext";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false); // on mobile, toggle sidebar (only works on mobile)
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  // if (isMobile && showSidebar)
  //   return <MobileSidebar toggle={() => setShowSidebar(false)} />

  return (
    <>
      <Scrollbars style={{ width: "100%", height: "100vh" }}>
        <Topbar setShowSidebar={setShowSidebar} />
        <Outlet />
        <Footer />
      </Scrollbars>
      {isMobile && showSidebar ? (
        <MobileSidebar toggle={() => setShowSidebar(false)} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Layout;
