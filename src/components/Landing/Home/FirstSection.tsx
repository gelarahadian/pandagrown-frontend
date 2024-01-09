import { useEffect, useState } from "react";
import { styled } from "styled-components";

import { Link } from "react-router-dom";
import MyGreenButton from "./MyGreenButton";

import treeImg from "assets/landing/tree.png";
import treeImgSm from "assets/landing/tree-mobile.png";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { formatNumber } from "utils/common";
import api from "utils/api";
import mobileScreen from "assets/landing/screen-phone.png";
import bgHero1 from "assets/images/image-hero-1.png";
import bgHero2 from "assets/images/image-hero-2.png";
import bgHero3 from "assets/images/image-hero-3.png";
import blockchainIcon from "assets/icons/blockchain.svg";
import ecoIcon from "assets/icons/eco.svg";
import pandaIcon from "assets/icons/panda.svg";
import greenRevolutionIcon from "assets/icons/green - revolution.svg";

import VideoBackground from "../VideoBackground";
type Statistic = {
  invest_people: number;
  invest_fund: number;
  return_paid: number;
  hemps_planted: number;
  panda_amount: number;
};

const FirstSection = () => {
  const [statistic, setStatistic] = useState<Statistic>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();

  useEffect(() => {
    api
      .get("admin/statistic/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setStatistic(res.data);
      })
      .catch((err) => {});
  });

  const bgHeroArray = [bgHero1, bgHero2, bgHero3];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bgHeroArray.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (isMobile) {
    return (
      <Container
        style={{ backgroundImage: `url(${bgHeroArray[currentIndex]})` }}
      >
        <MobileTitleContainer>
          <div className="text-center">
            <h1 className="animation-fade-in-top text-center text-4xl font-bold leading-tight mb-10">
              Revolutionizing
              <br />
              Sustainable
              <br />
              Agriculture
            </h1>
            <div className="flex justify-center space-x-4 md:space-x-14 mb-8 ">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 relative">
                  <img
                    src={blockchainIcon}
                    alt="blockchain icon"
                    className="object-cover"
                  />
                </div>
                <p className="font-bold">
                  Blockchain - based <br /> inverstment model
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 relative">
                  <img
                    src={pandaIcon}
                    alt="eco icon"
                    className="object-cover"
                  />
                </div>
                <p className="font-bold">
                  Eco - concious <br /> farming policy
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 relative ">
                  <img
                    src={ecoIcon}
                    alt="panda icon"
                    className="object-cover"
                  />
                </div>
                <p className="font-bold">
                  Panda concervation <br /> support
                </p>
              </div>
            </div>
            <MyGreenButton
              text={isMobile ? "Join now" : "Join the Green Revolution"}
              icon={greenRevolutionIcon}
              className="wide"
              dark
            />
          </div>
        </MobileTitleContainer>
      </Container>
    );
  }

  return (
    <Container style={{ backgroundImage: `url(${bgHeroArray[currentIndex]})` }}>
      <TitleContainer className="flex">
        <div className="w-full ">
          <h1
            className={`${
              isMobile
                ? "animation-fade-in-top text-center text-4xl font-bold leading-tight mb-10 text center"
                : "animation-fade-in-left"
            }`}
          >
            Revolutionizing
            <br />
            Sustainable
            <br />
            Agriculture
          </h1>
          {!isMobile && (
            <>
              <div className="flex space-x-14 mb-8 ">
                <div className="flex space-x-2">
                  <img src={blockchainIcon} alt="blockchain icon" />
                  <p className="font-bold">
                    Blockchain - based <br /> inverstment model
                  </p>
                </div>
                <div className="flex space-x-2">
                  <img src={pandaIcon} alt="eco icon" />
                  <p className="font-bold">
                    Eco - concious <br /> farming policy
                  </p>
                </div>
                <div className="flex space-x-2">
                  <img src={ecoIcon} alt="panda icon" />
                  <p className="font-bold">
                    Panda concervation <br /> support
                  </p>
                </div>
              </div>

              <div className=" w-16 h-2 bg-black mb-14" />

              <div className="relative space-y-4 mb-14">
                <h2>Our Statistic</h2>
                <ItemContainer className="flex">
                  <UpdateItem key={1}>
                    <h1 className="text-center">
                      {formatNumber(statistic?.invest_people || 0)}
                    </h1>
                    <label className="block text-center">People invest</label>
                  </UpdateItem>
                  <UpdateItem key={2}>
                    <h1 className="text-center">
                      {formatNumber(statistic?.invest_fund || 0)}
                    </h1>
                    <label className="block text-center">
                      USD Fund invested
                    </label>
                  </UpdateItem>
                  <UpdateItem key={3}>
                    <h1 className="text-center">
                      {formatNumber(statistic?.return_paid || 0)}
                    </h1>
                    <label className="block text-center">USD Return paid</label>
                  </UpdateItem>
                  <UpdateItem key={4}>
                    <h1 className="text-center">
                      {formatNumber(statistic?.hemps_planted || 0)}
                    </h1>
                    <label className="block text-center">Hemps planted</label>
                  </UpdateItem>
                  <UpdateItem key={5}>
                    <h1 className="text-center">
                      {formatNumber(statistic?.panda_amount || 0)}
                    </h1>
                    <label className="block text-center">
                      USD Support for Panda
                    </label>
                  </UpdateItem>
                </ItemContainer>
              </div>
            </>
          )}

          <MyGreenButton
            text={isMobile ? "Join now" : "Join the Green Revolution"}
            icon={greenRevolutionIcon}
            className="wide"
            dark
          />
        </div>
      </TitleContainer>
    </Container>
  );
};

