import { useEffect, useState, useRef } from 'react';
import { CiWarning } from 'react-icons/ci';
import { MdClose } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

import { useMobileContext } from 'context/MobileContext';
import { useTabletContext } from 'context/TabletContext';

interface ErrorMsgProps {
  error: string,
  handleClose: () => void,
}

function ErrorMsg({ error, handleClose }: ErrorMsgProps) {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const [content, setContent] = useState<any>(null);
  const [timer, setTimer] = useState<any>(null);
  const timerRef = useRef<any>(null);

  const startTimer = () => {
    // Clear the previous timer if it exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Create the timer
    const interval = setInterval(() => {
      handleClose();
    }, 5000);

    // Store the timer ID in state and ref
    setTimer(interval);
    timerRef.current = interval;
  };

  const changeContent = () => {
    startTimer();
    if (error == 'login') {
      setContent('Your email or password is incorrect.');
    } else if (error == 'signup') {
      setContent(<label>
        The email you enter has been used.
        <NavLink className="text-white ml-1 underline" to="/login">Login</NavLink>
      </label>);
    } else if (error == 'signup_empty') {
      setContent('Username or email cannot be empty.');
    } else if (error == 'signup_error') {
        setContent('Signup faied.');
    } else if (error == 'login_inactive') {
        setContent('Your account is not verified.');
    } else if (error == 'login_error') {
      setContent('Login faied.');
    } else if (error == 'login_block') {
      setContent('Your account is suspended!');
    } else if (error == 'network') {
      setContent('Network error.');
    } else if (error == 'signup_empty') {
      setContent('Please insert email and password.');
    } else if (error == 'failed_password_confirm') {
      setContent('Confirm password is wrong.');
    } else{
      setContent('');
    }
  }

  useEffect(() => {
    changeContent();
  }, [error]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  if (isTablet) {
    return (
      <div onClick={handleClose} className='absolute w-88 top-5 right-10 text-white bg-red py-3 px-5 rounded-5 font-bold flex cursor-pointer'>
        <CiWarning size={20} className='mr-2' style={{marginTop: '3px'}} />
        {content}
      </div>
    )
  }

  return (
    <div onClick={handleClose} className='text-white bg-red py-3 px-5 rounded-5 w-full font-bold flex cursor-pointer'>
      <CiWarning size={20} className='mr-2' style={{marginTop: '3px'}} />
      {content}
      {isMobile ? '' :
        <button onClick={handleClose} className='ml-auto my-auto'>
          <MdClose size={20} />
        </button>
      }

    </div>
  )
}

export default ErrorMsg;