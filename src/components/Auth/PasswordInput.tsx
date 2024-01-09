import React, { useState } from "react";

interface PasswordInputProps {
  register: any,
  errors: any,
  name: any,
}

function PasswordInput({ register, errors, name }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = function () {
    setShowPassword(!showPassword);
  }

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        className={`block w-full ${errors.password ? 'error' : ''} green`}
        {...register(name, {
          required: "Required",
          pattern: {
            value: /[a-zA-Z0-9!@#$%^&*]{1,20}$/, ///^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
            message: "Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol."
          }
        })}
      />
      <button type="button" onClick={toggleShow} className="absolute top-4 right-4 text-green">
        {showPassword ? 'hide' : 'show'}
      </button>
    </div>
  )
}

export default PasswordInput;