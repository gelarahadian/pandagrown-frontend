import { NavLink } from 'react-router-dom';

import createSuccessIcon from 'assets/email-address.svg';

interface ResetPasswordProps {
  isOpen: boolean,
}

function MobileResetPassword({ isOpen } : ResetPasswordProps) {
  if (!isOpen) return null;

  return (
    <div className="text-center">
      <div className="flex mt-7">
        <img src={createSuccessIcon} className="mx-auto" style={{ height: '200px', width: '200px' }} />
      </div>
      <label className="text-3xl block font-bold mt-14">Password has been changed.</label>
      <p className="mt-6 mb-14 text-xl leading-relaxed">
      Your password has been changed. You will be able to use your new password to access your account.
      </p>
        <NavLink
            className="block w-full text-center btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
            to='/login'
        >
            Login
        </NavLink>
    </div>
  )
}

export default MobileResetPassword;