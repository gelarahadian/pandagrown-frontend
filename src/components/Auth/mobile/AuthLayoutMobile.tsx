import { useState } from "react";
import Topbar from "components/Auth/mobile/TopBar";
import ErrorMsg from "components/Auth/ErrorMsg";
import MobileSidebar from "components/Landing/MobileSidebar";
import { Scrollbars } from 'rc-scrollbars';

interface AuthLayoutMobileProps {
  error: string,
  setError: any,
  children: any
}

function AuthLayoutMobile({ error, setError, children }: AuthLayoutMobileProps) {
  const [showSidebar, setShowSidebar] = useState(false); // on mobile, toggle sidebar (only works on mobile)
  

  return (
    <>
      <Scrollbars style={{ width: '100%', height: '100vh' }}>
        <div style={{ padding: '28px 35px 126px' }}>
          <Topbar setShowSidebar={setShowSidebar} />
          {error == '' ?
            <></> : <ErrorMsg error={error} handleClose={() => setError('')} />}
          <div className="mt-3">
            {children}
          </div>
        </div>
      </Scrollbars>
      {
        (showSidebar) ? (
          <MobileSidebar toggle={() => setShowSidebar(false)} />
        ) : (
          <></>
        )
      }
    </>
  )
}

export default AuthLayoutMobile;