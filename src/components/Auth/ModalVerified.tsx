import React from "react";
import { NavLink } from "react-router-dom";
import modalIcon from 'assets/checked-success.svg';

interface ModalProps {
  isOpen: boolean,
  onClose: () => void,
};

function ModalVerified({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="modal animation-fade-in-top border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none z-50"
          >
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
              <div className="flex">
                <img src={modalIcon} className="mx-auto" style={{ height: '208px', width: '208px', marginTop: '42px' }} />
              </div>
              <h1 className="text-3xl font-bold mt-7">You are all set, your account has been verified.</h1>
              <p className="mt-5 mb-14 text-xl leading-relaxed">
                It’s time for you to invest and grow your money with our platform. Please keep all of your credentials safe, and don’t share it with anyone. Happy invest!
              </p>
            </div>
            <NavLink
              className="text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
              to='/login'
            >
              Login
            </NavLink>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={onClose}></div>
        </div>
      </div>
    </>
  )
}

export default ModalVerified;