export default FirstSection;

const Container = styled.div`
  min-height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover, contain;
  transition: background-image 2s ease;
  // overflow: hidden;

  .z-2 {
    z-index: 2;
  }

  @media (min-width: 1280px) {
    min-height: 100vh;
  }

  @media (min-width: 593px) and (max-width: 1279px) {
    min-height: 926px;
  }

  @media (max-width: 592px) {
    min-height: 100vh;
  }
`;

const MobileGradientContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-image: radial-gradient(circle at 50% 50%, #05903320, #05903310);
`;

const GradientContainer = styled.div`
  position: absolute;
  padding-top: 100%;
  background-image: radial-gradient(circle at 50% 50%, #05903320, #05903310);
`;

const TitleContainer = styled.div`
  margin: auto 0;
  position: relative;

  @media (min-width: 1280px) {
    padding-left: 115px;
    padding-right: 115px;
  }

  @media (min-width: 593px) and (max-width: 1279px) {
    padding-left: 55px;
    padding-right: 55px;
  }

  @media (max-width: 592px) {
    padding-left: 39px;
    padding-top: 105px;
    margin-bottom: 147px;
  }

  h1 {
    display: flex;
    // width: 880px;
    flex-direction: column;
    flex-shrink: 0;

    color: black;
    font-size: 60px;
    font-family: "Poppins";
    font-weight: 700;
    line-height: 106.5%;
    margin-bottom: 30.47px;

    @media (max-width: 592px) {
      font-size: 40px;
      width: auto;
      margin-bottom: 37px;
    }
  }

  h2 {
    color: #000;
    font-family: Poppins;
    font-size: 30.476px;
    font-style: normal;
    font-weight: 700;
    line-height: 85.5%; /* 26.057px */
  }
`;

const MobileTitleContainer = styled.div`
  margin-top: 25%;
  position: relative;
`;

const ItemContainer = styled.div`
  @media (max-width: 592px) {
    margin-bottom: 61px;
  }
  gap: 9.524px;
`;

const UpdateItem = styled.div`
  color: #041d04;
  height: 80px;
  padding: 14.286px 19.048px;
  align-items: center;
  flex-shrink: 0;

  border-radius: 23.81px;
  background: rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-right: 0;
  }

  @media (max-width: 592px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 26px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  h1 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 0;
  }

  label {
    font-size: 16px;
  }
`;
