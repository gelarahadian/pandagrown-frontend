import React from "react";
import { NavLink } from "react-router-dom";
import homeSvg from "assets/greenhouse/home-empty.svg";

function EmptyHouseMobile() {
  return (
    <>
      <div className="mt-40 mb-8 text-center">
        <img src={homeSvg} className="w-5/12 mx-auto" />
      </div>
      <div className="text-center my-5 px-12">
        <label className="text-xl font-bold block mb-2">Oops, it's empty</label>
        <label className="inline-block text-sm text-black/60">
          Looks like you don’t have any plantations in you green house yet. You
          can buy your seed at the clone shop. Wanna check it?
        </label>
        <div className="text-center mt-8 pb-10">
          <NavLink
            to="/cloneshop"
            className="w-full bg-[#041D04] text-white font-bold py-4 rounded-5 inline-block"
          >
            Go to Clone Shop
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default EmptyHouseMobile;
