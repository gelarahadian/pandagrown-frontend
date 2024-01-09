import { useEffect, useRef } from "react";
import { styled } from "styled-components";
import MyGreenButton from "./MyGreenButton";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import greenRevolutionIcon from "assets/icons/green - revolution.svg";

const Life = () => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const sectionLifeRef = useRef<HTMLDivElement | null>(null);

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

    if (sectionLifeRef.current) {
      observer.observe(sectionLifeRef.current);
    }
  }, []);

  if (isMobile) {
    return (
      <div className="relative" style={{ background: "black" }}>
        <MobileContainer
          ref={sectionLifeRef}
          className="animation-scroll-fade-in"
        >
          <Title className="!leading-normal">
            Get ready for the better life.
          </Title>
          <p>
            Contribute yourself in to a growing industry centered around
            sustainable and environmentally friendly resources. Support panda
            conservationfor a better tomorrow.
          </p>
          <MyGreenButton
            text={isMobile ? "Join now" : "Join the Green Revolution"}
            icon={greenRevolutionIcon}
            className="wide"
          />
        </MobileContainer>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="relative py-10 -mt-10" style={{ background: "black" }}>
        <Container ref={sectionLifeRef} className="animation-scroll-fade-in">
          <Title>Get ready for the better life.</Title>
          <p>
            Contribute yourself in to a growing industry centered around
            sustainable and environmentally friendly resources. Support panda
            conservationfor a better tomorrow.
          </p>
          <MyGreenButton
            text={isMobile ? "Join now" : "Join the Green Revolution"}
            icon={greenRevolutionIcon}
            className="wide"
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="relative" style={{ background: "black" }}>
      <Container ref={sectionLifeRef} className="animation-scroll-fade-in">
        <Title>Get ready for the better life.</Title>
        <p>
          Contribute yourself in to a growing industry centered around
          sustainable and environmentally friendly resources. Support panda
          conservationfor a better tomorrow.
        </p>
        <MyGreenButton
          text={isMobile ? "Join now" : "Join the Green Revolution"}
          icon={greenRevolutionIcon}
          className="wide"
        />
      </Container>
    </div>
  );
};

const Container = styled.div`
  padding-top: 93px;
  padding-bottom: 71px;
  background: black;
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

  @media (max-width: 592px) {
    padding: 61px 0 49px;
  }

  p {
    margin-top: 10px;
    margin-bottom: 26px;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.7;
  }
`;

const MobileContainer = styled.div`
  max-width: 400px;
  padding-top: 93px;
  padding-bottom: 71px;
  background: black;
  color: white;
  margin: 0 auto;

  p {
    margin-top: 20px;
    margin-bottom: 26px;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.7;
  }
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  line-height: 1.7;
  font-family: poppins;
`;

export default Life;
