import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from 'styled-components';
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import SidebarWallet from "components/Layout/SidebarWallet";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Skeleton } from '@mui/material';
import api from "utils/api";
import 'styles/deposit.scss';
import {Scrollbars} from "rc-scrollbars";

interface supportInfo {
  id: string;
  department_state: boolean;
  department_id: string;
  department_name: string;
  subject: string;
  content: string;
}
const Support = () => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [supportList, setSupportList] = useState<supportInfo[]>([]);
  const [open, setOpen] = useState(false);
  
  const navigate = useNavigate();

  const getSupportList = () => {
    setIsLoading(true);
    api.get(`base/faq/`, {
      params: {
        category_in_use: 2,
      },
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          let departmentNum = 0;
          const supportData: supportInfo[] = data.map((item: any) => {
            let department_state = false;
            if(departmentNum != item.category) {
              departmentNum = item.category;
              department_state = true;
            }else {
              department_state = false;
            }
            return {
              id: item.id,
              department_state: department_state,
              department_id: item.category,
              department_name: item.category_name,
              subject: item.title,
              content: item.content,
            };
          });
          setSupportList(supportData);
        }
        setIsLoading(false);
    })
    .catch(err => {
        console.log(err);
        setIsLoading(false);
    });
  }

  useEffect(() => {
    getSupportList();
  }, []);
  let department_id = '';

  if (isMobile) {
    return (
      <>
        <div className="pt-3 pb-4 px-3">
          <div className="px-5 flex items-center">
              <span className="pr-3 text-sm">need to ask something?</span>
              <button className="py-2 px-4 rounded-full bg-green text-sm text-white" onClick={() => navigate('/ticket')}>+</button>
          </div>
          <div className="mt-3 pt-2 bg-white rounded">
            <div className="pt-1 pb-10 px-3">
              {
                isLoading ? (
                  <>
                    <div className="pt-4">
                      <Skeleton animation="wave" className="w-1/6" variant="rounded" />
                    </div>
                    <div className="pt-10 pb-20 pl-8 pb-10">
                      <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                    </div>
                    <div className="pt-10 pb-20 pl-8 pb-10">
                      <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                    </div>
                    <div className="pt-10 pb-20 pl-8 pb-10">
                      <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                    </div>
                    <div className="pt-10 pb-20 pl-8 pb-10">
                      <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                    </div>
                    <div className="pt-10 pb-20 pl-8 pb-10">
                      <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                    </div>
                    <div className="pt-10 pb-20 pl-8 pb-10">
                      <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                    </div>
                  </>
                ) : (
                  supportList.length > 0 ? (
                    supportList.map((item, index) => {
                      return (
                        <div key={index}>
                          {(item.department_state) ? (
                            <>
                              <label className="block text-sm pt-4 font-bold" key={department_id}>{item.department_name}</label>
                            </>
                          ) : (
                            <></>
                          )}
                          <div className="p-0">
                          <AccordionContainer>
                            <Accordion className="px-0 py-2 !shadow-none border-b-2 !border-black/50 !rounded-none">
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography className="!font-bold !text-sm">{item.subject}</Typography>
                              </AccordionSummary>
                              <AccordionDetails className="overflow-x-hidden px-0">
                                <Typography className="!text-sm !text-black/70" dangerouslySetInnerHTML={{
                                  __html: item.content.replaceAll("\n", "<br>"),
                                }} />
                              </AccordionDetails>
                            </Accordion>
                          </AccordionContainer>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <>
                      <div className="pt-0 pl-3 pb-2">
                        <p>No data.</p>
                      </div>
                    </>
                  )
                )

              }
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      { isTablet ? (
        <></>
      ) : (
        <SidebarWallet />
      )}
      <div  className={`${isTablet? '!ml-0' : ''} page-content relative pb-8`} >

          <div className="flex w-full items-center pt-12">
            <div className="w-1/2 text-left">
              <label className="text-4xl font-bold">Support</label>
            </div>
            <div className="w-1/2 flex justify-end items-center">
              <span className="pr-5">need to ask something?</span>
              <button className="py-3 px-5 rounded-full bg-green text-white" onClick={() => navigate('/ticket')}>+ Create ticket</button>
            </div>
          </div>

          <div className="w-full mt-6 pt-2 bg-white rounded">
            <Scrollbars style={{ width: '100%', height: 'calc(100vh - 220px)' }}>
            <div className="pt-7 pb-10 pl-10 pr-16" >
              {
                isLoading ? (
                    <>
                      <Skeleton animation="wave" className="w-1/6" variant="rounded" />
                      <div className="pt-10 pb-20 pl-8 pb-10">
                        <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                      </div>
                      <div className="pt-10 pb-20 pl-8 pb-10">
                        <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                      </div>
                      <div className="pt-10 pb-20 pl-8 pb-10">
                        <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                      </div>
                      <div className="pt-10 pb-20 pl-8 pb-10">
                        <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                      </div>
                      <div className="pt-10 pb-20 pl-8 pb-10">
                        <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                      </div>
                      <div className="pt-10 pb-20 pl-8 pb-10">
                        <Skeleton animation="wave" className="ml-3 " variant="rounded" />
                      </div>
                    </>
                ) : (
                    supportList.length > 0 ? (
                        supportList.map((item, index) => {
                          return (
                              <div key={index} className="mt-5">
                                {(item.department_state) ? (
                                    <>
                                      <label className="block text-xl font-bold" key={department_id}>{item.department_name}</label>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <div className="p-0">
                                  <AccordionContainer>
                                    <Accordion className="px-0 py-5 !shadow-none border-b-2 !border-black/50 !rounded-none">
                                      <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls="panel1a-content"
                                          id="panel1a-header"
                                      >
                                        <Typography className="!font-bold !text-lg">{item.subject}</Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <Typography className="!text-base !text-black/70" dangerouslySetInnerHTML={{
                                          __html: item.content.replaceAll("\n", "<br>"),
                                        }} />
                                      </AccordionDetails>
                                    </Accordion>
                                  </AccordionContainer>
                                </div>
                              </div>
                          )
                        })
                    ) : (
                        <>
                          <div className="pt-0 pl-3 pb-2">
                            <p>No data.</p>
                          </div>
                        </>
                    )
                )

              }
            </div>
            </Scrollbars>
          </div>
      </div>
    </>
  );
}


const AccordionContainer = styled.div`
  .MuiPaper-root {
    border: none;
    background: #0001;
    border-radius: 7px!important;
    margin-top: 10px!important;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    .Mui-expanded {
      min-height: auto;

      .MuiAccordionSummary-content {
        margin: 12px 0;

        p {
          color: #02531D;
        }
      }
      // background: #0001;
      // border-radius: 7px;
    }

    .MuiButtonBase-root {
      padding: 0 12px;
    }

    .MuiCollapse-root {
      padding: 0 8px;
    }
  }
`;

export default Support;

