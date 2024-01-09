import { styled } from "styled-components";
import { Link } from "react-router-dom";

import { MyAuthContext } from "context/AuthContext";
import { useContext } from "react";
import { dark } from "@mui/material/styles/createPalette";
const MyGreenButton = ({
  text,
  icon,
  dark = false,
  className,
}: {
  text: string;
  icon?: any;
  dark?: boolean;
  className?: string;
}) => {
  const { user } = useContext(MyAuthContext);
  return (
    <GreenButton
      to={user?.token ? "/greenhouse" : "/login"}
      className={`${className} `}
    >
      <div className={`${dark ? " bg-[#041d04]" : "bg-[#059033]"}`}>
        {icon && <img src={icon} alt="maple" />}
        {text}
      </div>
    </GreenButton>
  );
};

const GreenButton = styled(Link)`
  div {
    position: relative;
    margin: 3px;
    padding: 15px 24px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 999px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  div::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transition: width 0.3s, height 0.3s, opacity 0.3s;
  }

  div:hover {
    background-color: #036a25;
  }

  div:hover::before {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  // div:hover {
  //   background: #036a25;
  // }

  & TopBar {
    margin-left: 110px;
  }

  &.wide {
    div {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
`;

export default MyGreenButton;
