import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useMobileContext } from "context/MobileContext";
import VideoBackground from "../../components/Landing/VideoBackground";
import {Link, Outlet} from "react-router-dom";
import {Scrollbars} from "rc-scrollbars";
import Topbar from "../../components/Landing/Topbar";
import Footer from "../../components/Landing/Home/Footer";
import MobileSidebar from "../../components/Landing/MobileSidebar";

interface Topic {
  id: string,
  title: string,
  desc: string,
}
const topics = [
  {
    id: '1',
    title: '1. Acceptance of Terms',
    desc: 'By accessing this website, you agree to be bound by these terms and conditions, all applicable laws, and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
  },
  {
    id: '2',
    title: '2. License to Use',
    desc: 'We grant you a personal, non exclusive, non-transferable, limited license to access and use the website strictly in accordance with these terms. You may use the information, resources, and services provided on this website for your personal or internal business purposes.'
  },
  {
    id: '3',
    title: '3. User Responsibilities',
    desc: 'You are responsible for ensuring that all information you provide on this website is accurate, current, and complete. You agree not to engage in any activity that disrupts or interferes with the functionality of the website. You also agree not to access or attempt to access any systems or servers on which the website is hosted without our express written permission.'
  },
  {
    id: '4',
    title: '4. Content Ownership and Use',
    desc: 'All content on this website, including text, images, graphics, logos, audio clips, digital downloads, and data compilations, is the property of PandaGrown or its content suppliers and is protected by international copyright laws. You may not modify, distribute, reproduce, publish, license, create derivative works from, transfer, or sell any content obtained from this website without our explicit written consent.'
  },
  {
    id: '5',
    title: '5. External Links and Third-Party Websites',
    desc: 'This website may contain links to external websites or resources provided by third parties. These links are provided for your convenience and do not signify that we endorse the website(s). We have no control over the content of third-party websites and are not responsible for their content or availability.'
  },
  {
    id: '6',
    title: '6. Privacy Policy',
    desc: 'Your use of this website is also governed by our Privacy Policy, which outlines how we collect, use, disclose, and protect your personal information. Please review our Privacy Policy to understand our practices.'
  },
  {
    id: '7',
    title: '7. Limitation of Liability',
    desc: 'In no event shall PandaGrown or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on pandagrown.com website, even if PandaGrown authorized representative has been notified orally or in writing of the possibility of such damage.'
  },
  {
    id: '8',
    title: '8. Changes to Terms and Website',
    desc: 'PandaGrown may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service. We reserve the right to modify or discontinue, temporarily or permanently, the website or any part of it with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the website.'
  },
  {
    id: '9',
    title: '9. Governing Law',
    desc: 'These terms and conditions are governed by and construed in accordance with the laws of the United States of America, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.'
  },
  {
    id: '10',
    title: '10. Contact Information',
    desc: 'For any questions about these terms and conditions, please contact us at:'
  }
]
const TopicItem = ({
  topic
}: {
  topic: Topic
}) => {
  const isMobile = useMobileContext();
  return <>
    <p className={isMobile? 'text-sm text-black/70 font-bold' : 'text-md text-black/70 font-bold'} style={{color: '#059033'}}>{topic.title}</p>
    <p className={isMobile? 'text-sm text-black/70' : 'text-black/70'} style={{fontSize: !isMobile ? '17px' : ''}}>{topic.desc}</p>
  </>
}
const TC = () => {
  const handleClickScroll = (id: string) => {
    const element = document.getElementById('topic_' + id);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [showSidebar, setShowSidebar] = useState(false); // on mobile, toggle sidebar (only works on mobile)
  const isMobile = useMobileContext();
  useEffect(() => {
  }, [])
  return (<>
    <Scrollbars style={{ width: '100%', height: '100vh' }}>
      <Topbar setShowSidebar={setShowSidebar} />
      <MainSection>
        <VideoBackground source="" />
        <h1>{"Terms & Conditions"}</h1>
      </MainSection>
      <div style={{margin: !isMobile? '0px auto 80px' : '', display: 'flex', width: !isMobile? '1500px': '', }}>
        {
          !isMobile ?
              <DetailSide>
                {
                  topics.map(topic => (
                      <p className={'text-md text-black/70 font-bold cursor-pointer'}  style={{color: '#059033'}} onClick={() => handleClickScroll(topic.id)}>
                        {topic.title}
                      </p>
                  ))
                }
              </DetailSide>
              :
              ''
        }
        <DetailSection>
          <p className={"font-bold text-black/70 text-right"}  style={{color: '#059033' ,fontSize: !isMobile ? '17px' : ''}}>Last Updated: 3rd October, 2023</p>
          <p className={isMobile? 'text-sm text-black/70' : 'text-md text-black/70'}  style={{fontSize: '17px', marginTop: '50px'}}>
            Welcome to PandaGrown, your comprehensive online resource for agricultural green products. These terms and conditions outline the rules and regulations for the use of PandaGrown's website.
          </p>
          {
            topics.map(topic => (
                <div id={'topic_' + topic.id}>
                  <TopicItem topic={topic} />
                </div>
            ))
          }
          <ul className={'mt-10'}>
            <li style={{fontSize: !isMobile ? '17px' : ''}}>
              <span className={isMobile ? 'text-sm font-bold' : 'text-md font-bold'} style={{color: '#019BDD'}}>Telegram Channel : </span>
              <Link className={isMobile ? 'text-sm text-black/70' : 'text-md text-black/70'} to={'https://t.me/+bHRZG_ZuQn9lYjY8'} target={'_blank'}>https://t.me/+bHRZG_ZuQn9lYjY8</Link>
            </li>
            <li style={{fontSize: !isMobile ? '17px' : ''}}>
              <span className={isMobile ? 'text-sm font-bold' : 'text-md font-bold'} style={{color: '#4701DD'}}>Discord Server : </span>
              <Link className={isMobile ? 'text-sm text-black/70' : 'text-md text-black/70'} to={'https://discord.com/channels/1151038337411465233/1151299313977270404'} target={'_blank'}>https://discord.com/channels/1151038337411465233/1151299313977270404</Link>
            </li>
          </ul>
          <p className={isMobile ? 'text-sm text-black/70' : 'text-md text-black/70'} style={{fontSize: !isMobile ? '17px' : ''}}>
            By using this website, you signify your acceptance of these terms and conditions. If you do not agree to these terms and conditions, please do not use our website.
          </p>
          <p className={isMobile ? 'text-md font-bold text-black/70' : 'text-md font-bold text-black/70'}>
            Thank you for visiting PandaGrown!
          </p>
        </DetailSection>
      </div>
      <Footer />
    </Scrollbars>
    {
      (isMobile && showSidebar) ? (
          <MobileSidebar toggle={() => setShowSidebar(false)} />
      ) : (
          <></>
      )
    }
  </>)
};

export default TC;


const MainSection = styled.div`
  padding-top: 198px;
  padding-bottom: 112px;
  text-align: center;
  box-shadow: 11px 0px 20px 0px rgba(0, 0, 0, 0.25);
  position: relative;
  background-image: url('/landing-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  @media (max-width: 592px) {
    padding-bottom: 74px;
    box-shadow: none;
  }
  h1 {
    font-size: 32px;
    font-weight: 700;
    @media (max-width: 592px) {
      font-size: 24px;
    }
  }

  label {
    font-size: 20px;
    font-weight: 400;

    @media (max-width: 592px) {
      margin: 0 64px;
      display: block;
    }
  }
`;
const DetailSide = styled.div`
  margin: 80px auto;
  @media (min-width: 1501px) {
  }
  p {
    margin-top: 20px;
  }
`;
const DetailSection = styled.div`
  margin: 0 auto;

  @media (min-width: 1501px) {
    width: 1200px;


    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 35px;
    }
  }

  @media (max-width: 1500px) and (min-width: 593px) {
    padding-top: 58px;
    padding-bottom: 100px;
    margin-left: 100px;
    margin-right: 100px;
  }

  @media (max-width: 592px) {
    width: 360px;
    padding-top: 56px;
    padding-left: 32px;
    padding-right: 35px;
    padding-bottom: 121px;

    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 18px;
    }
  }

  font-size: 20px;
  font-weight: 400;
  label {
    font-size: 20px;
    @media (max-width: 592px) {
      font-size: 16px;
    }
  }
  p {
    margin-top:20px
  }
  .topics {
    width: 370px;
    /*float: left;*/

    .topic-item {
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 35px;
      cursor: pointer;
      &:last-child {
        margin-bottom: 0;
      }

      &.active {
        font-weight: 700;
        color: #059033;
      }
    }
  }

  .questions {
    @media (min-width: 1192px) {
      margin-left: 457px;
    }

    @media (max-width: 592px) {
      font-size: 16px;
    }

    .question-item {
      .header {
        display: flex;
        font-weight: 700;
        cursor: pointer;

        @media (max-width: 592px) {
          margin-bottom: 6px;
        }

        img {
          margin-left: auto;
        }
      }

      p.content {
        margin-top: 19px;
        transition: height 0.3s ease;
        height: 0;
        overflow: hidden;

        &.open {
          height: auto;
        }
      }

      hr {
        height: 1px;
        background: rgba(0, 0, 0, 0.50);
        margin: 41px 0;

        @media (max-width: 592px) {
          margin: 25px 0;
        }
      }

      &:last-child {
        hr {
          margin-bottom: 0;
        }
      }
    }
  }
`;