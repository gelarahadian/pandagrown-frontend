import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMobileContext } from "context/MobileContext";
import api from "utils/api";
import { SettingType, useSettingContext } from "context/SettingContext";
import mapleImg from "assets/landing/maple.svg";
import { config } from "../../../config";
type SocialLink = {
  id: number;
  name: string;
  icon: string;
  link: string;
};

const Footer = ({}) => {
  const isMobile = useMobileContext();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const setting: SettingType = useSettingContext();

  const navigate = useNavigate();

  const joinGreen = () => {
    navigate("/signup");
  };
  useEffect(() => {
    api
      .get(`/base/social/`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setSocialLinks(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="w-full bg-black">
      {isMobile ? (
        <MobileContainer>
          <div className="flex items-center justify-between">
            <label className="pr-3">Follow us at:</label>
            {socialLinks.map((link, index) => (
              <Link
                to={link.link}
                className="social-link"
                key={index}
                target={"_blank"}
              >
                <img src={link.icon} alt="" />
              </Link>
            ))}
          </div>
        </MobileContainer>
      ) : (
        <>
          <Container>
            <div className="flex items-center justify-end">
              <label className="pr-3">Follow us at:</label>
              {socialLinks.map((link, index) => (
                <Link
                  to={link.link}
                  className="social-link"
                  key={index}
                  target={"_blank"}
                >
                  <img src={link.icon} alt="" />
                </Link>
              ))}
            </div>
          </Container>
        </>
      )}
    </div>
  );
};

const Container = styled.div`
  padding-top: 31px;
  padding-bottom: 31px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  margin: 0 auto;
  margin-top: -1px;

  @media (min-width: 1440px) {
    width: 1174px;
  }

  @media (min-width: 593px) and (max-width: 1439px) {
    padding: 0 100px;
    width: 100%;
  }

  @media (max-width: 592px) {
    width: 310px;
  }

  label {
    font-size: 16px;
    font-weight: 700;
  }

  label.copyright {
    margin-left: auto;
  }

  a {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 17px;
  }
`;

const MobileContainer = styled.div`
  max-width: 400px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 31px;
  padding-bottom: 31px;
  background: black;
  color: white;
  margin: 0 auto;
  margin-top: -1px;
`;

const LinkContainer = styled.div`
  a {
    margin-right: 38px;
  }
`;

export default Footer;
