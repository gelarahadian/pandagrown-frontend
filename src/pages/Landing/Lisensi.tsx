import bg from "assets/images/bg-dashboard.png";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import React from "react";

interface LicenceTextsProps {
  title?: string;
  titleCenter?: boolean;
  paragraph: string;
  list?: string[];
}

const licenceTexts: LicenceTextsProps[] = [
  {
    paragraph:
      "At Pandagrown, we embody a philosophy deeply rooted in fostering sustainable agricultural investments. Our platform serves as a conduit, facilitating a harmonious synergy between visionary investors and the burgeoning realm of cannabis cultivation.",
  },
  {
    title: "A Nexus Of Opportunity",
    titleCenter: true,
    paragraph:
      "Venturing into the realm of agricultural innovation, Pandagrown beckons investors seeking not only financial prosperity but also a conscientious partnership in revolutionizing the cannabis cultivation landscape. Our platform transcends mere transactional engagement; it is a testament to our commitment to fostering an ecosystem where innovation, transparency, and trust converge.",
  },
  {
    title: "Buyback Guarantee: A Commitment Reinforced",
    paragraph:
      "Central to our ethos is the unwavering assurance we offer tour investors engaging in the sale of cannabis products through Pandagrown. Our buyback guarantee isn't merely a promise; it's a testament to our staunch dedication to the success and satisfaction of our investor community",
    list: [
      "Exacting Buyback Protocols: Once your meticulous cultivation endeavors culminate in the sale of your cannabis products via Pandagrown, our steadfast pledge is to seamlessly repurchase these products.",
      "Transparency in Valuation Principles: Upholding transparency as a cornerstone principle, our commitment entails purchasing your yield at an agreed-upon price, ensuring fairness and clarity in valuation methodologies.",
      "Investor-Centric Advocacy: Encompassing a holistic approach, wstand resolute in supporting our investors throughout their journey, extending our commitment to repurchasing the cannabis yield they have painstakingly cultivated. ",
      "Encyclopedic Information Dissemination*: Our platform is an expansive repository of knowledge, elucidating the intricacies of the buyback process, inclusive of comprehensive terms and conditions, thereby empowering investors with a wealth of information.",
    ],
  },
  {
    title: "Pandagrown’s Signature: A Promise of Reliability",
    titleCenter: true,
    paragraph:
      "Endorsing this statement solidifies our unwavering dedication to fortifying your investment endeavors in cannabis cultivation through Pandagrown. We transcend the conventional; we pave the way for a symbiotic relationship between investors and agricultural innovation.",
  },
];

const Lisensi = () => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  return (
    <>
      <div className="bg-[#00230C]">
        <div
          className={`flex justify-center items-center text-center relative bg-cover bg-no-repeat    ${
            isMobile
              ? "h-[420px] px-8 py-14"
              : isTablet
              ? "h-[740px] px-14 py-24"
              : "h-[960px] py-32 px-24"
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        >
          <h1 className="lg:text-8xl text-5xl text-white font-bold">
            {"Invesment integrity and Commitment to Excellence 2023"}
          </h1>
        </div>
      </div>
      <div
        className="w-full"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover, contain",
        }}
      >
        <div
          className={`max-w-[1440px] mx-auto  ${
            isMobile ? "px-8 py-14" : isTablet ? "px-14 py-24" : "py-32 px-24"
          }`}
        >
          {licenceTexts.map((licence, index) => (
            <>
              {licence.title && (
                <h1
                  key={index}
                  className={`my-8 sm:my-20 font-bold text-xl sm:text-5xl ${
                    licence?.titleCenter && "text-center"
                  }`}
                >
                  {licence.title}
                </h1>
              )}
              <p className="text-justify text-base sm:text-4xl font-normal">
                {licence.paragraph}
              </p>
              {licence.list && licence.list.length !== 0 && (
                <ol className="my-8 sm:my-20 space-y-6 sm:space-y-12">
                  {licence.list.map((list, index) => (
                    <li
                      key={index}
                      className="flex text-base sm:text-4xl font-normal"
                    >
                      <div className="w-6 mr-2 ">{index + 1}.</div>
                      <p className="flex-1 text-justify">{list}</p>
                    </li>
                  ))}
                </ol>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Lisensi;
