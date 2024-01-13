import { styled } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";

import MobileFloatButton from "components/common/MobileFloatButton";
import MyGreenButton from "components/Landing/Home/MyGreenButton";
import LanguageSelect from "components/Landing/LanguageSelect";
import logo from "assets/logo-sign2.png";
import logo_white from "assets/logo-sign.png";
import mlogo from "assets/logo-main.svg";
import { MyAuthContext } from "context/AuthContext";
import { useContext } from "react";
import joinIcon from "assets/icons/logo-join.png";

const Topbar = ({
  setShowSidebar,
}: {
  setShowSidebar: (flag: boolean) => any;
}) => {
  const location = useLocation();
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);

  const isTwoNavs =
    location.pathname.includes("/term") ||
    location.pathname.includes("/whitepaper") ||
    location.pathname.includes("/lisensi");

  const isThreeNavs =
    location.pathname.includes("/how") || location.pathname.includes("/faq");

  if (isMobile) {
    return (
      <AbsContainer>
        <Container className="items-center">
          <Link to="/">
            <img src={isTwoNavs ? logo_white : logo}></img>
          </Link>
          <div className="mobile-btn-side ml-auto">
            <MobileFloatButton onClick={() => setShowSidebar(true)} />
          </div>
        </Container>
      </AbsContainer>
    );
  }

  if (isTablet) {
    return (
      <AbsContainer>
        <Container
          className={`items-center ${isThreeNavs && "flex justify-between"} ${
            isTwoNavs && "text-white"
          }`}
        >
          <Link to="/">
            <img className="logo" src={isTwoNavs ? logo_white : logo}></img>
          </Link>
          {isThreeNavs && (
            <div className="navs">
              <Link
                to="/"
                className={location.pathname == "/" ? "active" : "text-black"}
              >
                Home
              </Link>
              <Link
                to="/how"
                className={
                  location.pathname == "/how" ? "active" : "text-black"
                }
              >
                How it works
              </Link>
              <Link
                to="/faq"
                className={
                  location.pathname == "/faq" ? "active" : "text-black"
                }
              >
                FAQ
              </Link>
            </div>
          )}
          <div className="right">
            <div className="navs">
              {isTwoNavs && (
                <Link
                  to="/"
                  className={`${
                    location.pathname == "/" ? "active" : ""
                  } text-white`}
                >
                  Home
                </Link>
              )}
              {/* <Link to="/signup" className="-mt-8">
                Sign Up
              </Link> */}
              {isThreeNavs ? (
                <MyGreenButton text="Join Now" icon={joinIcon} dark />
              ) : (
                <MyGreenButton text="Login" light />
              )}
              <Language>
                <LanguageSelect isSide={false} bgWhite={isTwoNavs} />
              </Language>
            </div>
          </div>
        </Container>
      </AbsContainer>
    );
  }

  return (
    <AbsContainer>
      <Container
        className={`items-center ${isThreeNavs && "flex justify-between"} ${
          isTwoNavs && "text-white"
        }`}
      >
        <Link to="/">
          <img className="logo" src={isTwoNavs ? logo_white : logo}></img>
        </Link>
        {isThreeNavs && (
          <div className="navs">
            <Link
              to="/"
              className={location.pathname == "/" ? "active" : "text-black"}
            >
              Home
            </Link>
            <Link
              to="/how"
              className={location.pathname == "/how" ? "active" : "text-black"}
            >
              How it works
            </Link>
            <Link
              to="/faq"
              className={location.pathname == "/faq" ? "active" : "text-black"}
            >
              FAQ
            </Link>
          </div>
        )}
        <div className="right">
          <div className="navs">
            {!user?.token ? (
              <>
                {isTwoNavs && (
                  <Link
                    to="/"
                    className={`${
                      location.pathname == "/" ? "active" : ""
                    } text-white`}
                  >
                    Home
                  </Link>
                )}

                {!isThreeNavs && !isTwoNavs && (
                  <>
                    <Link
                      to="/"
                      className={`${
                        location.pathname == "/" ? "active" : ""
                      } text-black`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/lisensi"
                      className={`${
                        location.pathname == "/lisensi" ? "active" : ""
                      } text-black`}
                    >
                      Lisensi
                    </Link>
                    <Link
                      to="/whitepaper"
                      className={`${
                        location.pathname == "/whitepaper" ? "active" : ""
                      } text-black`}
                    >
                      Whitepaper
                    </Link>
                    <Link
                      to="/terms"
                      className={`${
                        location.pathname == "/terms" ? "active" : ""
                      } text-black`}
                    >
                      Terms
                    </Link>
                    <Link
                      to="/how"
                      className={`${
                        location.pathname == "/how" ? "active" : ""
                      } text-black`}
                    >
                      How it works
                    </Link>
                    <Link
                      to="/faq"
                      className={`${
                        location.pathname == "/faq" ? "active" : ""
                      } text-black`}
                    >
                      FAQ
                    </Link>
                    <Link to="/signup" className="text-black">
                      Sign up
                    </Link>
                  </>
                )}
                {isThreeNavs ? (
                  <MyGreenButton text="Join Now" icon={joinIcon} dark />
                ) : (
                  <MyGreenButton
                    text="Login"
                    light={isTwoNavs}
                    dark={!isTwoNavs}
                  />
                )}
              </>
            ) : (
              <MyGreenButton text="MyGreenHouse" />
            )}
            <Language>
              <LanguageSelect isSide={false} bgWhite={isTwoNavs} />
            </Language>
          </div>
        </div>
      </Container>
    </AbsContainer>
  );
};

export default Topbar;

const AbsContainer = styled.div`
  position: absolute;
  width: 100%;
  padding: 24px 24px 0;
`;

const Container = styled.div`
  position: relative; // because of z-index
  z-index: 3;

  img.logo {
    height: 24px;
    margin: auto 0;
  }

  .right {
    display: flex;
    justify-content: end;
  }
  .navs {
    display: flex;
    font-size: 20px;

    // @media (min-width: 1280px) {
    //   margin-right: 110px;
    // }

    // @media (min-width: 593px) and (max-width: 1279px) {
    //   margin-right: 55px;
    // }

    @media (max-width: 592px) {
      display: none;
    }

    a {
      margin: auto 0 auto 81px;
    }
    a.active {
      font-weight: bold;
    }
    a:first-child {
      margin-left: 0;
    }
  }
`;

const Language = styled.div`
  margin: auto;
  margin-left: 20px;
`;
