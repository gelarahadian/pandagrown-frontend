import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { MyAuthContext } from "context/AuthContext";
import modalIcon from 'assets/letter-box-winter-snow.svg';
import api from "utils/api";
import { FaSpinner } from "react-icons/fa";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  isOpen: boolean,
  onClose: () => void,
};

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
    <button  disabled={isLoading} className={`btn-green !bg-green text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150`} onClick={onClick}>
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

function ModalNotVerified({ isOpen, onClose }: ModalProps) {
  const { user } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const resendVerifyEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      api.post('auth/email/verify/request/', {
        user_id: user.user_id,
      }).then((res: any) => {
        console.log("resend verify mail");
        const data = res.data;
        if( data.type == "success" ) {
          toast.success("Verify email successfully sent");
        } else {
          toast.error(data.detail);
        }
        setIsLoading(false);
      }).catch(err => {
        console.log(err);
        setIsLoading(false);
        toast.error("Failed to resend the verification email");
      });
    });
  }

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
                <img src={modalIcon} className="mx-auto" style={{ height: '256px', width: '256px' }} />
              </div>
              <h1 className="text-3xl font-bold mt-7">Please verify your account.</h1>
              <p className="mt-5 mb-14 text-xl leading-relaxed">
                You’ll need to verify your email before you can start investing on our platform. Please check your inbox or spam for the verification link. Thank you.
              </p>
            </div>
            <ButtonWithSpinner isLoading={isLoading} onClick={resendVerifyEmail}>
            Resend Verify Email</ButtonWithSpinner>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={onClose}></div>
        </div>
      </div>
    </>
  )
}

export default ModalNotVerified;