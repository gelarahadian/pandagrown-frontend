import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import bg from "assets/images/bg-dashboard.png";
import summary from "assets/whitepaper/summary.png";
import offers1 from "assets/whitepaper/offers1.png";
import offers2 from "assets/whitepaper/offers2.png";
import offers3 from "assets/whitepaper/offers3.png";
import offers4 from "assets/whitepaper/offers4.png";
import offers5 from "assets/whitepaper/offers5.png";
import panda from "assets/whitepaper/panda.png";
import airdrop1 from "assets/whitepaper/airdrop1.png";
import airdrop2 from "assets/whitepaper/airdrop2.png";
import benefit1 from "assets/whitepaper/benefit1.png";
import benefit2 from "assets/whitepaper/benefit2.png";
import level from "assets/whitepaper/level.png";
import structuredBenefit from "assets/whitepaper/structured-benefit.png";
import overview from "assets/whitepaper/overview.png";
import coinBaseIcon from "assets/whitepaper/conibase-icon.png";
import pgaIcon from "assets/whitepaper/pga-icon.png";
import deposite from "assets/whitepaper/deposite.png";
import airdrop from "assets/whitepaper/aquiring-airdrop.png";
import presale from "assets/whitepaper/aquiring-pre-sale.png";
import cryptoChanges from "assets/whitepaper/aquiring-crypto-changes.png";
import optimize from "assets/whitepaper/optimize.png";
import conclusion from "assets/whitepaper/conclusion.png";
import withdrawal from "assets/whitepaper/withdrawal.png";
import withdrawalVerivication from "assets/whitepaper/withdrawal-verification.png";

import React from "react";

interface WhitepaperTexts {
  title: string;
  subTitle?: string;
  images?: any | any[];
  descriptions?: string[];
  lists?:
    | {
        title?: string | undefined;
        desc?: string | undefined;
        image?: any | undefined;
        lists?: {
          title?: string;
          image?: any;
          desc?: string;
        }[];
      }[]
    | string[];
}

