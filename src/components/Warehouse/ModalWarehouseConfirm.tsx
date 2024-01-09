import React from "react";
import { Scrollbars } from 'rc-scrollbars';
import { FaSpinner } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  isLoading: boolean;
  sellHarvest: () => void;
  onClose: () => void;
};


// function ModalCheckout({ isOpen, onClose, cartList }: ModalProps) {
const ModalWarehouseConfirm: React.FC<ModalProps> = (props) => {
  const { isOpen, isLoading, sellHarvest, onClose} = props;
  if (!isOpen) return null;

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
      <Scrollbars className="" style={{ width: '100%', height: '100vh' }}>
        <div className="relative flex h-screen w-auto py-6 mx-auto max-w-3xl items-center">
          <div className="mx-auto animation-fade-in-top border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none px-8 py-7 z-50 " style={{ width: "550px" }}>
            {/*body*/}
            <div className="text-center py-6 px-8">
              <h2 className="text-xl font-bold">Selling your harvested plant?</h2>
              <p className="block pt-4 pb-9 text-lg">You will not be able to cancel this once you confirm. Your plant will be added to the <br/>selling order page.</p>
              <ButtonWithSpinner isLoading={isLoading} onClick={sellHarvest}>
              Yes, I'm sure</ButtonWithSpinner>
              <button className="block w-full text-green mt-5 font-bold" onClick={onClose}>No, thanks</button>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={onClose}></div>
        </div>
        </Scrollbars>
      </div>
    </>
  )
}

interface ButtonWithSpinnerProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isLoading,
  onClick,
  children,
}) => {
  return (
    <button  disabled={isLoading} className={`block w-full btn-green !bg-green text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150`} onClick={onClick}>
      {isLoading ? (
        <>
          <FaSpinner className="spinner m-auto text-xl" />
        </>
      ) : (
        children
      )}
    </button>
  );
};


export default ModalWarehouseConfirm;