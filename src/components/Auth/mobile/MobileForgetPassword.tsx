import React, { useContext } from "react";
import { NavLink } from 'react-router-dom';

import { MyAuthContext } from "context/AuthContext";
import createSuccessIcon from 'assets/email-address.svg';
import api from "utils/api";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface ForgetPasswordProps {
  isOpen: boolean,
}

function MobileForgetPassword({ isOpen } : ForgetPasswordProps) {
  if (!isOpen) return null;
  const { user } = useContext(MyAuthContext);

  const resendResetPasswordEmail = () => {
    api.post('auth/password/forgot/', {
      email: user.email,
    }).then((res: any) => {
      console.log("resend reset password mail");
      toast.success("Reset password verify email successfully sent");
    }).catch(err => {
      toast.error("Failed to resend the verification email");
      console.log(err);
    });
  }

  return (
    <div className="text-center">
      <div className="flex mt-7">
        <img src={createSuccessIcon} className="mx-auto" style={{ height: '200px', width: '200px' }} />
      </div>
      <label className="text-3xl block font-bold mt-14">Password reset link has<br/>been sent.</label>
      <p className="mt-6 mb-14 text-xl leading-relaxed">
      Please check your email inbox, we have sent you a link to reset your password. This link will only available for 5 minutes.
      </p>
        <NavLink
            className="block w-full text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
            to='/login'
        >
            Back to Login
        </NavLink>
        <div className="pt-7 text-center">
            <label>Didn't receive an email? </label>
            <a onClick={resendResetPasswordEmail} className="cursor-pointer" >resend</a>
        </div>
    </div>
  )
}

export default MobileForgetPassword;