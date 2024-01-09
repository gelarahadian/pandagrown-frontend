import React, { useContext, useState } from "react";
import { NavLink } from 'react-router-dom';

import { MyAuthContext } from "context/AuthContext";
import createSuccessIcon from 'assets/letter-box-winter-snow.svg';
import api from "utils/api";
import { FaSpinner } from "react-icons/fa";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface CreateSuccessProps {
  isOpen: boolean,
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
    <button  disabled={isLoading} className={`w-full block btn-green !bg-green text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150`} onClick={onClick}>
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

function CreateSuccess({ isOpen } : CreateSuccessProps) {
  const { user } = useContext(MyAuthContext);
  if (!isOpen) return null;
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

  return (
    <div className="text-center">
      <div className="flex mt-7">
        <img src={createSuccessIcon} className="mx-auto" style={{ height: '256px', width: '256px' }} />
      </div>
      <label className="text-3xl block font-bold mt-14">Congratulations, your account has been created.</label>
      <p className="mt-6 mb-14 text-xl leading-relaxed">
        You’ll need to verify your email before you can start investing on our platform. Please check your inbox or spam for the verification link. Thank you.
      </p>
      <ButtonWithSpinner isLoading={isLoading} onClick={resendVerifyEmail}>
      Resend Verify Email</ButtonWithSpinner>
    </div>
  )
}

export default CreateSuccess;