import { useContext, useState } from "react";
import { useForm } from 'react-hook-form';

import { MyAuthContext } from "context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import PasswordInput from "./PasswordInput";

import api from 'utils/api';

interface LoginFormProps {
  onError: any,
  onResetPassword: () => void
}

interface ButtonWithSpinnerProps {
  isDisabled: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isDisabled,
  isLoading,
  children,
}) => {
  return (
    <button  disabled={!isDisabled || isLoading} className={`block font-bold ${(isDisabled) ? 'btn-green !bg-green' : 'btn-gray'} text-white text-center w-full`}>
      {isLoading ? (
        <>
          <FaSpinner className="spinner m-auto text-xl" />
        </>
      ) : (
        children
      )}
    </button>
  );
};

function ResetPasswordForm({ onError, onResetPassword }: LoginFormProps) {
  const { handleSubmit, register, watch, formState: { isValid, errors } } = useForm();
  const { user } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const password = watch("password", ""); // Get the value of the password field
  const passwordConfirm = watch("passwordConfirm", ""); // Get the value of the password confirm field

  const onSubmit = function (values: any) {
    console.log('login values', values);
    setIsLoading(true);
    
    if(values.password != values.passwordConfirm){
      onError('failed_password_confirm');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      api.post('auth/password/reset/', {
        user_id: user.user_id,
        password: values.password,
      }).then((res: any) => {
        const data = res.data;
        onResetPassword();
        setIsLoading(false);
      }).catch(err => {
      console.log(err);
        onError('network');
        setIsLoading(false);
      });
    });
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form w-full">
        <h1 className="text-4xl font-bold">Enter your new password</h1>
        <p className="mt-5 mb-8 text-base">Please enter your new password. You will be able to login using this password later.</p>
        <div className="mb-7">
          <label className="font-bold mb-2 block">New Password</label>
          <PasswordInput register={register} errors={errors} name="password" />
        </div>
        <div className="mb-7">
          <label className="font-bold mb-2 block">Confirm Password</label>
          <PasswordInput register={register} errors={errors} name="passwordConfirm" />
        </div>
        <ButtonWithSpinner isDisabled={isValid && password === passwordConfirm} isLoading={isLoading} >
          Save Changes</ButtonWithSpinner>
      </form>
    </>
  )
};

export default ResetPasswordForm;