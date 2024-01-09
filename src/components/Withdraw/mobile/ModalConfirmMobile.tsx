import React, { useContext, useState } from "react";
import { MyAuthContext } from "context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import { Scrollbars } from 'rc-scrollbars';
import {CoinInfo} from "../../../types/common";
import warning from "../../../assets/icons/warning.png";

interface ModalPurchaseProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  address: string;
  coin?: CoinInfo;
  amount: number;
  fee: string;
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
    <button  disabled={isLoading}
             className={'btn-green !bg-green w-1/2  text-white font-bold items-center mx-auto rounded-5 py-3 px-10 mt-1 mb-3 text-base items-center'} onClick={onClick}>
      {isLoading ? (
        <>
          <FaSpinner className="spinner m-auto text-2xl" />
        </>
      ) : (
        children
      )}
    </button>
  );
};

// function ModalPurchase({ isOpen, onClose, cartList }: ModalProps) {
const ModalConfirmMobile: React.FC<ModalPurchaseProps> = (props) => {
  const { isOpen, onClose, onConfirm, isLoading, address, coin, amount, fee} = props;
  const { user } = useContext(MyAuthContext);
  const [isBalanceWarning, setIsBalanceWarning] = useState(true);

  if (!isOpen) return null;

  // const options = [
  //   { value: 'bitcoin', label: <div className="flex w-full items-center"><div><FaBitcoin style={{color: "#f7931a", height:30, width:30}} /></div><div className="pl-3"><label className="block font-bold">Bitcoin</label><label className="block text-sm">0.574</label></div></div> },
  //   { value: 'usd', label: <div className="flex w-full items-center"><div><FaDollarSign style={{color: "#f7931a", height:30, width:30}} /></div><div className="pl-3"><label className="block font-bold">USD</label><label className="block text-sm">0.819</label></div></div> }
  // ];

  const handleOnConfirm = () => {
    onConfirm();
  }

  const handleClose = () => {
    setIsBalanceWarning(true);
    onClose();
  }

  const network = (coin?: CoinInfo) => {
    let network = ''
    switch (coin?.symbol) {
      case 'BUSD': case 'binancecoin': case 'PGA_BSC': network = 'BEP-20'; break;
      case 'tether': case 'ethereum': case 'PGA_ETH': network = 'ERC-20'; break;
      default: network = "Bitcoin"; break;
    }
    return network;
  }

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
      <Scrollbars className="" style={{ width: '100%', height: '100vh' }}>
        <div className="relative flex items-center h-fit min-h-screen w-auto py-6 mx-5 max-w-3xl">
          <div className="animation-fade-in-top modal-checkout mx-auto border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none px-5 py-7 z-50">
            {/*<button*/}
            {/*  className="bg-transparent border-0 text-black leading-none font-semibold outline-none focus:outline-none absolute top-7 right-7"*/}
            {/*  onClick={handleClose}*/}
            {/*>*/}
            {/*  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">*/}
            {/*    ×*/}
            {/*  </span>*/}
            {/*</button>*/}
            {/*body*/}
            <div>
              <div className="rounded py-4 px-5 mb-1" >
                <div className="flex justify-center w-full text-center truncate mb-10">
                  <img src={warning} width={'114'}/>
                </div>
                <div className={'text-center text-xl font-bold'}>Confirm Withdrawal</div>
                <div className={'text-center text-black/70 text-md'}>Please review your transaction</div>
                <div className={'bg-black/10 mt-10'}>
                  <ul className={'px-5 py-3'}>
                    <li className={'px-2 py-2'}>
                      <span className={'font-bold'}>Amount:</span> {amount} {coin?.unit} <span className={"text-red-600"}>(withdrawal fee: {fee + ' USD'})</span>
                    </li>
                    <li className={'px-2 py-2'}>
                      <span className={'font-bold'}>address:</span> {address}
                    </li>
                    <li className={'px-2 py-2'}>
                      <span className={'font-bold'}>Network:</span> {network(coin)}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="display-flex align-middle justify-between">
                <button className="bg-transparent w-1/3 text-green border border-green font-bold items-center mx-auto rounded-5 py-3 mt-1 mb-3 text-base items-center bg-black/10 rounded" onClick={handleClose}>
                  Cancel
                </button>
                <ButtonWithSpinner isLoading={isLoading} onClick={handleOnConfirm}>
                  Confirm
                </ButtonWithSpinner>
              </div>

              {/*<Button isLoading={isLoading} onClick={handleOnConfirm}>Confirm</Button>*/}
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={handleClose}></div>
        </div>
      </Scrollbars>
      </div>
    </>
  )
}

export default ModalConfirmMobile;