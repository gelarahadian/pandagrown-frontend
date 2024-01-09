import { useContext, useState, useEffect } from "react";

import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { useNavigate, useParams } from "react-router-dom";
import { MyAuthContext } from "context/AuthContext";

import AuthLayout from "components/Auth/AuthLayout";
import AuthLayoutMobile from "components/Auth/mobile/AuthLayoutMobile";
import AuthLayoutTablet from "components/Auth/tablet/AuthLayoutTablet";
import ResetPasswordForm from "components/Auth/ResetPasswordForm";
import ModalResetPassword from "components/Auth/ModalResetPassword";
import MobileResetPassword from "components/Auth/mobile/MobileResetPassword";
import { Scrollbars } from 'rc-scrollbars';
import api from 'utils/api';

import 'styles/login.scss'


function ResetPassword() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();

  const [error, setError] = useState('');
  const [showCreatedModal, setShowCreatedModal] = useState(false);
  const { setUser } = useContext(MyAuthContext);
  const { user_id, verification_code } = useParams();
  const [verify_state, setVerifyState] = useState(0);
  
  const navigate = useNavigate();

  const onCloseCreated = function () {
    setShowCreatedModal(false);
  }

  const handleGetVerfiyState = () => {

    // const formData = new FormData();
    api.post(`auth/password/verify/`, {
      user_id: user_id,
      token: verification_code,
    }).then(res => {
        const data = res.data;
        if (data.type === 'success') {
          // we receive token from server
          setVerifyState(1);
          setUser({
            user_id: data.user_id,
          });
          console.log(verify_state);
        } else {
          navigate('/login');
        }
    }).catch(err => {
      navigate('/login');
      console.log('get account info error', err);
    });
  };

  useEffect(() => {
    handleGetVerfiyState();
  }, []);

  
  if (verify_state == 0) {
    return (
      <>
        <div className="text-center pt-10">
          <h1 className="text-3xl font-bold mt-7">please wait...</h1>
        </div>
      </>
    );
  }
  
  if (isMobile) {
    return (
      <AuthLayoutMobile error={error} setError={setError}>
        {!showCreatedModal ?
        <ResetPasswordForm onError={setError} onResetPassword={() => setShowCreatedModal(true)}/>
          : ''}
        <MobileResetPassword isOpen={showCreatedModal} />
      </AuthLayoutMobile>
    )
  }

  if (isTablet) {
    return (
      <Scrollbars style={{ width: '100%', height: '100vh' }}>
        <AuthLayoutTablet error={error} setError={setError}>
          <ResetPasswordForm onError={setError} onResetPassword={() => setShowCreatedModal(true)}/>
          <ModalResetPassword isOpen={showCreatedModal} onClose={onCloseCreated} />
        </AuthLayoutTablet>
      </Scrollbars>
    )
  }

  return (
    <Scrollbars style={{ width: '100%', height: '100vh' }}>
      <AuthLayout error={error} setError={setError}>
        <ResetPasswordForm onError={setError} onResetPassword={() => setShowCreatedModal(true)}/>
        <ModalResetPassword isOpen={showCreatedModal} onClose={onCloseCreated} />
      </AuthLayout>
    </Scrollbars>
  );
}

export default ResetPassword;