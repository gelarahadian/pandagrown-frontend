import { useState } from "react";
import { NavLink } from "react-router-dom";
import ErrorMsg from "components/Auth/ErrorMsg";
import MobileSidebar from "components/Landing/MobileSidebar";
import logoImg from "assets/logo-sign1.png";
import { Scrollbars } from 'rc-scrollbars';

interface AuthLayoutTabletProps {
  error: string,
  setError: any,
  children: any
}

function AuthLayoutTablet({ error, setError, children }: AuthLayoutTabletProps) {
  const [showSidebar, setShowSidebar] = useState(false); // on mobile, toggle sidebar (only works on mobile)
  

  return (
    <>
      <div className="h-24 px-20 flex items-center" style={{ boxShadow: "rgba(0, 0, 0, 0.3) 0px 7px 15px 0px" }}>
        <div className="w-1/2">
          <NavLink to="/" >
            <img src={logoImg} alt="Logo" className="" />
          </NavLink>
        </div>
        <div className="w-1/2 text-right">
          <NavLink to="/how" className="text-xl mr-20" >How it works</NavLink>
          <NavLink to="/faq" className="text-xl" >FAQ</NavLink>
        </div>
      </div>
      <div className="flex justify-center relative">
        <div className="mx-auto" style={{ width:"380px", paddingTop: '50px' }}>
          {error == '' ?
            <div>
            </div>
            : <ErrorMsg error={error} handleClose={() => setError('')} />}
          <div className="flex items-center w-full pb-5">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthLayoutTablet;