import { useState } from "react";

import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { useParams } from "react-router-dom";
import AuthLayout from "components/Auth/AuthLayout";
import AuthLayoutMobile from "components/Auth/mobile/AuthLayoutMobile";
import AuthLayoutTablet from "components/Auth/tablet/AuthLayoutTablet";
import SignupForm from "components/Auth/SignupForm";
import ModalCreated from "components/Auth/ModalCreated";
// import ModalVerified from "components/Auth/ModalVerified";

import CreateSuccess from "components/Auth/mobile/CreateSuccess";
import { Scrollbars } from 'rc-scrollbars';

import 'styles/login.scss'


function Signup() {
  const { referr_id } = useParams();
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();

  const [error, setError] = useState('');
  const [showCreatedModal, setShowCreatedModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  const onCloseCreated = function () {
    setShowCreatedModal(false);
  }

  const onCloseVerified = function () {
    setShowVerifiedModal(false);
  }

  if (isMobile) {
    return (
      <AuthLayoutMobile error={error} setError={setError}>
        {!showCreatedModal ?
          <SignupForm onError={setError} onSuccess={() => setShowCreatedModal(true)} referrId={referr_id? referr_id : ''} />
          : ''}
        <CreateSuccess isOpen={showCreatedModal} />
        {/* <VerifySuccess isOpen={showVerifiedModal} /> */}
      </AuthLayoutMobile>
    )
  }

  if (isTablet) {
    return (
      <Scrollbars style={{ width: '100%', height: '100vh' }}>
        <AuthLayoutTablet error={error} setError={setError}>
          <SignupForm onError={setError} onSuccess={() => setShowCreatedModal(true)} referrId={referr_id? referr_id : ''} />
          <ModalCreated isOpen={showCreatedModal} onClose={onCloseCreated} />
          {/* <ModalVerified isOpen={showVerifiedModal} onClose={onCloseVerified} /> */}
        </AuthLayoutTablet>
      </Scrollbars>
    )
  }
  
  return (
    <Scrollbars style={{ width: '100%', height: '100vh' }}>
      <AuthLayout error={error} setError={setError}>
        <SignupForm onError={setError} onSuccess={() => setShowCreatedModal(true)} referrId={referr_id? referr_id : ''} />
        <ModalCreated isOpen={showCreatedModal} onClose={onCloseCreated} />
        {/* <ModalVerified isOpen={showVerifiedModal} onClose={onCloseVerified} /> */}
      </AuthLayout>
    </Scrollbars>
  );
}

export default Signup;