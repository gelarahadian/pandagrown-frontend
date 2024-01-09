import { useState, useEffect } from "react";
import { styled } from "styled-components";

import MyGreenButton from "components/Landing/Home/MyGreenButton";
import { useMobileContext } from "context/MobileContext";
import Slider from "react-slick";

import topleftImg from "assets/landing/how/topleft.png";
import mainImg from "assets/landing/how/main.png";
import mainImgMobile from "assets/landing/how/main-mobile.png";
import signupImg from "assets/landing/how/signup.png";
import plantImg from "assets/landing/how/plant-item.png";
import greenhouseImg from "assets/landing/how/greenhouse.png";
import bitcoinImg from "assets/landing/how/bitcoin.png";
import joinIcon from "assets/icons/logo-join.png";

import { CoinInfo } from "types/common";
import { config } from "config";
import api from "utils/api";

const HowItWorks = () => {
  const isMobile = useMobileContext();
  const buttonText = isMobile ? "Join Now" : "Join the Green Revolution";
  const [coins, setCoins] = useState<CoinInfo[]>();

  useEffect(() => {
    // get currencies
    api.get(`base/currency/`).then((res) => {
      const data: CoinInfo[] = res.data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          icon: item.icon,
          symbol: item.symbol.toLowerCase(),
          unit: item.unit,
          currency: "---",
        };
      });
      const ids = data.map((coin) => coin.symbol).join(",");
      api
        .get(config.api.COIN_PRICE_URL, {
          params: {
            ids: ids,
            vs_currencies: "usd",
          },
        })
        .then((res) => {
          const currencyData = res.data;
          setCoins(
            data.map((item) => {
              if (currencyData[item.symbol] !== undefined) {
                return { ...item, currency: currencyData[item.symbol].usd };
              }
              return item;
            })
          );
        });
    });
  }, []);

  const CryptoSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <IntroSection>
        <div className="intro-div">
          {!isMobile && <img src={topleftImg} className="topleft" />}
          {isMobile && <img src={mainImgMobile} className="main-mobile" />}
          <div>
            <label>Involved in the most profitable green economy.</label>
            <p>
              In a world where sustainable living and investing in the future of
              our planet are becoming increasingly crucial, the Pandagrown
              Project emerges as a beacon of hope.
            </p>
          </div>
          {!isMobile && <img src={mainImg} className="main" />}
        </div>
      </IntroSection>
      <Container>
        <div className="title-container">
          <Title>How it works</Title>
          <hr />
        </div>
        <div className={!isMobile ? "display-flex" : ""}>
          <div className="signup-image">
            <div className="green-box" />
            <img src={signupImg} className="signup" />
          </div>
          <div className="signup-text mx-10">
            <label className="title">Create your profile (it’s free)</label>
            <p style={{ marginBottom: "10px" }}>
              Your journey with the Pandagrown Project begins with the creation
              of your profile, a process that reflects our commitment to
              simplicity and accessibility:
            </p>
            <ul style={{ listStyle: "inside", marginBottom: "20px" }}>
              <li>
                Naming Your Profile : Give your profile a distinctive name,
                providing you with a convenient way to identify it within your
                account. This name is for your internal reference only, ensuring
                a seamless and organized experience.
              </li>
              <li>
                Email Notifications: By entering your email, you not only create
                a pathway for account notifications but also open the door to
                the latest updates and developments in the world of
                sustainability. Stay informed about our initiatives and
                opportunities to make a difference.
              </li>
              <li>
                Securing Your Access: The creation of a secure password is
                paramount. It ensures that your profile remains private and
                accessible only to you, safeguarding your data and interactions
                within the platform.
              </li>
              <li>
                Understanding Terms and Conditions: Before proceeding, we
                encourage you to take a moment to read and understand our terms
                and conditions. Your agreement to these terms is a testament to
                your commitment to our shared values and vision.
              </li>
              <li>
                Completion: Once you’ve reviewed and agreed to the terms, you’re
                done! Your Pandagrown profile is now ready, marking the
                beginning of your journey toward sustainability and positive
                change.
              </li>
            </ul>
            <MyGreenButton text={buttonText} icon={joinIcon} className="wide" />
          </div>
        </div>
        <div className={!isMobile ? "display-flex pt-20" : ""}>
          {isMobile ? (
            <img
              src={plantImg}
              className="mx-auto my-5"
              style={{ width: "341px" }}
            />
          ) : (
            <div className="w-full relative flex items-center">
              <div className="h-[300px] w-[440px] -z-10 rounded-xl bg-[#059033] opacity-10 absolute left-0"></div>

              <img
                src={plantImg}
                className="mx-10 my-4"
                style={{ width: "521px" }}
              />
            </div>
          )}

          <div className="plant-text !pt-0">
            <label className="title bigger">Browse and purchase our seed</label>
            <p style={{ marginBottom: "10px" }}>
              Our commitment to sustainability extends to our seed selection,
              and we’re thrilled to offer you more than just seeds we provide a
              germinated seeds. When you choose Pandagrown seeds, you embark on
              a journey toward a greener future:
            </p>
            <ul style={{ listStyle: "inside", marginBottom: "20px" }}>
              <li>
                Visit Our Website: To explore our wide variety of eco-friendly
                seeds, start by visiting our website at https://pandagrown.com
              </li>
              <li>
                Log in for Seamless Shopping: Click "Join Now" and log in with
                the account you’ve previously created. This ensures a seamless
                and personalized shopping experience.
              </li>
              <li>
                Discover "Clone Store": Navigate to “clone Store” to access our
                extensive seed collection. Here, you’ll find seeds that cater to
                both beginners and experienced gardeners.
              </li>
              <li>
                Seed Variety: Choose from an array of seeds, including but not
                limited to Apple Fruit, Baklava, Blueberries, Gorilla Punch, and
                numerous others, each selected for their quality and
                sustainability.
              </li>
              <li>
                Select Your Quantity: Specify the quantity of seeds you wish to
                purchase in grams, allowing you to tailor your order to your
                specific needs and garden size.
              </li>
              <li>
                Accelerated Harvest Option: For those looking to expedite
                harvest times and maximize profits, simply click “Yes, I want”
                to explore our acceleration options, adding an extra dimension
                to your gardening journey.
              </li>
              <li>
                Add to Cart: Complete your selection by adding your chosen seeds
                to your cart. With this step, your sustainable garden journey
                officially begins.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full relative flex items-center">
          <div className="h-[300px] w-[440px] -z-10 rounded-xl bg-[#059033] opacity-10 absolute right-0"></div>
          <img src={greenhouseImg} className="mx-auto my-8" />
        </div>
        <div className="wait-container">
          <label className="title">
            Wait until its ready, and sell them directly inside the platform
          </label>
          <p style={{ maxWidth: "1202px", marginBottom: "10px" }}>
            In a world that often prioritizes instant gratification, Pandagrown
            takes a refreshingly sustainable approach. Our simple yet powerful
            message, reflects our commitment to responsible farming and
            conscious consumerism.
          </p>
          <ul style={{ listStyle: "inside", marginBottom: "20px" }}>
            <li>
              Navigate to "my warehouse" and you will find all the seeds that
              you have been purchased
            </li>
            <li>
              When the seeds is ready and the plants is grow up, you can harvest
              the plants and get profit by selling it in the platform by
              navigate "sell order".
            </li>
          </ul>

          <MyGreenButton
            text={buttonText}
            icon={joinIcon}
            dark
            className="wide"
          />
        </div>
        <hr className="divider" />
        <div className="how-container">
          <div className={isMobile ? "" : "green-box"}>
            {isMobile && <div className="small-green-box" />}
            <img src={bitcoinImg} />
            <div>
              <label className="title">How Payment Works?</label>
              <div className="section">
                <label className="subtitle">
                  Deposit your fund directly to your Crypto Wallet
                </label>
                <p style={{ marginBottom: "10px" }}>
                  As part of the Pandagrown community, you have the opportunity
                  to engage with the world of cryptocurrency:
                </p>
                <ul style={{ listStyle: "inside", marginBottom: "20px" }}>
                  <li>
                    Accessing the Deposit Feature: Click the settings icon
                    labeled "Deposit" to initiate your crypto deposit process.
                  </li>
                  <li>
                    Amount and Payment Method: Select the desired amount for
                    your deposit and choose your preferred payment method. You
                    can opt for PGA tokens or Coinbase, making cryptocurrency
                    accessible to all.
                  </li>
                  <li>
                    Confirming Your Payment: Complete the process with
                    confidence by confirming your payment, opening the door to
                    explore the world of cryptocurrency.
                  </li>
                </ul>
              </div>
              <div className="section">
                <label className="subtitle">Choose how you get paid</label>
                <p style={{ marginBottom: "10px" }}>
                  Pandagrown ensures a seamless and secure withdrawal process
                  for users:
                </p>
                <ul style={{ listStyle: "inside", marginBottom: "20px" }}>
                  <li>
                    Accessing Withdrawal: Locate the withdrawal method by
                    clicking on the top-right menu and selecting "Withdraw".
                  </li>
                  <li>
                    Safety and Convenience: Our system is designed to prioritize
                    your safety and comfort during withdrawal transactions,
                    providing peace of mind.
                  </li>
                  <li>
                    Choose How You Get Paid: Determine the withdrawal amount,
                    with options available in various cryptocurrencies,
                    including PGA, BUSD, Bitcoin, Ethereum, BNB, and Tether. The
                    flexibility ensures that you can select the currency that
                    aligns with your financial goals.
                  </li>
                  <li>
                    Providing Your Withdrawal Address: Submit the withdrawal
                    address where you’d like your funds to be sent, ensuring
                    accuracy and efficiency.
                  </li>
                  <li>
                    Finalizing Your Withdrawal: Complete the process by clicking
                    “Withdraw,” and your funds will be on their way to you,
                    empowering you with control over your financial assets.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="crypto-container">
          <label className="title">Available Crypto Currencies</label>
          {isMobile ? (
            <div className="px-5 readyFor">
              <Slider {...CryptoSliderSettings}>
                {coins?.map((coin: CoinInfo, index) => (
                  <div
                    className="crypto-item p-6 border border-black/10 bg-black/5 rounded"
                    key={index}
                  >
                    <div className="flex mb-6 items-center justify-center items">
                      <img src={coin.icon} className="w-8" />
                      <label className="currency ml-2">{coin.name}</label>
                    </div>
                    <div className="text-center text-sm desc">
                      Price per {coin.unit}
                    </div>
                    <div className="text-center mt-2 font-bold price">
                      ${coin.currency}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="items-container">
              {coins?.map((coin: CoinInfo, index) => (
                <div className="crypto-item" key={index}>
                  <div
                    style={{ marginBottom: "8px", textAlign: "center" }}
                    className="flex items-center space-x-3"
                  >
                    <img src={coin.icon} />
                    <div>
                      <label className="currency">{coin.name}</label>
                      <div className="price">${coin.currency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="button-container">
            <MyGreenButton
              text={buttonText}
              icon={joinIcon}
              dark
              className="wide"
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default HowItWorks;

const IntroSection = styled.div`
  display: flex;

  .intro-div {
    border-radius: 13px;
    background: rgba(4, 29, 4, 0.3);
    margin-left: auto;
    margin-right: auto;

    @media (min-width: 1400px) {
      margin-top: 180px;
      margin-bottom: 38px;
      position: relative;
      width: 1376px;
      height: 551px;
      display: flex;

      img.main {
        width: 530px;
        height: 503px;
        margin: 24px 33px 24px 100px;
      }

      div {
        margin-top: 87px;
        margin-left: 76px;
        position: relative;
        z-index: 2;

        label {
          font-size: 75px;
          font-weight: 700;
          line-height: 1.06;
        }

        p {
          margin-top: 37px;
          font-size: 20px;
          font-weight: 400;
          line-height: 1.7;
        }
      }
    }

    @media (max-width: 593px) and (min-width: 1399px) {
      margin-top: 180px;
      margin-bottom: 38px;
    }

    @media (max-width: 592px) {
      padding: 20px;
      width: 361px;
      margin: 151px auto 38px;

      img.main-mobile {
        heigth: 305px;
        margin-bottom: 20px;
      }

      label {
        font-size: 32px;
        font-weight: 700;
        line-height: 1.06;
      }

      p {
        margin-top: 14px;
        font-size: 16px;
        margin-bottom: 10px;
        font-weight: 400;
        line-height: 1.7;
      }
    }

    img.topleft {
      position: absolute;
      top: -10px;
      left: -14px;
    }
  }
`;

const Green = styled.span`
  color: #059033;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  line-height: 1.07;
  margin-bottom: 3px;

  @media (max-width: 592px) {
    font-size: 36px;
    margin-bottom: 16px;
  }
`;

const Container = styled.div`
  margin: 0 auto;

  @media (min-width: 1512px) {
    width: 1512px;
  }

  @media (min-width: 593px) and (max-width: 1511px) {
    & > div {
      margin-right: 61px;
    }
  }

  @media (max-width: 592px) {
    width: 100%;
    padding: 0 35px;
    overflow: hidden;
  }

  .title-container {
    margin-left: 144px;
    margin-top: 38px;
    margin-bottom: 54px;
    margin-right: auto;

    @media (max-width: 592px) {
      margin: 0 0 30px 33px;
    }

    hr {
      width: 64px;
      height: 3px;
      background: black;

      @media (min-width: 1512px) {
        margin-left: 194px;
      }
    }
  }

  div.signup-image {
    div.green-box {
      width: 461px;
      height: 318px;
      flex-shrink: 0;
      // background: rgba(5, 144, 51, 0.1);
      border-radius: 13px;
      margin-left: 144px;
    }

    img.signup {
      margin-top: -276px;
    }

    @media (max-width: 592px) {
      margin-left: -33px;

      div.green-box {
        margin-left: 104px;
        width: 290px;
        height: 198px;
      }

      img.signup {
        height: 287px;
        width: 351px;
        margin-top: -173px;
      }
    }
  }

  div.browse.green-box {
    margin-top: 90px;
    margin-left: -50px;
    margin-right: -10px;
    margin-bottom: 40px;
    width: 60px;
    border-radius: 10px;
    background: rgba(5, 144, 51, 0.1);
  }

  div.green-house {
    display: flex;
    margin: 40px 0;
    border-radius: 10px;

    img {
      margin: 10px;
      box-shadow: lightgray 0px 0px 5px 1px;
      border-radius: 5px;
      z-index: 1;
    }

    div.green-box {
      background: rgba(5, 144, 51, 0.1);
      margin: -20px 0 -20px -490px;
      width: 520px;
    }
  }

  img.plant-img {
    margin-top: 30px;
    margin-bottom: 10px;
    margin-right: 40px;
    box-shadow: lightgray 0px 0px 5px 1px;
    border-radius: 5px;
  }

  label.title {
    font-size: 40px;
    font-weight: 500;
    line-height: 1.07;

    @media (max-width: 592px) {
      font-size: 20px;

      &.bigger {
        font-size: 24px;
      }
    }
  }

  p {
    font-size: 20px;
    font-weight: 400;
    line-height: 1.7;

    @media (max-width: 592px) {
      font-size: 16px;
    }
  }

  .signup-text p,
  .plant-text p {
    margin: 39px 0;
    @media (min-width: 1440px) {
      width: 637px;
    }
  }

  div.signup-text {
    padding-top: 42px;
  }

  div.plant-text {
    padding-top: 90px;
  }

  div.wait-container {
    label {
      max-width: 963px;
    }

    @media (min-width: 1024px) {
      margin-left: 184px;
    }

    @media (max-width: 1023px) and (min-width: 593px) {
      margin-left: 80px;
    }

    p {
      margin-top: 16px;
      margin-bottom: 63px;
    }
  }

  hr.divider {
    margin: 88px 61px;
    height: 1px;
    background: black;

    @media (max-width: 592px) {
      margin: 53px 0 49px;
    }
  }

  .how-container {
    @media (max-width: 592px) {
      margin: 0 5px 39px;

      img {
        width: 347px;
        height: 330px;
        margin-top: -264px;
      }

      div.small-green-box {
        margin-left: -82px;
        width: 292px;
        height: 303px;
        background: rgba(4, 29, 4, 0.3);
      }

      label.title {
        margin-top: 28px;
        font-size: 24px;
        display: block;
      }

      div.section {
        margin-top: 22px;
        label {
          margin-bottom: 7px;
          font-size: 16px;
          font-weight: 700;
        }

        p {
          font-size: 16px;
          line-height: 1.7;
        }
      }
    }

    @media (max-width: 1439px) and (min-width: 593px) {
      margin: 0 61px;

      .green-box {
        width: auto !important;
      }
    }

    @media (min-width: 1440px) {
      margin: 0 104px 0 61px;
    }

    .green-box {
      margin-left: 264px;
      width: 1083px;
      display: flex;
      background: rgba(4, 29, 4, 0.3);
      border-radius: 13px;

      & > div {
        margin-left: 64px;
        margin-bottom: 64px;
        margin-right: 116px;
      }

      img {
        margin-left: -264px;
        border-radius: 13px;
        margin-top: 52px;
        height: 100%;
        width: 100%;
      }

      label.title {
        margin-top: 89px;
        display: block;
      }

      div.section {
        margin-top: 22px;

        label.subtitle {
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.7;
        }
      }
    }
  }

  .crypto-container {
    margin: 66px 104px 66px 160px;

    @media (max-width: 592px) {
      margin: 0 5px;

      label.title {
        margin-bottom: 22px;
      }
    }

    div.items-container {
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      /*flex-wrap: wrap;*/

      div.crypto-item {
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: linear-gradient(180deg, #fcfbfb 0%, #fafafa 100%);
        width: 168px;
        flex-shrink: 0;
        padding: 13px 13px;
        text-align: left;

        img {
          display: inline-block;
          width: 31px;
          height: 31px;
        }

        label.currency {
          font-size: 14px;
        }

        div.price,
        div.desc {
          font-size: 12px;
          line-height: 24px;
          &.price {
            font-weight: 700;
          }
        }
      }
    }

    div.button-container {
      margin: 41px 0 66px;
      text-align: center;

      @media (max-width: 592px) {
        margin: 35px 0 53px;
      }
    }
  }
`;