const whitepaperTexts: WhitepaperTexts[] = [
  {
    title: "Executive Summary",
    descriptions: [
      "In this whitepaper, we introduce PandaGrown, an innovative blockchain-based investment model centered around the PGA token. The PGA token, with a total supply of 120.000, aims to transform the traditional investment landscape by empowering the community to participate in investment opportunities through the PandaGrown Platform.",
      "This paper presents a comprehensive overview of the cryptocurrency investment model, token distribution, and how the PGA token can be utilized for investment within the Pandagrown ecosystem. PandaGrown is an innovative hi-tech company committed to sustainable agriculture specifically focusing on the cultivation of hemp. PandaGrown harnesses the power of blockchain technology, the green economy, and eco-friendly policies in the management of its business.",
      "The company offers investors an opportunity to participate in a unique investment model, providing a return on investment through the sale of hemp. In addition, we share a portion of our income with panda conservation efforts to make a positive impact on endangered species",
    ],
    images: summary,
  },
  {
    title: "Cryptocurrency Investment and PGA Token",
    descriptions: [
      "Pandagrown offers a unique opportunity for investors in the cryptocurrency market through our native PGA token. This token is named after the Chinese word for panda and plays a crucial role in our commitment to panda conservation while providing a seamless investment experience.",
      "By investing in PGA tokens through Pandagrown, investors not only have the opportunity to participate in the cryptocurrency market but also contribute to the protection of pandas and support our sustainable initiatives. This innovative approach aligns financial investment with environmental conservation, creating a win-win scenario for both investors and the planet.",
    ],
    subTitle: "The PGA Token open several advantages:",
    lists: [
      {
        title: "Seamless Transactions:",
        image: offers1,
        desc: "Investors can use various cryptocurrencies or our native PGA token to invest directly in our platform, making transactions easy and efficient.",
      },
      {
        title: "Investor-Friendly Environment:",
        image: offers2,

        desc: "The PGA token ensures a user-friendly environment where investors can actively participate in our sustainable model and track their investments in real-time.",
      },
      {
        title: "Practical Applications:",
        image: offers3,

        desc: "Within the PandaGrown ecosystem, the PGA token has practical applications. Investors can use it to purchase seeds, contribute to panda conservation initiatives, and benefit from various incentives offered by the platform.",
      },
      {
        title: "Potential Appreciation:",
        image: offers4,

        desc: "Like other cryptocurrencies, the PGA token has the potential to appreciate in value, offering investors an additional avenue for a return on their investment, apart from revenue generated from hemp sales.",
      },
      {
        title: "Diversification:",
        image: offers5,

        desc: "For investors looking to diversify their portfolios and mitigate risks, the PGA token provides an alternative asset class. Its performance may not always correlate with traditional markets, adding a new dimension to portfolio diversification strategies.",
      },
    ],
  },
  {
    title: "Panda Conservation",
    images: panda,
    descriptions: [
      "Pandagrown is a company deeply committed to panda conservation and environmental preservation. We allocate a portion of our income to support various panda conservation efforts. Our company name, Pandagrown, symbolizes our strong dedication to environmental conservation. Our contributions go towards programs focused on habitat restoration, research, and awareness initiatives, with the goal of making a real impact on the preservation of this endangered species.",
      "Through collaborations with recognized organizations, we provide funding for projects that aim to preserve and restore pandas' natural habitat, as well as support breeding and rehabilitation programs for these endangered animals. But our commitment doesn't stop at financial I contributions. We actively engage with local communities, encouraging them to participate in sustainability and conservation-related activities.We organize events, workshops, and educational programs to raise awareness and =promote eco-friendly practices. At Pandagrown, we believe in giving back to the environment and taking tangible steps towards panda conservation and the preservation of our planet's biodiversity.",
    ],
  },
  {
    title: "Airdrop Rewards and Community Engagement",
    images: [airdrop1, airdrop2],
    descriptions: [
      "In summary, the comprehensive breakdown of the token distribution model ensures that the developer receives a portion of the PGA tokens while also allocating a substantial share for community engagement and airdrop rewards. This approach promotes the development and adoption of the Pandagrown ecosystem and aligns with the project's mission of democratizing investment opportunities through blockchain technology.",
    ],
  },

  {
    title: "Key Benefits of Pandagrown",
    images: [benefit1, benefit2],
    descriptions: [
      "Pandagrown is not just a farming business; we are dedicated to shaping a sustainable and greener future. Here are some key aspects of our commitment",
      "At Pandagrown, we are committed to combining sustainable agriculture, innovative investment models, and eco-conscious policies to create a brighter and more environmentally friendly future. Join us in making a difference in the world while enjoying the potential for financial returns through our unique investment approach.",
    ],
  },
  {
    title: "Investment Process and Level of Investment Benefit",
    descriptions: [
      "PandaGrown's tiered investment reward system not only provides financial rewards but also empowers investors to take control of their financial goals. By offering various profit percentages based on the investment amount, the platform encourages investors to set their own goals and work towards achieving them. Additionally, PandaGrown's unique approach fosters a sense of community among investors. Regardless of the investment amount, every investor is valued and recognized for their contribution to the platform ecosystem. This will encourage a community of knowledge sharing, collaboration, and mutual support among investors with diverse backgrounds and experiences.",
    ],
    images: structuredBenefit,
    lists: [
      {
        title: "Investment Process and Philosophy:",
        image: level,
        desc: "PandaGrown believes in tailoring investments to each investor's unique journey. They offer a tiered benefit system based on investment amounts, fostering fairness and inclusivity. This approach aligns benefits with financial commitments.",
      },
      {
        title: "Investment in Cannabis Cultivation:",
        image: level,

        desc: "Investors use PGA tokens to select cannabis seed strains on PandaGrown. Controlled cultivation leads to returns as the crop matures.",
      },
      {
        title: "PandaGrown s Unique Proposition:",
        image: level,

        desc: "PandaGrown stands out its innovative, for sustainable, and profitable approach to cannabis cultivation.Their investment models benefit investors and contribute to the cannabis industry's growth",
      },
    ],
  },
  {
    title: "Platform Overview",
    descriptions: [
      "Pandagrown is a cutting-edge blockchain-based platform that has been meticulously designed to offer users a secure, efficient, and transparent approach to growing their assets through cryptocurrency investments. Our platform is founded upon the core principles of blockchain technology: decentralization, security, and inclusivity.",
    ],
    images: overview,
  },
  {
    title: "PGA Token Deposits",
    descriptions: [
      "Users can easily deposit PGA tokens on the Pandagrown platform through our official website. We have set a minimum deposit threshold of $100, ensuring accessibility for a broad range of users. For those seeking higher investment opportunities, we have established an upper limit of $10,000.",
    ],
    images: deposite,
    lists: [
      {
        title: "Coinbase Commerce Pay:",
        image: coinBaseIcon,
        desc: " Users can utilize Coinbase Commerce Pay, a trusted payment gateway, for seamless and secure deposit",
      },
      {
        title: "PGA Token Deposits:",
        image: pgaIcon,
        desc: "In addition to traditional payment methods, users are encouraged to deposit via PGA tokens, our native cryptocurrency. To incentivize PGA token usage, we offer a generous 10% bonus on deposits made with PGA tokens",
      },
    ],
  },
  {
    title: "Acquiring PGA Tokens",
    descriptions: [
      "At Pandagrown, we understand the importance of token accessibility. To facilitate user participation, we have devised multiple avenues for acquiring PGA tokens:",
    ],
    lists: [
      {
        title: "9.1 Airdrop Program ",
        image: airdrop,
        desc: "Our Airdrop program is designed to reward early supporters of the Pandagrown project. By participating in our Airdrop, users have the opportunity to receive PGA tokens, enabling them to engage with the platform's investment opportunities.",
      },
      {
        title: "9.2 Pre-Sale",
        image: presale,
        desc: "For users seeking to secure PGA tokens for investment purposes, our pre-sale presents an ideal opportunity. By joining our pre-sale, users can purchase PGA tokens at attractive rates, positioning themselves for growth within the Pandagrown ecosystem.",
      },
      {
        title: "9.3 Crypto Changes",
        image: cryptoChanges,
        desc: "PGA tokens are available for purchase on select cryptocurrency exchanges, ensuring accessibility and liquidity. Users can easily acquire PGA tokens from these exchanges to participate in our platform.",
      },
    ],
  },
  {
    title: "Withdrawal Options",
    descriptions: [
      "Pandagrown values user flexibility and convenience, and we offer a diverse range of withdrawal options to cater to our global user base. Users have the freedom to select their preferred cryptocurrency for withdrawals. The minimum withdrawal amount is set at $100, while the maximum is $10,000.",
      "Join us on this exciting journey, where blockchain meets growth, and take the first steps toward a prosperous financial future with Pandagrown. For more detailed technical and operational information, please refer to the Pandagrown Technical Documentation and FAQs.",
    ],
    lists: [
      {
        title: "10.1 Supported Cryptocurrencies for Withdrawal:",
        image: withdrawal,
        lists: [
          {
            title: "Bitcoin (BTC):",
            desc: "The pioneer of cryptocurrencies, offering stability and widespread acceptance.",
          },
          {
            title: "Ethereum (ETH):",
            desc: "Known for its smart contract capabilities and rapid transaction processing.",
          },
          {
            title: "PGA Token (BEP-20):",
            desc: "Our native cryptocurrency, enabling seamless integration with the PandaGrown platform.",
          },
          {
            title: "PGA Token (ERC-20):",
            desc: "Our native cryptocurrency, enabling seamless integration with the PandaGrown platform.",
          },
          {
            title: "Binance Coin (BNB):",
            desc: "Offering utility within the Binance ecosystem and various applications.",
          },
          {
            title: "Tether (USDT):",
            desc: "A stablecoin with a 1:1 peg to the US dollar, ideal for risk-averse users.",
          },
          {
            title: "Binance USD (BUSD):",
            desc: "A regulated stablecoin tied to the US dollar, ensuring stability in volatile markets.",
          },
        ],
      },
      {
        title: "10.2 Security Measures",
        desc: "Pandagrown places the utmost importance on the security of user funds and data. Our comprehensive security measures include:",
        lists: [
          {
            title: "Blockchain Deposit Records",
            desc: "When users deposit funds on the Pandagrown platform, the deposit status is securely recorded on our blockchain. This immutable ledger ensures transparency and provides users with verifiable proof of their transactions. Simultaneously, deposited funds are moved to our cold wallet a secure storage solution that is offline and isolated from external threats. This multi-layered approach guarantees the safety of user assets.",
          },
          {
            title: "Manual Withdrawal Verification",
            image: withdrawalVerivication,
            desc: " further fortify our security measures, withdrawal requests are subject to meticulous manual verification by our dedicated administrative team. This process introduces an additional layer of protection, significantly reducing the risk of unauthorized withdrawals and safeguarding user assets from potential threats.",
          },
        ],
      },
    ],
  },
  {
    title: "Optimize Your Cannabis Seed Investment",
    images: optimize,
  },
  {
    title: "Conclusion",
    images: conclusion,
    descriptions: [
      "PandaGrown stands out as a pioneer in sustainable hemp cultivation, combining blockchain technology, eco-friendly practices, and a commitment to panda conservation. Their innovative approach demonstrates that business success can coexist with ethical responsibility, offering a model for the industry to follow towards a future where profitability and sustainability harmonize.",
    ],
  },
];

