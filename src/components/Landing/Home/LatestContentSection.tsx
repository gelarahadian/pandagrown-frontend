import { useState, useEffect, useRef, useMemo } from "react";
import { styled } from "styled-components";
import PlantItem from "components/Landing/Home/PlantItem";
import Testimonial from "components/Landing/Home/Testimonial";
import api from "utils/api";
import { formatNumber } from "utils/common";
import { Plant } from "components/Landing/Home/PlantItem";
import { TestimonialType } from "components/Landing/Home/Testimonial";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import MyGreenButton from "./MyGreenButton";
import Slider from "react-slick";
import mapleIcon from "assets/landing/maple.png";
import bgTestimonial from "assets/landing/bg-testmonial.png";
import bgMobileTestimonial from "assets/landing/bg-mobile-testimonial.png";
import leafBg from "assets/images/leaf-bg.png";

type Statistic = {
  invest_people: number;
  invest_fund: number;
  return_paid: number;
  hemps_planted: number;
  panda_amount: number;
};

const LatestContentSection = () => {
  const [statistic, setStatistic] = useState<Statistic>();
  const [plants, setPlants] = useState<Plant[]>();
  const [testimonials, setTestimonials] = useState<TestimonialType[]>();
  const [showHoverImage, setShowHoverImage] = useState(false);
  const [hoverImage, setHoverImage] = useState("");
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const sectionPlantRef = useRef<HTMLDivElement | null>(null);
  const sectionTestimonialRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api
      .get("/base/testimonial/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTestimonials(res.data);
      })
      .catch((err) => {});

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

    api
      .get("admin/platns/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setPlants(res.data);
      })
      .catch((err) => {});
  }, []);

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

    if (sectionPlantRef.current) {
      observer.observe(sectionPlantRef.current);
    }

    if (sectionTestimonialRef.current) {
      observer.observe(sectionTestimonialRef.current);
    }
  }, []);

  const onHoverImage = (url: string) => {
    setHoverImage(url);
    setShowHoverImage(true);
  };

  const onOutImage = () => {
    setShowHoverImage(false);
    setHoverImage("");
  };
  const TestimonialSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 3000,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
  };

  const PlantSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    vertical: isMobile ? true : false,
    verticalSwiping: isMobile ? true : false,
    autoplay: false,
    autoplaySpeed: 3000,
    slidesToShow: isTablet ? 2 : 3,
    slidesToScroll: 1,
  };

  if (isMobile) {
    return (
      <>
        <Background style={{ backgroundImage: `url(${leafBg})` }}>
          <div ref={sectionPlantRef}>
            <div className="text-center animation-scroll-fade-in">
              <Title>Latest Updates</Title>
            </div>
            <Container className="animation-scroll-fade-in">
              <div className="readyFor">
                {plants?.slice(0, 3).map((plant, index) => (
                  <div className="mt-6" key={index}>
                    <PlantItem
                      onHoverImage={onHoverImage}
                      onOutImage={onOutImage}
                      plant={plant}
                      key={index}
                    />
                  </div>
                ))}
              </div>
            </Container>
          </div>

          <div
            className="relative overflow-hidden bg-[#222321aa] pt-20 px-40 "
            ref={sectionTestimonialRef}
          >
            <div className="testimonial relative">
              <div className="w-full animation-scroll-fade-in-left">
                <Title className="text-white text-5xl font-bold leading-tight mb-20">
                  Testimonials
                </Title>
              </div>
              <div className="w-full animation-scroll-fade-in-right">
                <TestimonialContainer>
                  <div className="monial-container">
                    <Slider {...TestimonialSliderSettings}>
                      {testimonials?.map((testimonial) => (
                        <Testimonial
                          avatar={testimonial.avatar}
                          key={testimonial.id}
                          name={testimonial.name}
                          description={testimonial.description}
                        />
                      ))}
                    </Slider>
                  </div>
                </TestimonialContainer>
              </div>
            </div>
          </div>
        </Background>
      </>
    );
  }

  if (isTablet) {
    return (
      <>
        <Background
          ref={sectionPlantRef}
          style={{ backgroundImage: `url(${leafBg})` }}
        >
          <div className="animation-scroll-fade-in delay4 py-20 px-40">
            <Title>Latest Updates</Title>
            <div className="relative animation-scroll-fade-in-bottom delay4">
              <ItemContainer className="flex justify-between">
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
                  <label className="block text-center">USD Fund invested</label>
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
            <Container className="animation-scroll-fade-in">
              <div className="readyFor">
                <Slider {...PlantSliderSettings}>
                  {plants?.map((plant, index) => (
                    <PlantItem
                      onHoverImage={onHoverImage}
                      onOutImage={onOutImage}
                      plant={plant}
                      key={index}
                    />
                  ))}
                </Slider>
              </div>
            </Container>
          </div>
          <div
            className="relative overflow-hidden bg-[#222321aa] pt-20 px-40 "
            ref={sectionTestimonialRef}
          >
            <div className="testimonial relative">
              <div className="w-full animation-scroll-fade-in-left">
                <Title className="text-white text-5xl font-bold leading-tight mb-20">
                  Testimonials
                </Title>
              </div>
              <div className="w-full animation-scroll-fade-in-right">
                <TestimonialContainer>
                  <div className="monial-container">
                    <Slider {...TestimonialSliderSettings}>
                      {testimonials?.map((testimonial) => (
                        <Testimonial
                          avatar={testimonial.avatar}
                          key={testimonial.id}
                          name={testimonial.name}
                          description={testimonial.description}
                        />
                      ))}
                    </Slider>
                  </div>
                </TestimonialContainer>
              </div>
            </div>
          </div>
        </Background>
      </>
    );
  }

  return (
    <>
      <Background style={{ backgroundImage: `url(${leafBg})` }}>
        <div
          className="animation-scroll-fade-in delay4 py-36 px-40"
          ref={sectionPlantRef}
        >
          <Title>Latest Updates</Title>
          <div className="relative animation-scroll-fade-in-bottom delay4">
            <ItemContainer className="flex justify-between">
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
                <label className="block text-center">USD Fund invested</label>
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
          <Title>Ready for you</Title>
          <Container className="animation-scroll-fade-in">
            <div className="readyFor">
              <Slider {...PlantSliderSettings}>
                {plants?.map((plant, index) => (
                  <PlantItem
                    onHoverImage={onHoverImage}
                    onOutImage={onOutImage}
                    plant={plant}
                    key={index}
                  />
                ))}
              </Slider>
            </div>
          </Container>
        </div>

        <div
          className="relative overflow-hidden bg-[#222321aa] pt-20 px-40 "
          ref={sectionTestimonialRef}
        >
          <div className="testimonial relative">
            <div className="w-full animation-scroll-fade-in-left">
              <Title className="text-white text-5xl font-bold leading-tight mb-20">
                Testimonials
              </Title>
            </div>
            <div className="w-full animation-scroll-fade-in-right">
              <TestimonialContainer>
                <div className="monial-container">
                  <Slider {...TestimonialSliderSettings}>
                    {testimonials?.map((testimonial) => (
                      <Testimonial
                        avatar={testimonial.avatar}
                        key={testimonial.id}
                        name={testimonial.name}
                        description={testimonial.description}
                      />
                    ))}
                  </Slider>
                </div>
              </TestimonialContainer>
            </div>
          </div>
        </div>
      </Background>
    </>
  );
};

