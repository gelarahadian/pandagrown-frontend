import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useMobileContext } from "context/MobileContext";
import grow from "assets/icons/grow.svg";
import blockchain from "assets/icons/blockchain - white.svg";
import leaf from "assets/icons/leaf.svg";
import bear from "assets/icons/bear.svg";
import btc2x from "assets/icons/Bitcoin_x2C__BTC.svg";
import tether from "assets/icons/tether_x2C__crypto_1_.svg";
import eos from "assets/icons/eos_crypto.svg";
import tron from "assets/icons/Tron_x2C__crypto.svg";
import xmlid from "assets/icons/XMLID_123_.svg";
import bgAboutPanda from "assets/landing/bg-whatispanda.png";
import bgAgriculture from "assets/landing/bg-agriculture.png";
import bgBlockchain from "assets/landing/bg-blockchain.png";
import bgPolicy from "assets/landing/bg-policy.png";
import bgConversation from "assets/landing/bg-conversation.png";
import bgInvestment from "assets/landing/bg-investment.png";

import bgMobileAboutPanda from "assets/landing/bg-mobile-whatispanda.png";
import bgMobileAgriculture from "assets/landing/bg-mobile-agriculture.png";
import bgMobileBlockchain from "assets/landing/bg-mobile-blockchain.png";
import bgMobilePolicy from "assets/landing/bg-mobile-policy.png";
import bgMobileConversation from "assets/landing/bg-mobile-conversation.png";
import bgMobileInvestment from "assets/landing/bg-mobile-investment.png";
import leafBg from "assets/images/leaf-bg.png";

const AboutSection = () => {
  const isMobile = useMobileContext();
  const sectionAboutRef = useRef<HTMLDivElement | null>(null);
  const sectionValuesRef = useRef<HTMLDivElement | null>(null);
  const [animationFlags, setAnimationFlags] = useState([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.5, // Adjust as needed
      }
    );

    if (sectionAboutRef.current) {
      observer.observe(sectionAboutRef.current);
    }

    if (sectionValuesRef.current) {
      observer.observe(sectionValuesRef.current);
    }
  }, []);

  const handleAnimationEnd = (animIndex: number) => {
    // Handle the animation completion here
    // For example, you can update state or perform other actions
    setAnimationFlags(
      animationFlags.map((flag, index) => (index == animIndex ? true : flag))
    );
  };

  if (isMobile) {
    return (
      <>
        <Background
          className="relative"
          style={{ backgroundImage: `url(${leafBg})` }}
        >
          <div
            ref={sectionAboutRef}
            className="animation-scroll-fade-in mx-auto text-white relative"
            style={{ maxWidth: "400px", paddingTop: "10%", zIndex: "1" }}
          >
            <h3 className="text-3xl font-bold px-5">What is PandaGrown?</h3>
            <p className="block text-xl pt-5 px-5 font-light leading-10 mb-4">
              Pandagrown is an innovative hi-tech company committed to
              sustainable agriculture, specifically focusing on the cultivation
              of hemp. Pandagrown harnesses the power of blockchain technology,
              the green economy, and eco-friendly policies in the management of
              its business.
            </p>
            <div className="flex space-x-6 items-center mb-16 px-5">
              <p className="text-base font-bold mt-3">Certified by:</p>
              <div className="flex space-x-1">
                <img src={btc2x} alt="btc icon" />
                <img src={tether} alt="tether icon" />
                <img src={eos} alt="eos icon" />
                <img src={tron} alt="tron icon" />
                <img src={xmlid} alt="xmlid icon" />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full px-5">
              <div className="w-full lg:w-1/3 mb-20 lg:mb-0">
                <TitleValue className="text-white text-center">
                  Our Values
                </TitleValue>
              </div>
              <div className="w-full lg:w-2/3 grid grid-cols-1 gap-x-28 gap-y-36">
                <div className="col-span-1 relative">
                  <img
                    src={grow}
                    alt="grow icon"
                    className="absolute left-0 -top-14"
                  />
                  <h1 className="font-bold text-2xl mb-2">
                    Sustainable agriculture
                  </h1>
                  <p className="font-normal text-xl">
                    We contributes to a growing industry centered around
                    sustainable and environmentally friendly resources.
                  </p>
                </div>
                <div className="col-span-1 relative">
                  <img
                    src={blockchain}
                    alt="blockchain icon"
                    className="absolute left-0 -top-14"
                  />
                  <h1 className="font-bold text-2xl mb-2">Blockchain-based </h1>
                  <p className="font-normal text-xl">
                    Our secure, transparent, and efficient investment model
                    enables investors to get earning returns on their
                    investments.
                  </p>
                </div>
                <div className="col-span-1 relative">
                  <img
                    src={leaf}
                    alt="leaf icon"
                    className="absolute left-0 -top-14"
                  />
                  <h1 className="font-bold text-2xl mb-2">
                    Eco-conscious policy
                  </h1>
                  <p className="font-normal text-xl">
                    Our commitment to organic farming practices and continuous
                    improvement ensures minimal environmental impact.
                  </p>
                </div>
                <div className="col-span-1 relative">
                  <img
                    src={bear}
                    alt="bear icon"
                    className="absolute left-0 -top-14"
                  />
                  <h1 className="font-bold text-2xl mb-2">
                    Panda conservation
                  </h1>
                  <p className="font-normal text-xl">
                    We dedicate a portion of our profits to support panda
                    conservation efforts, contribute meaningfully to a better
                    tomorrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Background>
      </>
    );
  }

  return (
    <>
      <Background
        className="relative"
        ref={sectionAboutRef}
        style={{ backgroundImage: `url(${leafBg})` }}
      >
        <div className="animation-scroll-fade-in ">
          <Title>What is PandaGrown?</Title>
          <p className="block text-xl pt-2 leading-10">
            Pandagrown is an innovative hi-tech company committed to sustainable
            agriculture, specifically focusing on the cultivation of hemp.
            Pandagrown harnesses the power of blockchain technology, the green
            economy, and eco-friendly policies in the management of its
            business.
          </p>
          <div className="flex space-x-6 items-center mb-36">
            <p className="text-base font-bold mt-3">Certified by:</p>
            <div className="flex space-x-1">
              <img src={btc2x} alt="btc icon" />
              <img src={tether} alt="tether icon" />
              <img src={eos} alt="eos icon" />
              <img src={tron} alt="tron icon" />
              <img src={xmlid} alt="xmlid icon" />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full ">
          <div className="w-full lg:w-1/3 mb-20 lg:mb-0">
            <TitleValue className="text-white">Our Values</TitleValue>
          </div>
          <div className="w-full lg:w-2/3 grid grid-cols-2 gap-x-28 gap-y-36">
            <div className="col-span-1 relative animation-scroll-fade-in delay1">
              <img
                src={grow}
                alt="grow icon"
                className="absolute left-0 -top-14"
              />
              <h1 className="font-bold text-2xl mb-2">
                Sustainable agriculture
              </h1>
              <p className="font-normal text-xl">
                We contributes to a growing industry centered around sustainable
                and environmentally friendly resources.
              </p>
            </div>
            <div className="col-span-1 relative animation-scroll-fade-in delay2">
              <img
                src={blockchain}
                alt="blockchain icon"
                className="absolute left-0 -top-14"
              />
              <h1 className="font-bold text-2xl mb-2">Blockchain-based </h1>
              <p className="font-normal text-xl">
                Our secure, transparent, and efficient investment model enables
                investors to get earning returns on their investments.
              </p>
            </div>
            <div className="col-span-1 relative animation-scroll-fade-in delay3">
              <img
                src={leaf}
                alt="leaf icon"
                className="absolute left-0 -top-14"
              />
              <h1 className="font-bold text-2xl mb-2">Eco-conscious policy</h1>
              <p className="font-normal text-xl">
                Our commitment to organic farming practices and continuous
                improvement ensures minimal environmental impact.
              </p>
            </div>
            <div className="col-span-1 relative animation-scroll-fade-in delay4">
              <img
                src={bear}
                alt="bear icon"
                className="absolute left-0 -top-14"
              />
              <h1 className="font-bold text-2xl mb-2">Panda conservation</h1>
              <p className="font-normal text-xl">
                We dedicate a portion of our profits to support panda
                conservation efforts, contribute meaningfully to a better
                tomorrow.
              </p>
            </div>
          </div>
        </div>
      </Background>
    </>
  );
};

