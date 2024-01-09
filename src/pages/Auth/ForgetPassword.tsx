import { useState } from "react";

import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";

import AuthLayout from "components/Auth/AuthLayout";
import AuthLayoutMobile from "components/Auth/mobile/AuthLayoutMobile";
import AuthLayoutTablet from "components/Auth/tablet/AuthLayoutTablet";
import ForgetPasswordForm from "components/Auth/ForgetPasswordForm";
import ModalForgetPassword from "components/Auth/ModalForgetPassword";
import MobileForgetPassword from "components/Auth/mobile/MobileForgetPassword";
import { Scrollbars } from 'rc-scrollbars';

import 'styles/login.scss'


function ForgetPassword() {
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
        <ForgetPasswordForm onError={setError} onForgetPassword={() => setShowCreatedModal(true)}/>
          : ''}
        <MobileForgetPassword isOpen={showCreatedModal} />
      </AuthLayoutMobile>
    )
  }

  if (isTablet) {
    return (
      <Scrollbars style={{ width: '100%', height: '100vh' }}>
        <AuthLayoutTablet error={error} setError={setError}>
          <ForgetPasswordForm onError={setError} onForgetPassword={() => setShowCreatedModal(true)}/>
          <ModalForgetPassword isOpen={showCreatedModal} onClose={onCloseCreated} />
        </AuthLayoutTablet>
      </Scrollbars>
    )
  }
  
  return (
    <Scrollbars style={{ width: '100%', height: '100vh' }}>
      <AuthLayout error={error} setError={setError}>
        <ForgetPasswordForm onError={setError} onForgetPassword={() => setShowCreatedModal(true)}/>
        <ModalForgetPassword isOpen={showCreatedModal} onClose={onCloseCreated} />
      </AuthLayout>
    </Scrollbars>
  );
}

export default ForgetPassword;