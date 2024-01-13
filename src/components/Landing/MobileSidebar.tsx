import { Link } from "react-router-dom";
import { styled, keyframes } from "styled-components";
import MyGreenButton from "./Home/MyGreenButton";
import LanguageSelect from "./LanguageSelect";
import { config } from "../../config";

const MobileSidebar = ({ toggle }: { toggle: () => any }) => {
  return (
    <Container>
      <Sidebar className="show text-white">
        <CloseButton
          type="button"
          onClick={toggle}
          className="text-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span className="sr-only">Close menu</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </CloseButton>
        <div className="mx-auto" style={{ width: "268px" }}>
          <Link
            to="/"
            onClick={toggle}
            className={location.pathname == "/" ? "active" : ""}
          >
            Home
          </Link>
          <Link
            to="/lisensi"
            onClick={toggle}
            className={location.pathname == "/lisensi" ? "active" : ""}
          >
            Lisensi
          </Link>
          <Link
            to="/whitepaper"
            onClick={toggle}
            className={location.pathname == "/whitepaper" ? "active" : ""}
          >
            Whitepaper
          </Link>
          <Link
            to={"/terms"}
            onClick={toggle}
            className={location.pathname == "/terms" ? "active" : ""}
          >
            Terms & Conditions
          </Link>
          <Link
            to="/how"
            onClick={toggle}
            className={location.pathname == "/how" ? "active" : ""}
          >
            How it works
          </Link>
          <Link
            to="/faq"
            onClick={toggle}
            className={location.pathname == "/faq" ? "active" : ""}
          >
            FAQ
          </Link>

          <SidebarButton text="Join Now" light />
          <div className="pb-8">
            <LanguageSelect isSide={true} bgWhite={true} />
          </div>
        </div>
      </Sidebar>
    </Container>
  );
};

const slideIn = keyframes`
from {
  transform: translateX(100%);
}
to {
  transform: translateX(0%);
}
`;

const slideOut = keyframes`
from {
  transform: translateX(0%);
}
to {
  transform: translateX(100%);
}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 17px;
  right: 17px;
`;

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  &.hide {
    display: none;
  }
`;

const Sidebar = styled.div`
  background: #041d04;
  padding-top: 89px;
  height: 100%;
  transition: margin 0.3s ease;
  animation: fade-in-right 0.5s ease-in-out;
  position: relative;
  width: 100%;

  a {
    display: block;
    font-size: 20px;
    line-height: 131.5%;
    margin-bottom: 36px;
    font-weight: 400;
    color: white;

    &.active {
      font-weight: 700;
      color: #0df65a;
    }
  }
`;

const SidebarButton = styled(MyGreenButton)`
  margin-left: -6px;
  div {
    display: flex;
  }
`;

export default MobileSidebar;
