import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { calcEstimationIncome } from "utils/common";
import mapleIcon from "assets/landing/maple.svg";

const CalculatorSection = () => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const [money, setMoney] = useState("");
  const [profit, setProfit] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [interestPercent, setInterestPercent] = useState("24%");
  const navigate = useNavigate();
  const sectionCalcRef = useRef<HTMLDivElement | null>(null);

  const handleCalculate = () => {
    if (money == "") {
      return;
    }
    setProfit(calcEstimationIncome(parseInt(money), 1));
    setIsFirst(false);
  };

  const handleInvest = () => {
    navigate("/signup");
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value == "0") {
      setInterestPercent("24%");
    } else if (value == "1") {
      setInterestPercent("21%");
    } else if (value == "2") {
      setInterestPercent("19%");
    } else if (value == "3") {
      setInterestPercent("16%");
    } else if (value == "4") {
      setInterestPercent("15%");
    }
  };

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

    if (sectionCalcRef.current) {
      observer.observe(sectionCalcRef.current);
    }
  }, []);

  if (isMobile) {
    return (
      <div
        ref={sectionCalcRef}
        className={`bg-black relative ${
          isMobile ? "px-8 py-14" : isTablet ? "px-14 py-24" : "py-32 px-24"
        }`}
      >
        <div className="mx-auto" style={{ maxWidth: "400px" }}>
          <div className="animation-scroll-fade-in invest-description text-white">
            <h1 className="text-4xl font-bold">Investment Calculator</h1>
            <p className="block pt-5 text-lg">
              Want to know how much you can earn by investing your money on us?
              Try to simulate your earnings with our Investment Calculator.
            </p>
          </div>
          <div>
            <div className="animation-scroll-fade-in my-8">
              <h3 className="text-white text-xl font-bold">
                How much money you want to invest?
              </h3>
              <div className="input-div text-white">
                <BlackLabel className="!w-full !pr-1">
                  USD
                  <input
                    type="number w-fit"
                    value={money}
                    onChange={(e) => setMoney(e.target.value)}
                  />
                </BlackLabel>
                <GreenButton onClick={handleCalculate} className="w-full mt-4">
                  {isFirst ? "Calculate" : "Re-calculate"}
                </GreenButton>
              </div>
            </div>
            {isFirst ? (
              ""
            ) : (
              <>
                <div className="mb-8 text-white">
                  <h3>Investment Profits</h3>
                  <span>You will earn the profit after 180 days.</span>
                  <BlackLabel>
                    USD <span>{profit}</span>
                  </BlackLabel>
                </div>
                <div className="mb-8 text-white">
                  <h3>Fund for Panda Conservation</h3>
                  <BlackLabel>
                    PGA <span>100</span>
                  </BlackLabel>
                </div>
                <InvestButton onClick={handleInvest}>
                  <img src={mapleIcon} alt="maple" />
                  Invest Now!
                </InvestButton>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <Background>
        <Container
          ref={sectionCalcRef}
          className={`!block ${
            isMobile ? "px-8 py-14" : isTablet ? "px-14 py-24" : "py-32 px-24"
          }`}
        >
          <div className="invest-description animation-scroll-fade-in">
            <h1>Investment Calculator</h1>
            <p className="text-lg">
              Want to know how much you can earn by investing your money on us?
              Try to simulate your earnings with our Investment Calculator.
            </p>
          </div>
          <div className="pt-10 animation-scroll-fade-in">
            <div>
              <h3 className="mb-2">Interest Rate</h3>
              <div className="flex">
                <div className="w-1/2">
                  Investment range
                  <select
                    className="mt-1 text-black pl-4 rounded"
                    style={{ width: "95%", height: "57px" }}
                    defaultValue={"0"}
                    onChange={handleSelectChange}
                  >
                    <option value="0">USD 0-100</option>
                    <option value="1">USD 100-1000</option>
                    <option value="2">USD 1000-5000</option>
                    <option value="3">USD 5000-10000</option>
                    <option value="4">USD 10000-</option>
                  </select>
                </div>
                <div className="w-1/2">
                  % Interest
                  <input
                    type="text"
                    className="mt-1"
                    value={interestPercent}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3>How much money you want to invest?</h3>
              <div className="input-div">
                <BlackLabel>
                  USD
                  <input
                    type="number"
                    value={money}
                    onChange={(e) => setMoney(e.target.value)}
                  />
                </BlackLabel>
                <GreenButton onClick={handleCalculate}>
                  {isFirst ? "Calculate" : "Re-calculate"}
                </GreenButton>
              </div>
            </div>
            {isFirst ? (
              ""
            ) : (
              <>
                <div className="mb-8">
                  <h3>Investment Profits</h3>
                  <span>You will earn the profit after 180 days.</span>
                  <BlackLabel>
                    USD <span>{profit}</span>
                  </BlackLabel>
                </div>
                <div className="mb-8">
                  <h3>Fund for Panda Conservation</h3>
                  <BlackLabel>
                    PGA <span>100</span>
                  </BlackLabel>
                </div>
                <InvestButton onClick={handleInvest}>
                  <img src={mapleIcon} alt="maple" />
                  Invest Now!
                </InvestButton>
              </>
            )}
          </div>
        </Container>
      </Background>
    );
  }

  return (
    <Background>
      <Container
        ref={sectionCalcRef}
        className={`${
          isMobile ? "px-8 py-14" : isTablet ? "px-14 py-24" : "py-32 px-24"
        }`}
      >
        <div className="invest-description animation-scroll-fade-in">
          <h1>Investment Calculator</h1>
          <p className="text-lg">
            Want to know how much you can earn by investing your money on us?
            Try to simulate your earnings with our Investment Calculator.
          </p>
        </div>
        <div className="animation-scroll-fade-in">
          <div>
            <h3 className="mb-2">Interest Rate</h3>
            <div className="flex">
              <div className="w-1/2">
                Investment range
                <select
                  className="mt-1 text-black pl-4 rounded"
                  style={{ width: "95%", height: "57px" }}
                  defaultValue={"0"}
                  onChange={handleSelectChange}
                >
                  <option value="0">USD 0-100</option>
                  <option value="1">USD 100-1000</option>
                  <option value="2">USD 1000-5000</option>
                  <option value="3">USD 5000-10000</option>
                  <option value="4">USD 10000-</option>
                </select>
              </div>
              <div className="w-1/2">
                % Interest
                <input
                  type="text"
                  className="mt-1"
                  value={interestPercent}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3>How much money you want to invest?</h3>
            <div className="input-div">
              <BlackLabel>
                USD
                <input
                  type="number"
                  value={money}
                  onChange={(e) => setMoney(e.target.value)}
                />
              </BlackLabel>
              <GreenButton onClick={handleCalculate}>
                {isFirst ? "Calculate" : "Re-calculate"}
              </GreenButton>
            </div>
          </div>
          {isFirst ? (
            ""
          ) : (
            <>
              <div className="mb-8">
                <h3>Investment Profits</h3>
                <span>You will earn the profit after 180 days.</span>
                <BlackLabel>
                  USD <span>{profit}</span>
                </BlackLabel>
              </div>
              <div className="mb-8">
                <h3>Fund for Panda Conservation</h3>
                <BlackLabel>
                  PGA <span>100</span>
                </BlackLabel>
              </div>
              <InvestButton onClick={handleInvest}>
                <img src={mapleIcon} alt="maple" />
                Invest Now!
              </InvestButton>
            </>
          )}
        </div>
      </Container>
    </Background>
  );
};

export default CalculatorSection;

const Background = styled.div`
  position: relative;
  background: black;
  display: flex;
  margin: 0 auto;
`;

const Container = styled.div`
  margin: 0 auto;
  color: white;
  display: flex;

  @media (max-width: 592px) {
    display: block;
  }

  .invest-description {
    @media (min-width: 1192px) {
      margin-right: 85px;

      p {
        width: 527px;
      }
    }

    @media (max-width: 592px) {
      p {
        width: 294px;
      }
    }
  }

  h1 {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
  }

  .mb-8 {
    margin-top: 32px;
  }

  .input-div {
    @media (min-width: 1192px) {
      display: flex;
      margin-right: -34px;

      label {
        width: 405px;
        margin-right: 8px;
      }
    }

    button {
      margin-top: 18px;

      @media (max-width: 592px) {
        width: 100%;
      }
    }
  }
`;

const GreenButton = styled.button`
  padding: 10px 20px;
  background-color: #059033;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  border-radius: 10px;

  &:hover {
    background: #036a25;
  }
`;

const InvestButton = styled(GreenButton)`
  padding: 15px 20px;
  width: 100%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  img {
    display: inline-block;
    margin-right: 10px;
  }
`;

const BlackLabel = styled.label`
  display: block;
  padding: 14px 20px;
  font-size: 20px;
  width: 554px;
  background: rgba(217, 217, 217, 0.16);
  border-radius: 10px;
  margin-top: 18px;
  display: flex;

  @media (max-width: 592px) {
    width: 100%;
  }

  span {
    margin-left: 17px;
    font-weight: 700;
  }

  input {
    margin: -9px -16px -9px 17px;
    height: 48px;
    padding: 8px 22px;
    color: black;
    border-radius: 10px;
  }
`;
