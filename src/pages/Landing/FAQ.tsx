import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useMobileContext } from "context/MobileContext";
import VideoBackground from "components/Landing/VideoBackground";
import { FiSearch } from "react-icons/fi";

import arrowUp from "assets/icons/Arrow - Up 2.svg";
import arrowDown from "assets/icons/Arrow - Down 2.svg";

import api from "utils/api";

interface Topic {
  id: number;
  title: string;
}

interface Question {
  id: number;
  category: number;
  title: string;
  content: string;
}

const TopicItem = ({
  topic,
  isActive,
  handleClick,
}: {
  topic: Topic;
  isActive: boolean;
  handleClick: (topicId: number) => any;
}) => {
  return (
    <h2
      onClick={() => handleClick(topic.id)}
      className={`topic-item ${isActive ? "active" : ""}`}
    >
      {topic.title}
    </h2>
  );
};

const QuestionItem = ({ question }: { question: Question }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="question-item">
      <div className="header" onClick={toggleOpen}>
        <label>{question.title}</label>
        <img src={isOpen ? arrowUp : arrowDown} />
      </div>
      <p className={`content ${isOpen && "open"}`}>{question.content}</p>
      <hr />
    </div>
  );
};

const FAQ = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState(0);
  const [search, setSearch] = useState("");
  const isMobile = useMobileContext();

  const getFaq = () => {
    api
      .get(`base/faq/`, {
        params: {
          category_in_use: 1,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const arr1: Question[] = [];
        const arr2: Topic[] = [];
        const ids: Set<number> = new Set();
        res.data.forEach((item: any) => {
          arr1.push({
            id: item.id,
            category: item.category,
            title: item.title,
            content: item.content,
          });
          if (!ids.has(item.category)) {
            ids.add(item.category);
            arr2.push({
              id: item.category,
              title: item.category_name,
            });
          }
        });
        setQuestions(arr1);
        setTopics(arr2);
        if (arr1.length > 0) {
          setSelectedTopicId(arr1[0].category);
        }
        // notice
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getFaq();
  }, []);

  const items =
    search === ""
      ? questions.filter((question) => question.category === selectedTopicId)
      : questions.filter(
          (question) =>
            question.content.indexOf(search) !== -1 ||
            question.title.indexOf(search) !== -1
        );

  return (
    <>
      <MainSection>
        <VideoBackground source="" />
        <h1>{isMobile ? "FAQs" : "Frequently Asked Question"}</h1>
        <label>Have a questions? we are here to help.</label>
        <InputGroup>
          <FiSearch size={24} className="search-icon" />
          <input
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </MainSection>
      <div style={{ marginBottom: "auto" }}>
        <DetailSection>
          <h1>Glossary</h1>
          <div style={{ display: "flex" }}>
            {search === "" &&
              (isMobile ? (
                <TopicSelect
                  value={selectedTopicId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedTopicId(parseInt(e.target.value))
                  }
                >
                  {topics.map((topic, index) => (
                    <option value={topic.id} key={index}>
                      {topic.title}
                    </option>
                  ))}
                </TopicSelect>
              ) : (
                <div className="topics">
                  {topics.map((topic) => (
                    <TopicItem
                      key={topic.id}
                      topic={topic}
                      isActive={topic.id === selectedTopicId}
                      handleClick={(topicId) => setSelectedTopicId(topicId)}
                    />
                  ))}
                </div>
              ))}
            <div className="questions">
              {items.length > 0 &&
                items.map((question, index) => (
                  <QuestionItem question={question} key={index} />
                ))}
              {items.length === 0 && "No contents."}
            </div>
          </div>
        </DetailSection>
      </div>
    </>
  );
};

export default FAQ;

const MainSection = styled.div`
  padding-top: 198px;
  padding-bottom: 74px;
  text-align: center;
  box-shadow: 11px 0px 20px 0px rgba(0, 0, 0, 0.25);
  position: relative;
  background-image: url("/landing-bg.png");
  background-size: cover;
  background-repeat: no-repeat;

  @media (max-width: 592px) {
    box-shadow: none;
  }
  h1 {
    font-size: 32px;
    font-weight: 700;
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

const InputGroup = styled.div`
  margin-top: 43px;
  position: relative;

  @media (min-width: 1192px) {
    width: 633px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 593px) and (max-width: 1191px) {
    margin-left: 25%;
    margin-right: 25%;
  }

  @media (max-width: 592px) {
    margin-left: 32px;
    margin-right: 35px;
  }

  .search-icon {
    position: absolute;
    top: 16px;
    left: 24px;
    color: #555;
  }

  input {
    padding: 20px 61px;
    font-size: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 13px;
    background: none;
  }
`;

const TopicSelect = styled.select`
  padding: 16px 20px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 34px;
  display: block;
  width: 100%;
`;

const DetailSection = styled.div`
  margin: 0 auto;

  @media (min-width: 1501px) {
    width: 1500px;

    padding-top: 88px;
    padding-left: 122px;
    padding-right: 154px;
    padding-bottom: 188px;

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
        background: rgba(0, 0, 0, 0.5);
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