export default LatestContentSection;

const Background = styled.div`
  color: white;
  background-image: url("/landing-bg2.jfif");
  background-size: cover;
  background-position: center;
  h1 {
    font-size: 32px;
    font-weight: 700;
  }

  hr {
    margin-top: 8px;
    height: 3px;
    width: 64px;
    background: white;

    @media (max-width: 592px) {
      margin-bottom: 47px;
    }
  }
`;

const Title = styled.div`
  font-weight: 700;
  line-height: 169%;
  font-family: Poppins;
  position: relative;
  display: inline-block;
  color: white;
  font-size: 30.476px;
  font-style: normal;
  line-height: 169.5%; /* 51.657px */

  @media (max-width: 900px) {
    font-size: 32px;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -16px;
    left: 0;
    width: 60px;
    height: 2.5px;
    background-color: white;
  }
`;

const Container = styled.div`
  padding: 20px 0 0px;
  margin: 0 auto;

  @media (min-width: 1440px) {
    width: 1174px;
  }

  @media (min-width: 593px) and (max-width: 1439px) {
    width: 100%;
  }

  @media (max-width: 592px) {
    width: 310px;
  }

  @media (max-width: 592px) {
    padding: 61px 0 109px;
  }
`;

const ItemContainer = styled.div`
  margin-bottom: 112px;
  @media (max-width: 592px) {
    margin-bottom: 61px;
  }
`;

const UpdateItem = styled.div`
  margin-top: 68px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  display: inline-block;
  border-radius: 5px;
  color: #fff;

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
  }

  label {
    font-size: 16px;
  }
`;

const TestimonialContainer = styled.div`
  border-radius: 10px;
  color: white;

  .plant-container {
    margin-top: 70px;

    li.slide {
      min-width: fit-content !important;
    }

    @media (max-width: 592px) {
      margin-top: 52px;
    }
  }

  .monial-container {
    margin-top: 0px;

    li.slide {
      min-width: fit-content !important;
    }

    @media (max-width: 592px) {
      margin-top: 52px;
    }
  }
`;

const MobileTestimonialContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  margin-top: 30px;
  color: white;

  .plant-container {
    margin-top: 70px;

    li.slide {
      min-width: fit-content !important;
    }

    @media (max-width: 592px) {
      margin-top: 52px;
    }
  }

  .monial-container {
    margin-top: 0px;

    li.slide {
      min-width: fit-content !important;
    }

    @media (max-width: 592px) {
      margin-top: 52px;
    }
  }
`;
