import { NavLink } from 'react-router-dom';
import verifySuccessIcon from 'assets/checked-success.svg';

interface VerifySuccessProps {
  isOpen: boolean,
}

function VerifySuccess({ isOpen } : VerifySuccessProps) {
  if (!isOpen) return null;
  
  return (
    <div className="text-center">
      <div className="flex mt-7">
        <img src={verifySuccessIcon} className="mx-auto" style={{ height: '208px', width: '208px' }} />
      </div>
      <label className="text-3xl block font-bold mt-14">You are all set, your account has been verified.</label>
      <p className="mt-6 mb-14 text-xl leading-relaxed">
        It’s time for you to invest and grow your money with our platform. Please keep all of your credentials safe, and don’t share it with anyone. Happy invest!
      </p>
      <NavLink
        className="w-full block btn-green outline-none focus:outline-none ease-linear transition-all duration-150"
        to="/login"
      >
        Login
      </NavLink>
    </div>
  )
}

export default VerifySuccess;