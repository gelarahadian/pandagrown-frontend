import {useContext, useEffect} from "react";
import { useMobileContext } from "context/MobileContext";
import { MyAuthContext } from "context/AuthContext";
import IconPlant from "assets/icons/icon-plant.png"
import IconHarvest from "assets/icons/icon-harvest.png"
import IconProfit from "assets/icons/icon-profit.png"
import api from "../../utils/api";
import {Link} from "react-router-dom";
import {config} from "../../config";

const SidebarBottom = () => {
  const isMobile = useMobileContext();
  const { user } = useContext(MyAuthContext);

  // if (true) { 
  //   return (
  //     <button className="btn-wallet text-xl w-full py-5 rounded-5">Setup My Wallet</button>
  //   )
  // }
  return (
    <>
      <div className={'absolute bottom-1 pb-5 flex justify-between'} style={{width: 'calc(100% - 4.5rem)'}}>
        <Link to={config.api.API_URL + 'papers/whitepaper.pdf'} target={'_blank'} className="text-sm text-white" style={{color: '#059033'}}>WhitePaper</Link>
        <Link to={'/terms'} className="text-sm text-white" target={'_blank'} style={{color: '#059033'}}>Terms & Conditions</Link>
      </div>
    </>
  )
}

export default SidebarBottom;