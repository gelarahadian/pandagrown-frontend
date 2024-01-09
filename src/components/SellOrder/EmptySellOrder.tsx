import React from "react";
import { NavLink } from "react-router-dom";
import cartSvg from "assets/empty-sell-order.svg";

function EmptySellOrder() {
  return (
    <>
      <div className="pb-8">
        <div style={{ marginTop: "97px" }} className="mb-8 flex">
          <img src={cartSvg} className="m-auto" />
        </div>
        <div className="text-center">
          <label className="text-xl font-bold block mb-2">
            Oops, you don't have any sell order..
          </label>
          <label className="inline-block" style={{ maxWidth: "569px" }}>
            Looks like you don’t have any sell order yet. You can come back
            later.
          </label>
          <div className="text-center mt-8">
            <NavLink
              to="/warehouse"
              className="bg-[#041D04] text-white font-bold py-4 rounded-5 w-368 inline-block"
            >
              Check my warehouse
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmptySellOrder;
