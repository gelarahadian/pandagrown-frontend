import { NavLink } from "react-router-dom";

import ErrorMsg from "components/Auth/ErrorMsg";

import Logo from "assets/logo-sign.png";
import LoginBg from "assets/images/login-bg.png";

interface AuthLayoutProps {
  error: string;
  setError: any;
  children: any;
}

function AuthLayout({ error, setError, children }: AuthLayoutProps) {
  return (
    <div className="flex bg-[#041D04]">
      <NavLink to="/">
        <img
          src={Logo}
          alt="Logo"
          className="absolute"
          style={{ top: "50px", left: "68px", height: "24px" }}
        />
      </NavLink>
      <div
        className="h-screen w-1/2 div-image"
        style={{
          backgroundImage: `url(${LoginBg})`,
          backgroundSize: "cover",
          minHeight: "780px",
        }}
      ></div>
      <div className="w-1/2">
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
          <div className="flex items-center w-full pt-14 pb-5 ">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
