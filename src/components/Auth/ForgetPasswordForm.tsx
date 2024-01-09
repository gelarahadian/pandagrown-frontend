import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyAuthContext } from "context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import api from "utils/api";
import "react-toastify/dist/ReactToastify.css";

interface ForgetPasswordFormProps {
  onError: any;
  onForgetPassword: () => void;
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
    <button
      disabled={!isDisabled || isLoading}
      className={`block font-bold ${
        isDisabled ? "btn-green !bg-green" : "btn-gray"
      } text-white text-center w-full`}
    >
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

function ForgetPasswordForm({
  onError,
  onForgetPassword,
}: ForgetPasswordFormProps) {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm();
  const { setUser } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = function (values: any) {
    console.log("login values", values);
    setIsLoading(true);

    setTimeout(() => {
      api
        .post("auth/password/forgot/", {
          email: values.email,
        })
        .then((res: any) => {
          const data = res.data;
          console.log(data);
          if (data.type == "success") {
            onForgetPassword();
            setUser({
              email: values.email,
            });
          } else {
            toast.error(data.detail);
            // onForgetPassword();
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          onError("network");
          setIsLoading(false);
        });
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form w-full">
        <h1 className="text-4xl font-bold text-white">Forget Password</h1>
        <p className="mt-4 mb-8 text-base text-white">
          please enter your email in the box below. We will send you password
          reset link in your email.
        </p>
        <div className="mb-7">
          <label className="font-bold mb-2 block text-white">Email</label>
          <input
            type="email"
            className={`block w-full ${errors.email ? "error" : ""} green`}
            {...register("email", {
              required: "Required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </div>
        <ButtonWithSpinner isDisabled={isValid} isLoading={isLoading}>
          Request Reset Password
        </ButtonWithSpinner>
      </form>
    </>
  );
}

export default ForgetPasswordForm;
