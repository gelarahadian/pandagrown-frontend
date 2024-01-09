import React from "react";
import { NavLink } from "react-router-dom";
import homeSvg from "assets/greenhouse/home-empty.svg";

function EmptyHouse() {
  return (
    <>
      <div className="pb-8">
        <div className="bg-green bg-opacity-10 pt-3 pb-4 px-5 mt-2">
          All of your plants are listed here. You can see some important
          information such as cloning & rooting days, vegetation & mass days,
          and any other information.
        </div>
        <div style={{ marginTop: "97px" }} className="mb-8 flex">
          <img src={homeSvg} className="m-auto" />
        </div>
        <div className="text-center">
          <label className="text-xl font-bold block mb-2">
            Oops, your green house is empty...
          </label>
          <label className="inline-block" style={{ maxWidth: "569px" }}>
            Looks like you don’t have any plantations in you green house yet.
            You can buy your seed at the clone shop. Wanna check it?
          </label>
          <div className="text-center mt-8">
            <NavLink
              to="/cloneshop"
              className="bg-[#041D04] text-white font-bold py-4 rounded-5 w-368 inline-block"
            >
              Go to Clone Shop
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmptyHouse;