export default AboutSection;

const Background = styled.div`
  background-size: cover;
  color: white;
  position: relative;
  padding: 144px 160px;
`;

const Container = styled.div`
  color: white;
  position: relative;
  margin: 0 auto;

  .z-2 {
    z-index: 2;
    position: relative;
  }

  @media (min-width: 1440px) {
    padding: 147px 0 146px 0;
    width: 1174px;
  }

  @media (min-width: 593px) and (max-width: 1439px) {
    margin: 100px;
  }

  @media (max-width: 592px) {
    padding: 89px 0;
    width: 310px;
  }
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  line-height: 169%;
  font-family: Poppins;

  @media (max-width: 592px) {
    font-size: 32px;
  }
`;

const TitleValue = styled.div`
  font-size: 40px;
  font-weight: 700;
  line-height: 169%;
  font-family: Poppins;
  position: relative;
  display: inline-block;

  @media (max-width: 900px) {
    font-size: 32px;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -16px;
    right: 0;
    width: 60px;
    height: 2.5px;
    background-color: white;
  }
`;

const CertifyDiv = styled.div`
  display: flex;
  margin-top: 25px;

  @media (max-width: 592px) {
    margin-top: 30px;
    margin-bottom: 67px;
    display: block;
  }

  label {
    font-size: 16px;
    font-weight: 700;
    line-height: 130%;
    margin: auto 0;
    margin-right: 25px;

    @media (max-width: 592px) {
      display: block;
      margin-bottom: 17px;
    }
  }

  img {
    margin-right: 6px;

    @media (max-width: 592px) {
      width: 61px;
      height: 61px;
      margin-right: 22px;
      display: inline-block;

      &:last-child {
        margin-rigth: 0;
      }
    }
  }
`;

const ValuesDiv = styled.div`
  display: flex;

  h1 {
    min-width: 227px;
  }

  @media (max-width: 592px) {
    display: block;
  }

  .div-title {
    margin-top: 61px;
    margin-right: 122px;
    margin-bottom: 37px;

    div {
      text-align: right;

      hr {
        margin-top: 18px;
        margin-left: auto;

        @media (max-width: 592px) {
          margin-left: 0;
        }

        width: 64px;
        height: 3px;
        background: white;
      }
    }
  }

  .values-container {
    @media (min-width: 1192px) {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .value-item {
    width: 340px;
    margin-bottom: 90px;
    margin-right: 120px;
    display: inline-block;

    &:nth-child(even) {
      margin-right: 0;
      @media (min-width: 1300px) {
        width: 365px;
      }
    }

    @media (max-width: 592px) {
      margin-right: 0;
      margin-bottom: 37px;
      display: block;
      width: 100%;
    }

    h3 {
      font-size: 24px;
      font-weight: 700;
      margin: 17px 0 8px;
    }

    p {
      font-size: 20px;
    }

    &:last-child {
      @media (min-width: 1300px) {
        width: 365px;
      }
    }
  }
`;
