import React from "react";
import { NavLink } from "react-router-dom";
import modalIcon from 'assets/checked.svg';
import { Scrollbars } from 'rc-scrollbars';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
};


// function ModalCheckout({ isOpen, onClose, cartList }: ModalProps) {
const ModalSuccessPurchase: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose} = props;
  if (!isOpen) return null;

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
      <Scrollbars className="" style={{ width: '100%', height: '100vh' }}>
        <div className="relative flex items-center h-fit min-h-screen w-auto py-6 mx-auto max-w-3xl">
          <div className="modal-success-purchase animation-fade-in-top mx-auto border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none px-8 py-7 z-50 ">
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
                <h3 className="pt-2 pb-7 font-bold text-xl">Great! Our pandas says thanks <br/>to you</h3>
                <p className="text-black/70 text-sm">
                    Awesome, your hemps purchase has been <br/>succeed. You will be able to see it on the <br/>green house. Want to check it?
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
          <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={onClose}></div>
        </div>
        </Scrollbars>
      </div>
    </>
  )
}

export default ModalSuccessPurchase;