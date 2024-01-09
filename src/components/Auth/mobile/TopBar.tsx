import mobileLogo from 'assets/logo-main.svg';
import MobileFloatButton from 'components/common/MobileFloatButton';
import { useLocation } from "react-router";

const Topbar = ({
  setShowSidebar
}: {
  setShowSidebar: (flag: boolean) => any
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div style={{ height: '100px' }} className="flex mb-4 pb-3 items-center">
      <a href='/'><img src={mobileLogo} style={{ width: "68px" }} /></a>
      {/* <img src={mobileLogo} /> */}
      { currentPath.includes("/account") ? (
        <></>
      ) : (
        <MobileFloatButton onClick={() => setShowSidebar(true)} />
      ) }
      
    </div>
  )
}

export default Topbar;