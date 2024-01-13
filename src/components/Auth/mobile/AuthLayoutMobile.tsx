import { useState } from "react";
import Topbar from "components/Auth/mobile/TopBar";
import ErrorMsg from "components/Auth/ErrorMsg";
import MobileSidebar from "components/Landing/MobileSidebar";
import { Scrollbars } from "rc-scrollbars";
import { NavLink } from "react-router-dom";
import Logo from "assets/logo-sign.png";
import LoginBg from "assets/images/login-bg.png";

interface AuthLayoutMobileProps {
  error: string;
  setError: any;
  children: any;
}

function AuthLayoutMobile({
  error,
  setError,
  children,
}: AuthLayoutMobileProps) {
  const [showSidebar, setShowSidebar] = useState(false); // on mobile, toggle sidebar (only works on mobile)

  return (
    <>
      <div className="flex flex-col h-screen bg-[#041D04]">
        <NavLink to="/">
          <img
            src={Logo}
            alt="Logo"
            className="absolute"
            style={{ top: "50px", left: "68px", height: "24px" }}
          />
        </NavLink>
        <div
          className="h-52 w-full div-image"
          style={{
            backgroundImage: `url(${LoginBg})`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="w-full">
          <div className="mx-auto w-2/3" style={{ paddingTop: "70px" }}>
            {error == "" ? (
              <div className="flex justify-end w-full">
                <NavLink to="/how" className="text-xl mr-20 text-white">
                  How it works
                </NavLink>
                <NavLink to="/faq" className="text-xl text-white">
                  FAQ
                </NavLink>
              </div>
            ) : (
              <ErrorMsg error={error} handleClose={() => setError("")} />
            )}
            <div className="flex items-center w-full pt-14 pb-5 ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthLayoutMobile;
