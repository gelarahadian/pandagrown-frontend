import { styled } from "styled-components";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";

export type TestimonialType = {
  id: number;
  avatar: string;
  name: string;
  description: string;
};

const Testimonial = ({
  avatar,
  name,
  description,
}: {
  avatar: string;
  name: string;
  description: string;
}) => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();

  return (
    <Container className="space-x-6">
      <div className="!ml-0 text-center rounded-full w-16 h-16">
        <img src={avatar} />
      </div>
      <div>
        <label>{name}</label>
        <p className="pt-3 !leading-relaxed">{description}</p>
      </div>
    </Container>
  );
};

export default Testimonial;

const Container = styled.div`
  margin-right: 78px;
  display: inline-flex;

  img {
    height: 60px;
    width: 60px;
    max-width: 110px;
    border-radius: 50%;
  }

  div {
    label {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.6;
      margin-bottom: 8px;
    }

    p {
      font-size: 20px;
      font-weight: 400;
      line-height: 1.5;

      // width: 409px;
      // height: 108px;
    }
  }
`;

const MobileContainer = styled.div`
  position: relative;
  width: 90%;
  margin: 0 auto;
  background-color: #252625;
  border-radius: 10px;
  margin-top: 55px;

  img {
    width: 110px;
    height: 110px;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  div {
    padding: 80px 30px 40px 30px;
    margin-bottom: 29px;

    label {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.7;
    }

    p {
      font-size: 16px;
      font-weight: 400;
      line-height: 1.8;
    }
  }
`;
