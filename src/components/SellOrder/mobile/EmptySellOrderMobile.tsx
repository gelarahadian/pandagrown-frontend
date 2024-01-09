import { NavLink } from "react-router-dom";
import homeSvg from 'assets/empty-sell-order.svg';

function EmptySellOrderMobile() {
  return (
    <>
      <div className="mt-32 mb-8 text-center">
        <img src={homeSvg} className="w-5/12 mx-auto" />
      </div>
      <div className="text-center my-5 px-12">
        <label className="text-xl font-bold block mb-2">Oops, you don't have any sell order..</label>
        <label className="inline-block text-sm text-black/60" >
        Looks like you don’t have any sell order yet. You can come back later.
        </label>
        <div className="text-center mt-8 pb-10">
          <NavLink to="/warehouse" className="w-full bg-green text-white font-bold py-4 rounded-5 inline-block">Check my warehouse</NavLink>
        </div>
      </div>
    </>
  )
}

export default EmptySellOrderMobile;