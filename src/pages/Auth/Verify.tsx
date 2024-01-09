import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
 
import { useMobileContext } from "context/MobileContext";
import { MyAuthContext } from "context/AuthContext";
import modalIcon from 'assets/letter-box-winter-snow.svg';
import { Scrollbars } from 'rc-scrollbars';
import api from "utils/api";
import 'styles/LoadingSpinner.scss'
import {config} from "../../config";

function Verify() {
  const isMobile = useMobileContext();
  const { user_id, verification_code } = useParams();
  const { user, setUser } = useContext(MyAuthContext);
  const [verify_state, setVerifyState] = useState(0);
  
  const navigate = useNavigate();

  const handleGetVerfiyState = () => {

    // const formData = new FormData();
    api.post(`auth/email/verify/`, {
      user_id: user_id,
      token: verification_code,
    }).then(res => {
        const data = res.data;
        if (data.type === 'success') {
          // we receive token from server
          localStorage.setItem('token', data.token); // set token -> this means logged in
          localStorage.setItem('user_id', data.user_id); // set token -> this means logged in
          localStorage.setItem('profile_id', data.profile_id); // set token -> this means logged in
          localStorage.setItem('username', data.username); // set token -> this means logged in
          localStorage.setItem('profile_avatar', data.profile_avatar); // set token -> this means logged in
          localStorage.setItem('profile_country', data.profile_country); // set token -> this means logged in
          localStorage.setItem('balance', data.balance); // set token -> this means logged in
          localStorage.setItem('pga_balance', data.pga_balance); // set token -> this means logged in
          localStorage.setItem('noty', data.notifications); // set token -> this means logged in
          localStorage.setItem('plants', data.user_plants_count); // set token -> this means logged in
          localStorage.setItem('harvest', data.user_harvest_amount); // set token -> this means logged in
          localStorage.setItem('profit', data.user_profit); // set token -> this means logged in
          localStorage.setItem('profit_pga', data.user_profit_pga); // set token -> this means logged in
          setUser({
            token: data.token,
            user_id: data.user_id,
            profile_id: data.profile_id,
            username: data.username,
            profile_avatar: data.profile_avatar,
            profile_country: data.profile_country,
            balance: data.balance,
            pga_balance: data.pga_balance,
            noty: data.notifications,
            plants: data.user_plants_count,
            harvest: data.user_harvest_amount,
            profit: data.user_profit,
            profit_pga: data.user_profit_pga,
            botaniPrice: config.pga.botaniPrice,
            rhizoPrice: config.pga.rhizoPrice,
            silicaPrice: config.pga.silicaPrice,
            botaniProfit: config.pga.botaniProfit,
            rhizoProfit: config.pga.rhizoProfit,
            silicaProfit: config.pga.silicaProfit,
            ticket_status: '0',
            ticket_type: '',
            ticket_id: '',
            updateAgent: false,
            // name: data.name, // first name
          });
          console.log(verify_state);
          
          setVerifyState(1);
        } else {
          // show error
          setVerifyState(2);
          console.log('get account info error', data);
        }
    }).catch(err => {
      setVerifyState(2);
      console.log('get account info error', err);
    });
  };

  useEffect(() => {
    handleGetVerfiyState();
  }, []);

  
  if (isMobile) {
    return (
      <>
          {verify_state == 0 ? (
              <div className="text-center pt-10">
                <h1 className="text-3xl font-bold mt-7">please wait...</h1>
              </div>
          ) : verify_state== 1 ? (
            <div className="text-center px-10 pt-8 pb-12">
                <div>
                    <div className="flex">
                    <img src={modalIcon} className="mx-auto" style={{ height: '256px', width: '256px' }} />
                    </div>
                    <h1 className="text-3xl font-bold mt-7">Congratulations, Verification Success!!</h1>
                    <p className="mt-5 mb-14 text-xl leading-relaxed">
                    Thank you.
                    </p>
                </div>
                <NavLink
                    className="block w-full text-center outline-none focus:outline-none ease-linear transition-all duration-150 py-3 px-10 rounded bg-green text-white" to="/account"
                >
                    Setup Account
                </NavLink>
                <div className="mt-3">
                <a href="/cloneshop" className="text-black/80">skip this for now</a>
                </div>
            </div>
          ) : (  
            <div className="text-center px-10 pt-8 pb-12">
                <div>
                    <div className="flex">
                    <img src={modalIcon} className="mx-auto" style={{ height: '256px', width: '256px' }} />
                    </div>
                    <h1 className="text-3xl font-bold mt-7">Oops! Email Verification Failed!</h1>
                    <p className="mt-5 mb-14 text-xl leading-relaxed">
                    You’ll need to verify your email before you can start investing on our platform. Please check your inbox or spam for the verification link. Thank you.
                    </p>
                </div>
                <NavLink
                    className="block w-full text-center outline-none focus:outline-none ease-linear transition-all duration-150 py-3 px-10 rounded bg-green text-white" to='/login'
                >
                    Go to Login
                </NavLink>
            </div> 
          )} 
      </>
    )
  }

  return (
    <>
      <Scrollbars style={{ width: '100%', height: '100vh' }}>
        {verify_state == 0 ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold mt-7">please wait...</h1>
            </div>
        ) : verify_state== 1 ? (
          <div className="text-center">
              <div>
                  <div className="flex">
                  <img src={modalIcon} className="mx-auto" style={{ height: '256px', width: '256px' }} />
                  </div>
                  <h1 className="text-3xl font-bold mt-7">Congratulations, Verification Success!!</h1>
                  <p className="mt-5 !mb-14 text-xl leading-relaxed">
                  Thank you.
                  </p>
              </div>
              <NavLink
                  className="text-center outline-none focus:outline-none ease-linear transition-all duration-150 py-3 px-10 rounded bg-green text-white hover:text-white" to="/account"
              >
                  Setup Account
              </NavLink>
              <div className="pt-6">
                <NavLink to="/cloneshop" className="text-black/80">skip this for now</NavLink>
              </div>
          </div>
        ) : (          
          <div className="text-center">
              <div>
                  <div className="flex">
                  <img src={modalIcon} className="mx-auto" style={{ height: '256px', width: '256px' }} />
                  </div>
                  <h1 className="text-3xl font-bold mt-7">Oops! Email Verification Failed!</h1>
                  <p className="mt-5 !mb-14 text-xl leading-relaxed">
                  You’ll need to verify your email before you can start investing on our platform. Please check your inbox or spam for the verification link. Thank you.
                  </p>
              </div>
              <NavLink
                  className="text-center outline-none focus:outline-none ease-linear transition-all duration-150 py-3 px-10 rounded bg-green text-white hover:text-white" to='/login'
              >
                  Go to Login
              </NavLink>
          </div>
        )} 
      </Scrollbars>
    </>
  )
}

export default Verify;