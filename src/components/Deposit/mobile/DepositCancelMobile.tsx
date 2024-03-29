import React from "react";
import { NavLink } from "react-router-dom";
import modalIcon from 'assets/bill-check.svg';

interface DepositCancelProps {
  isOpen: boolean,
  onClose: () => void;
};

function DepositCancelMobile({ isOpen, onClose }: DepositCancelProps) {
  if (!isOpen) return null;

  return (
    <>
        <div className="pt-7 px-7 text-center">
            <div className="flex pt-5">
            <img src={modalIcon} className="mx-auto" style={{ height: '137px', width: '137px' }} />
            </div>
            <div className="px-9 py-4">
            <h3 className="pt-2 pb-7 font-bold text-xl">Oops, payment has been canceled.</h3>
            {/* <p className="text-black/70 text-sm">
                Awesome, your fund has been added and the balance has been updated. You are now ready to invest on our plantation.
            </p> */}
            </div>
            <NavLink
            className="block mt-10 text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
            to="/deposit" onClick={onClose}>
            Back to Deposit Page
            </NavLink>
        </div>
    </>
  )

}

export default DepositCancelMobile;