const Witepaper = () => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  return (
    <>
      <div className="bg-[#00230C]">
        <div
          className={`flex justify-center items-center text-center relative bg-cover bg-no-repeat    ${
            isMobile ? "h-[420px]" : isTablet ? "h-[740px]" : "h-[960px]"
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-4xl lg:text-6xl text-white font-bold">
              Pandagrown
            </h2>
            <h1 className="lg:text-8xl text-5xl text-white font-bold">
              {"WHITEPAPER"}
            </h1>
            <div className="border p-1 text-white">
              <p className="text-xl lg:text-2xl mx-6">
                PANDA GROWN TOKEN (PGA)
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        {whitepaperTexts.map((whitepaper, index) => (
          <>
            <div
              key={index}
              className={`max-w-[1440px] mx-auto ${
                isMobile ? "px-8" : isTablet ? "px-14 " : "px-24"
              }`}
            >
              <h1 className="text-[#00230C] text-center text-2xl sm:text-6xl lg:text-8xl font-bold mt-20 mb-12">
                {whitepaper.title}
              </h1>

              {whitepaper.title === "Executive Summary" && (
                <div className="flex flex-col lg:flex-row space-x-6 space-y-6 mb-16">
                  <div className="flex-1 space-y-3 ">
                    {whitepaper.descriptions?.map((description) => (
                      <p
                        className="text-2xl text-justify text-[#00230C] tracking-[0.25px]"
                        key={description}
                      >
                        {description}
                      </p>
                    ))}
                  </div>
                  <div className=" w-full lg:w-1/3 flex items-center justify-center ">
                    <img src={whitepaper.images} alt={whitepaper.title} />
                  </div>
                </div>
              )}

              {whitepaper.title ===
                "Cryptocurrency Investment and PGA Token" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  <div className="pl-8">
                    <h2 className="text-4xl text-green font-bold my-8">
                      {whitepaper.subTitle}
                    </h2>
                    <ul>
                      {whitepaper.lists?.map((list) => (
                        <li className="flex space-x-6">
                          {typeof list === "string" ? (
                            list
                          ) : (
                            <>
                              <div className="w-1/4">
                                <img src={list.image} alt={list.title} />
                              </div>
                              <p className="flex-1 text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                                <span className="font-bold">{list.title}</span>{" "}
                                {list.desc}
                              </p>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![1]}
                  </p>
                </div>
              )}

              {whitepaper.title === "Panda Conservation" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  <div className="w-full mb-6 ">
                    <img
                      src={whitepaper.images}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![1]}
                  </p>
                </div>
              )}

              {whitepaper.title ===
                "Airdrop Rewards and Community Engagement" && (
                <div className="mb-16">
                  <div className="w-full mb-6 ">
                    <img
                      src={whitepaper.images[0]}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                    <img
                      src={whitepaper.images[1]}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                </div>
              )}

              {whitepaper.title === "Key Benefits of Pandagrown" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  <div className="w-full mb-6 mx-6 ">
                    <img
                      src={whitepaper.images[0]}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                    <img
                      src={whitepaper.images[1]}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![1]}
                  </p>
                </div>
              )}

              {whitepaper.title ===
                "Investment Process and Level of Investment Benefit" && (
                <div className="mb-16">
                  <ul>
                    {whitepaper.lists?.map((list) => (
                      <li className="flex space-x-6">
                        {typeof list === "string" ? (
                          list
                        ) : (
                          <>
                            <div className="w-1/4">
                              <img src={list.image} alt={list.title} />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h3 className="font-bold text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                                {list.title}
                              </h3>
                              <p className=" text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                                {list.desc}
                              </p>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="full mb-6">
                    <img src={whitepaper.images} alt="" />
                  </div>
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                </div>
              )}

              {whitepaper.title === "Platform Overview" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  <div className="w-full">
                    <img
                      src={whitepaper.images}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}

              {whitepaper.title === "PGA Token Deposits" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  <div className="flex flex-col lg:flex-row my-6 lg:space-x-16 space-y-6">
                    {whitepaper.lists?.map((list) => (
                      <div className="w-full lg:w-1/2">
                        {typeof list === "string" ? (
                          list
                        ) : (
                          <>
                            <img src={list.image} alt={list.title} />
                            <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px] mt-6">
                              <span className="font-bold">{list.title}</span>{" "}
                              {list.desc}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="w-full">
                    <img
                      src={whitepaper.images}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}

              {whitepaper.title === "Acquiring PGA Tokens" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  {whitepaper.lists?.map((list, index) => (
                    <div
                      key={index}
                      className={`w-full flex flex-col  ${
                        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                      }`}
                    >
                      {typeof list === "string" ? (
                        list
                      ) : (
                        <>
                          <div className=" w-full lg:w-1/2">
                            <h3 className="font-bold text-2xl text-justify text-[#00230C] tracking-[0.25px] mt-6">
                              {list.title}
                            </h3>
                            <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px] ">
                              {list.desc}
                            </p>
                          </div>
                          <div className=" w-full lg:w-1/2 my-auto">
                            <img src={list.image} alt={list.title} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {whitepaper.title === "Withdrawal Options" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  {whitepaper.lists?.map((list, index) => (
                    <div className="pl-8 mt-6">
                      {typeof list === "string" ? (
                        list
                      ) : (
                        <>
                          <h3 className="font-bold text-4xl text-justify text-[#00230C] tracking-[0.25px]">
                            {list.title}
                          </h3>
                          {list?.image && (
                            <div className="w-full">
                              <img
                                src={list.image}
                                alt={list.title}
                                className="mx-auto"
                              />
                            </div>
                          )}
                          <ul
                            className={`space-y-6 my-6  pl-8 ${
                              list.title ===
                                "10.1 Supported Cryptocurrencies for Withdrawal:" &&
                              "list-disc"
                            }`}
                          >
                            {list.lists?.map((childList, childIndex) => (
                              <>
                                {list.title ===
                                  "10.1 Supported Cryptocurrencies for Withdrawal:" && (
                                  <li key={childList.title}>
                                    <p className=" text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                                      <span
                                        className={`font-bold ${
                                          (childIndex === 0 ||
                                            childIndex === 4) &&
                                          "text-orange-500"
                                        } ${
                                          (childIndex === 2 ||
                                            childIndex === 3 ||
                                            childIndex === 6) &&
                                          "text-green"
                                        } ${
                                          childIndex === 5 && "text-blue-500"
                                        }`}
                                      >
                                        {childList.title}
                                      </span>{" "}
                                      {childList.desc}
                                    </p>
                                  </li>
                                )}

                                {list.title === "10.2 Security Measures" && (
                                  <>
                                    <li>
                                      <h4 className="font-bold text-2xl text-justify text-green tracking-[0.25px]">
                                        <span className=" mt-1 mr-4">
                                          &#8226;
                                        </span>
                                        {childList.title}
                                      </h4>
                                      <p className=" mt-6 text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                                        {childList.desc}
                                      </p>
                                      {childList.image && (
                                        <div className="w-full">
                                          <img
                                            src={childList.image}
                                            alt={childList.title}
                                            className="mx-auto"
                                          />
                                        </div>
                                      )}
                                    </li>
                                  </>
                                )}
                              </>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ))}
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![1]}
                  </p>
                </div>
              )}

              {whitepaper.title ===
                "Optimize Your Cannabis Seed Investment" && (
                <div className="mb-16">
                  <div className="w-full">
                    <img
                      src={whitepaper.images}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}

              {whitepaper.title === "Conclusion" && (
                <div className="mb-16">
                  <p className="text-2xl text-justify text-[#00230C] tracking-[0.25px]">
                    {whitepaper?.descriptions![0]}
                  </p>
                  <div className="w-full">
                    <img
                      src={whitepaper.images}
                      alt={whitepaper.title}
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
            {index === whitepaperTexts.length - 1 ? (
              <></>
            ) : (
              <div
                className="w-full h-24"
                style={{
                  background:
                    "linear-gradient(180deg, #00230C 99.99%, #059033 100%)",
                  boxShadow: "0px 3.81px 32.381px 0px rgba(0, 0, 0, 0.35)",
                }}
              ></div>
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default Witepaper;
