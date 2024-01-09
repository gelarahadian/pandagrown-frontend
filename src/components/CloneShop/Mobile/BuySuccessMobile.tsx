import React from "react";
import { NavLink } from "react-router-dom";
import modalIcon from 'assets/checked.svg';

interface BuySuccessMobileProps {
    isOpen: boolean;
  }
// function ModalCheckout({ isOpen, onClose, cartList }: ModalProps) {
const BuySuccessMobiles: React.FC<BuySuccessMobileProps> = (props) => {
    const { isOpen } = props;
    if (!isOpen) return null;

  return (
    <>
        {/*body*/}
        <div className="text-center pb-10">
            <div className="flex pt-20">
            <img src={modalIcon} className="mx-auto" style={{ height: '167px', width: '167px' }} />
            </div>
            <div className="py-4">
            <h3 className="pt-2 pb-7 font-bold text-xl">Great! Our pandas says thanks to you</h3>
            <p className="text-black/70 text-sm">
                Awesome, your hemps purchase has been succeed. You will be able to see it on the green house. Want to check it?
            </p>
            </div>
            <NavLink
            className="block mt-6 text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
            to="/greenhouse"
            >
            Go to My Green House
            </NavLink>
        </div>
    </>
  )
}

export default BuySuccessMobiles;