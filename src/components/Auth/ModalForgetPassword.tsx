import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { MyAuthContext } from "context/AuthContext";
import modalIcon from 'assets/email-address.svg';
import api from "utils/api";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  isOpen: boolean,
  onClose: () => void,
};

function ModalForgetPassword({ isOpen, onClose }: ModalProps) {
  const { user } = useContext(MyAuthContext);

  const resendResetPasswordEmail = () => {
    api.post('auth/password/forgot/', {
      email: user.email,
    }).then((res: any) => {
      console.log("resend reset password mail");
      const data = res.data;
      if( data.type == "success" ) {
        toast.success("Reset password verify email successfully sent");
      } else {
        toast.error(data.detail);
      }
    }).catch(err => {
      console.log(err);
      toast.error("Failed to resend the verification email");
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
                <img src={modalIcon} className="mx-auto" style={{ height: '208px', width: '208px', marginTop: '42px' }} />
              </div>
              <h1 className="text-3xl font-bold mt-7">Password reset link has<br/>been sent</h1>
              <p className="mt-5 mb-14 text-xl leading-relaxed">
                Please check your email inbox, we have sent <br/>you a link to reset your password. This link <br/>will only available for 5 minutes.
              </p>
            </div>
            <NavLink
              className="text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
              to='/login'
            >
              Back to Login
            </NavLink>
            <div className="pt-7 text-center">
                <label>Didn't receive an email? </label>
                <a className="cursor-pointer" onClick={resendResetPasswordEmail}>resend</a>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" onClick={onClose}></div>
        </div>
      </div>
    </>
  )
}

export default ModalForgetPassword;