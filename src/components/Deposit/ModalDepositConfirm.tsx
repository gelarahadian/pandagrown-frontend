import React from "react";
import { NavLink } from "react-router-dom";
import modalIcon from 'assets/bill-check.svg';

interface ModalProps {
  isOpen: boolean,
  onClose: () => void,
};

function ModalDepositConfirm({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="modal-success-purchase animation-fade-in-top border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none px-12 py-7 z-50 ">
            <button
              className="bg-transparent border-0 text-black leading-none font-semibold outline-none focus:outline-none absolute top-7 right-7"
              onClick={onClose}
            >
              <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
            {/*body*/}
            <div className="text-center">
              <div className="flex pt-5">
                <img src={modalIcon} className="mx-auto" style={{ height: '256px', width: '256px' }} />
              </div>
              <div className="px-9 py-4">
                <h3 className="pt-2 pb-7 font-bold text-xl">Awesome, your fund has been added to your balance.</h3>
                <p className="text-black/70 text-sm">
                    Awesome, your fund has been added and the balance has been updated. You are now ready to invest on our plantation.
                </p>
              </div>
              <NavLink
                className="block mt-10 text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
                to="/greenhouse"
                >
                Go to My Green House
              </NavLink>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      </div>
    </>
  )

}

export default ModalDepositConfirm;