import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
 
import { MyAuthContext } from "context/AuthContext";
import LoadingSpinner from "components/common/LoadingSpinner";
import 'styles/LoadingSpinner.scss'

function Signout() {
  const { setUser } = useContext(MyAuthContext);
  const [ isLoading, setIsLoading ] = useState(true);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('profile_id');
    localStorage.removeItem('username');
    localStorage.removeItem('profile_avatar');
    localStorage.removeItem('profile_country');
    localStorage.removeItem('balance');
    localStorage.removeItem('noty');
    setUser(null);
    setIsLoading(false);
    navigate('/');
  };


  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <>
        {isLoading ? <LoadingSpinner /> : <></>}
    </>
  )
}

export default Signout;