import { useState, ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";

import PasswordInput from "./PasswordInput";
import { Link, NavLink } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import { useAuthContext } from "context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import { config } from "config";
import api from "utils/api";

interface SignupFormProps {
  onError: any;
  referrId: string;
  onSuccess: () => void;
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

function SignupForm({ onError, referrId, onSuccess }: SignupFormProps) {
  const { setUser } = useAuthContext();
  const [isChecked, setIsChecked] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const captchaRef = useRef<ReCAPTCHA | null>(null);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const onSubmit = function (values: any) {
    setIsLoading(true);
    const signup_url = referrId ? `auth/signup/${referrId}/` : `auth/signup/`;
    setTimeout(() => {
      api
        .post(`${signup_url}`, {
          name: values.name,
          email: values.email,
          password: values.password,
        })
        .then((res: any) => {
          const data = res.data;
          if (data.type === "success") {
            // login success
            setUser({
              email: values.email,
              name: values.name,
              user_id: data.user_id,
            });
            localStorage.setItem("user_id", data.user_id); // set token -> this means logged in
            localStorage.setItem("profile_id", data.profile_id); // set token -> this means logged in

            onSuccess();
          } else {
            onError("signup_error");
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            const responseData = err.response.data;
            // Handle the response data in case of an error
            // You can access the properties of the responseData object

            if (responseData.type == "failure") {
              if (
                responseData.detail ==
                "A user with that email address already exist!"
              ) {
                onError("signup");
              } else if (
                responseData.detail == "username or email cannot be empty"
              ) {
                onError("signup_empty");
              } else {
                onError("signup_error");
              }
            } else {
              onError("signup_error");
            }
          } else {
            // Handle other types of errors
            onError("network");
          }
          setIsLoading(false);
        });
    });
  };

  function onChange(value: any) {
    console.log("Captcha value:", value);
    if (value == null) {
      return;
    }
    // captchaRef.current?.reset();
    setIsHuman(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form w-full ">
        <h1 className="text-4xl text-white font-bold">Sign Up</h1>
        <p className="mt-2 mb-6 text-base text-white">
          Already have an account?
          <NavLink className="text-green ml-1" to="/login">
            Log in
          </NavLink>
          .
        </p>
        <div className="mb-5">
          <label className="font-medium mb-2 block text-white">Name</label>
          <input
            type="text"
            className={`block w-full ${errors.name ? "error" : ""} green`}
            {...register("name", {
              required: "Required",
              pattern: {
                value: /[A-Z0-9._]/i,
                message: "Invalid name",
              },
            })}
          />
        </div>
        <div className="mb-5">
          <label className="font-medium mb-2 text-white block">Email</label>
          <input
            type="email"
            className={`block w-full ${errors.email ? "error" : ""} green`}
            {...register("email", {
              required: "Require",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </div>
        <div className="mb-5">
          <label className="font-medium mb-2 text-white block">Password</label>
          <PasswordInput register={register} errors={errors} name="password" />
        </div>
        <div className="mb-5">
          <label className="flex">
            <input
              type="checkbox"
              className="mr-4 bg-red-500"
              checked={isChecked}
              onChange={handleCheckboxChange}
              style={{ marginTop: "3px" }}
            />
            <span className="text-white">
              I have read and accept{" "}
              <Link className="mx-1" to="/terms">
                Terms and Conditions
              </Link>
              {/* I agree to Platform <NavLink className="mx-1" to="terms">Terms of Services</NavLink> and <NavLink className="ml-1" to="privacy">Privacy Policies</NavLink>. */}
            </span>
          </label>
        </div>
        <div className="mb-5">
          <ReCAPTCHA
            sitekey={config.other.RECAPCHA_SITE_KEY}
            ref={captchaRef}
            onChange={onChange}
          />
        </div>
        <ButtonWithSpinner
          isDisabled={isValid && isChecked && isHuman}
          isLoading={isLoading}
        >
          Create my account
        </ButtonWithSpinner>
      </form>
    </>
  );
}

export default SignupForm;
