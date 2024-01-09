import { styled } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";

import MobileFloatButton from "components/common/MobileFloatButton";
import MyGreenButton from "components/Landing/Home/MyGreenButton";
import LanguageSelect from "components/Landing/LanguageSelect";
import logo from "assets/logo-sign2.png";
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

  const isThreeNavs =
    location.pathname.includes("/how") || location.pathname.includes("/faq");

  if (isMobile) {
    return (
      <AbsContainer>
        <Container className="items-center">
          <Link to="/">
            <img src={mlogo} style={{ width: "68px" }}></img>
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
        <Container className="items-center">
          <Link to="/">
            <img className="logo" src={logo}></img>
          </Link>
          <div className="right">
            <div className="navs">
              {/* <Link to="/how" className={location.pathname == '/how' ? "active" : ''}>
              How it works</Link>
            <Link to="/faq" className={location.pathname == '/faq' ? "active" : ''}>
              FAQ</Link> */}
              <Link to="/signup" className="-mt-8">
                Sign Up
              </Link>
              <MyGreenButton text="Login" dark />
              <Language>
                <LanguageSelect isSide={false} />
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
        className={`items-center ${isThreeNavs && "flex justify-between"}`}
      >
        <Link to="/">
          <img className="logo" src={logo}></img>
        </Link>
        {isThreeNavs && (
          <div className="navs">
            <Link to="/" className={location.pathname == "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/how"
              className={location.pathname == "/how" ? "active" : ""}
            >
              How it works
            </Link>
            <Link
              to="/faq"
              className={location.pathname == "/faq" ? "active" : ""}
            >
              FAQ
            </Link>
          </div>
        )}
        <div className="right">
          <div className="navs">
            {!user?.token ? (
              <>
                {!isThreeNavs && (
                  <>
                    <Link
                      to="/"
                      className={location.pathname == "/" ? "active" : ""}
                    >
                      Home
                    </Link>
                    <Link
                      to="/lisensi"
                      className={
                        location.pathname == "/lisensi" ? "active" : ""
                      }
                    >
                      Lisensi
                    </Link>
                    <Link
                      to="/whitepaper"
                      className={
                        location.pathname == "/whitepaper" ? "active" : ""
                      }
                    >
                      Whitepaper
                    </Link>
                    <Link
                      to="/terms"
                      className={location.pathname == "/terms" ? "active" : ""}
                    >
                      Terms
                    </Link>
                    <Link
                      to="/how"
                      className={location.pathname == "/how" ? "active" : ""}
                    >
                      How it works
                    </Link>
                    <Link
                      to="/faq"
                      className={location.pathname == "/faq" ? "active" : ""}
                    >
                      FAQ
                    </Link>
                    <Link to="/signup">Sign up</Link>
                  </>
                )}
                {isThreeNavs ? (
                  <MyGreenButton text="Join Now" icon={joinIcon} dark />
                ) : (
                  <MyGreenButton text="Login" dark />
                )}
              </>
            ) : (
              <MyGreenButton text="MyGreenHouse" />
            )}
            <Language>
              <LanguageSelect isSide={false} />
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
  top: 24px;
  width: 100%;
  padding: 0 24px;
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
      color: black;
    }
    a.active {
      color: #041d04;
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
