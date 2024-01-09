import { useContext, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import PasswordInput from "./PasswordInput";
import { MyAuthContext } from "context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import { config } from "config";

import api from "utils/api";

interface LoginFormProps {
  onError: any;
  onVerify: () => void;
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

function LoginForm({ onError, onVerify }: LoginFormProps) {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm();
  const { user, setUser } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const captchaRef = useRef<ReCAPTCHA | null>(null);

  const navigate = useNavigate();

  const onSubmit = function (values: any) {
    console.log("login values", values);
    setIsLoading(true);

    api
      .post("auth/login/", {
        email: values.email,
        password: values.password,
      })
      .then((res: any) => {
        const data = res.data;
        if (data.type === "success") {
          // we receive token from server
          localStorage.setItem("token", data.token); // set token -> this means logged in
          localStorage.setItem("user_id", data.user_id); // set token -> this means logged in
          localStorage.setItem("profile_id", data.profile_id); // set token -> this means logged in
          localStorage.setItem("username", data.username); // set token -> this means logged in
          localStorage.setItem("profile_avatar", data.profile_avatar); // set token -> this means logged in
          localStorage.setItem("profile_country", data.profile_country); // set token -> this means logged in
          localStorage.setItem("balance", data.balance); // set token -> this means logged in
          localStorage.setItem("pga_balance", data.pga_balance); // set token -> this means logged in
          localStorage.setItem("noty", data.notifications); // set token -> this means logged in
          localStorage.setItem("plants", data.user_plants_count); // set token -> this means logged in
          localStorage.setItem("harvest", data.user_harvest_amount); // set token -> this means logged in
          localStorage.setItem("profit", data.user_profit); // set token -> this means logged in
          localStorage.setItem("profit_pga", data.user_profit_pga); // set token -> this means logged in
          setUser({
            email: values.email,
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
            ticket_status: "0",
            ticket_type: "",
            ticket_id: "",
            updateAgent: false,
            // name: data.name, // first name
          });

          navigate("/dashboard");
        } else {
          // show error
          onError("login");
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
            // alert(responseData.message);
            if (responseData.message == "User is not active") {
              onError("login_inactive");
              localStorage.setItem("user_id", responseData.user_id); // set token -> this means logged in
              setUser({
                user_id: responseData.user_id,
                // name: data.name, // first name
              });
              onVerify();
            } else if (responseData.message == "Invalid credentials") {
              onError("login");
            } else if (responseData.message == "User is suspended") {
              onError("login_block");
            } else {
              onError("login_error");
            }
          } else {
            onError("login_error");
          }
        } else {
          // Handle other types of errors
          onError("network");
        }
        setIsLoading(false);
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
      <form onSubmit={handleSubmit(onSubmit)} className="login-form w-full">
        <h1 className="text-4xl text-white font-bold">Log in</h1>
        <p className="mt-2 mb-8 text-base text-white">
          Don't have an account?
          <NavLink className="text-green ml-1" to="/signup">
            Sign up
          </NavLink>
          .
        </p>
        <div className="mb-7">
          <label className="font-medium mb-2 block text-white">Email</label>
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
        <div className="mb-7">
          <label className="font-medium mb-2 block text-white">Password</label>
          <PasswordInput register={register} errors={errors} name="password" />
        </div>
        <div className="mb-7">
          <label className="flex text-white">
            <input type="checkbox" className="my-auto mr-4 " />
            Remember me
          </label>
        </div>
        <div className="mb-7">
          <ReCAPTCHA
            sitekey={config.other.RECAPCHA_SITE_KEY}
            ref={captchaRef}
            onChange={onChange}
          />
        </div>
        <ButtonWithSpinner
          isDisabled={isValid && isHuman}
          isLoading={isLoading}
        >
          Login
        </ButtonWithSpinner>
        <div className="mt-7">
          <label className="text-white">Forget Password? </label>
          <NavLink className="text-green ml-1" to="/forget-password">
            click here
          </NavLink>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
