import { useState } from "react";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import AuthLayout from "components/Auth/AuthLayout";
import AuthLayoutMobile from "components/Auth/mobile/AuthLayoutMobile";
import AuthLayoutTablet from "components/Auth/tablet/AuthLayoutTablet";
import LoginForm from "components/Auth/LoginForm";
import ModalNotVerified from "components/Auth/ModalNotVerified";
import NotVerified from "components/Auth/mobile/NotVerified";
import { Scrollbars } from 'rc-scrollbars';

import 'styles/login.scss'


function Login() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();

  const [error, setError] = useState('');
  const [showCreatedModal, setShowCreatedModal] = useState(false);
  
  const onCloseCreated = function () {
    setShowCreatedModal(false);
  }

  if (isMobile) {
    return (
      <AuthLayoutMobile error={error} setError={setError}>
        {!showCreatedModal ?
        <LoginForm onError={setError} onVerify={() => setShowCreatedModal(true)}/>
          : ''}
        <NotVerified isOpen={showCreatedModal} />
      </AuthLayoutMobile>
    )
  }

  if (isTablet) {
    return (
      <AuthLayoutTablet error={error} setError={setError}>
        {!showCreatedModal ?
        <LoginForm onError={setError} onVerify={() => setShowCreatedModal(true)}/>
          : ''}
        <NotVerified isOpen={showCreatedModal} />
      </AuthLayoutTablet>
    )
  }

  if (isMobile) {
    return (
      <AuthLayoutMobile error={error} setError={setError}>
        {!showCreatedModal ?
        <LoginForm onError={setError} onVerify={() => setShowCreatedModal(true)}/>
          : ''}
        <NotVerified isOpen={showCreatedModal} />
      </AuthLayoutMobile>
    )
  }

  return (
    <Scrollbars style={{ width: '100%', height: '100vh' }}>
      <AuthLayout error={error} setError={setError}>
        <LoginForm onError={setError} onVerify={() => setShowCreatedModal(true)}/>
        <ModalNotVerified isOpen={showCreatedModal} onClose={onCloseCreated} />
      </AuthLayout>
    </Scrollbars>
  );
}

export default Login;