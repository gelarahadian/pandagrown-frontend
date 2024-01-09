import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import { styled } from 'styled-components';
import SidebarWallet from "components/Layout/SidebarWallet";
import { toast } from 'react-toastify';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputText from "components/MyTicket/InputText";
import MobileInputText from "components/MyTicket/mobile/MobileInputText";
import api from "utils/api";
import { Scrollbars } from 'rc-scrollbars';
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { config } from "config";
import 'styles/deposit.scss'


interface ticketInfo {
  id: string;
  ticket_no: string;
  subject: string;
  content: string;
  department: string;
  status: string;
  un_read_count: number;
  attach: attachInfo[];
}

interface attachInfo {
  name: string;
  url: string;
}

interface ticketReplyInfo {
  id: string;
  datetime: string;
  message: string;
  image: string;
  type: number;
}

function MyTicketDetail() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { ticket_id } = useParams();
  const { user } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [ticketInfo, setTicketInfo] = useState<ticketInfo>();
  const [replyTicketInfo, setReplyTicketInfo] = useState<ticketReplyInfo[]>([]);
  
  const navigate = useNavigate();

  const getAttachInfo = (arrayAtt: [], arrayAttOrg: []) => {
    var resArr = [];

    for (var i = 0; i < arrayAtt.length; i++) {
      resArr.push({ name: arrayAttOrg[i], url: arrayAtt[i] });
    }
    return resArr;
  }

  const getTicketInfo = () => {
    setIsLoading(true);
    api.get(`user/ticket/${ticket_id}/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          const ticketData: ticketInfo = {
              id: data.id,
              ticket_no: data.no,
              subject: data.subject,
              content: data.content,
              department: data.department_name,
              status: data.status,
              un_read_count: data.un_read_count,
              attach: getAttachInfo(data.attach, data.attach_origin),
          };

          if(ticketData.status != '1') {
            navigate('/myticket/');
            return;
          }
          setTicketInfo(ticketData);
          getReplyInfo();
        }
        setIsLoading(false);
    })
    .catch(err => {
        console.log(err);
        navigate('/myticket/');
        setIsLoading(false);
    });
  }

  const getReplyInfo = () => {
    api.get(`user/${user.user_id}/ticket/reply/${ticket_id}/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          const ticketData: ticketReplyInfo[] = data.map((item: any) => {
            return {
              id: item.id,
              datetime: item.updated_at,
              message: item.message,
              image: item.image_description,
              type: item.type,
            };
          });

          setReplyTicketInfo(ticketData);
        }
    })
    .catch(err => {
        console.log(err);
        navigate('/myticket/');
    });
  }

  useEffect(() => {
    getTicketInfo();
  }, []);

  const closeTicket = () => {
    setIsClosing(true);
    api.patch(`user/ticket/${ticket_id}/`, {
      status: 2
    }).then((res: any) => {
      const data = res.data;
      if (data) {
        toast.success('Ticket closed');
        navigate('/myticket/');
      }
      setIsClosing(false);
    }).catch(err => {
      console.log(err);
      setIsClosing(false);
    });
  }



  const formatDateAndTime = (datetimeString: string): string  =>{
    const date = new Date(datetimeString);
  
    // Format the date
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
  
    // Format the time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}.${minutes.toString().padStart(2, '0')}${amOrPm}`;
  
    return `${formattedDate}. ${formattedTime}`;
  }

  const handleSendMessage = (message: string) => {
    if( message == "") {
      return;
    }

    setReplyText(message);
    setIsSending(true);
    api.post(`user/ticket/reply/`, {
      message: message,
      type: 1,
      ticket: ticket_id,
    }).then((res: any) => {
      const data = res.data;
      if (data) {
        toast.success('You have sent message on this ticket succesfully.');
        
        const replyData: ticketReplyInfo = {
            id: data.id,
            datetime: data.updated_at,
            message: data.message,
            image: data.image_description,
            type: data.type,
        };

        setReplyTicketInfo([...replyTicketInfo, replyData]);
      }
      setIsSending(false);
    }).catch(err => {
      console.log(err);
      setIsSending(false);
    });
  }

  if (isMobile) {
    return (
      <>
        <div className="pt-2 pb-4 px-4">
          <div className="w-full mt-5 pt-2 pb-4 bg-white rounded">
            <div className="flex items-center border-b border-black/10 px-5 py-2 mb-3 relative">
              <label className="text-lg truncate pr-28">Ticket No. {ticketInfo?.ticket_no}</label>
              <ButtonWithSpinner isMobile={true} isSending={isClosing} onClick={closeTicket} >Close ticket</ButtonWithSpinner>
            </div>
            <div className="px-5">
              <label className="block text-base font-bold">Department of {ticketInfo?.department} - {ticketInfo?.subject}</label>
            </div>
            <Scrollbars style={{ width: '100%', height: 'calc(100vh - 360px)' }} >
              <div className="px-5 py-5" >
                {!isLoading ? (
                  <>
                  <div className="flex justify-end">
                    <div className="w-5/6" >
                      <p className="border border-black/10 rounded p-5 truncate" dangerouslySetInnerHTML={{
                          __html: ticketInfo ? ticketInfo.content.replaceAll("\n", "<br/>") : '',
                        }} />
                      { (ticketInfo && ticketInfo?.attach.length > 0) ? (
                        <AccordionArea>
                        <Accordion className="px-0 py-0 !shadow-none !border-none !rounded-none">
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className="!text-green !text-base">{ticketInfo.attach.length} file uploaded. Click to preview.</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography className="!text-base">
                            {ticketInfo.attach.map((item, index) => {
                              return (
                                <a className="block" href={item.url} key={index}>{item.name}</a>
                              )
                            })}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                        </AccordionArea>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {
                    replyTicketInfo.map((item: any) => {
                      return (
                        <div className={`mt-10 flex ${item.type == 1? 'justify-end' : ''}`} key={item.id} >
                          <div className="w-5/6">
                            <label className={`block pt-3 truncate ${item.type == 1? 'text-right' : ''}`}>{item.type == 0?'Pandagrown Admin': user.username}</label>
                            <p className="block mt-2 border border-black/10 bg-green/10 rounded p-5" 
                              dangerouslySetInnerHTML={{
                                __html: item.message.replaceAll("\n", "<br>"),
                              }}/>
                            {
                              item.image !== "" ? (
                                <><img src={item.image} className="mt-5 rounded" /></>
                              ) : (
                                <></>
                              )
                            }
                            <label className={`block text-black/50 pt-2 truncate ${item.type == 1? 'text-right' : ''}`}>{formatDateAndTime(item.datetime)}</label>
                          </div>
                        </div>
                      )
                    })
                  }
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Scrollbars>
            <div className="relative">
              <MobileInputText isSending={isSending} onSendMessage={handleSendMessage} />
              {/* <input type='text' className="w-full py-1 box-none" placeholder="write your reply here..." onChange={handleInputChange} /> */}
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
        <div className={`${isTablet? '!ml-0' : ''} page-content relative pb-5`} >
          <div className="flex w-full items-center pt-12">
            <div className="w-1/2 text-left">
              <label className="text-4xl font-bold flex items-center">
                My Tickets 
                { (ticketInfo && ticketInfo.un_read_count > 0) ? (
                    <span className="block text-center font-light rounded-full text-sm text-white w-5 h-5 ml-2" style={{ background:"#f00" }} >{ ticketInfo?.un_read_count }</span>
                  ) : (
                    <></>
                  )
                }
              </label>
            </div>
            <div className="w-1/2 flex justify-end items-center">
              <ButtonWithSpinner isSending={isClosing} isMobile={false} onClick={closeTicket} >Close ticket</ButtonWithSpinner>
              {/* <button className="py-3 px-5 rounded-full bg-green text-white" onClick={() => closeTicket()}>Close ticket</button> */}
            </div>
          </div>
          <div className="w-full mt-6 pt-2 pb-4 bg-white rounded">
            <div className="flex items-center border-b border-black/10 px-7 py-2 mb-3">
              <div className="w-1/2">
                <label className="text-xl">Ticket No. {ticketInfo?.ticket_no}</label>
              </div>
              <div className="w-1/2 text-right">
                <label className="block text-base font-bold truncate">Department of {ticketInfo?.department} - {ticketInfo?.subject}</label>
              </div>
            </div>
            <Scrollbars style={{ width: '100%', height: 'calc(100vh - 360px)' }} >
              <div className="px-7 py-5" >
                {!isLoading ? (
                  <>
                  <div className="flex justify-end">
                    <div className="w-2/3" >
                      <p className="border border-black/10 rounded p-5" dangerouslySetInnerHTML={{
                          __html: ticketInfo ? ticketInfo.content.replaceAll("\n", "<br/>") : '',
                        }} />
                      { (ticketInfo && ticketInfo?.attach.length > 0) ? (
                        <AccordionArea>
                        <Accordion className="px-0 py-0 !shadow-none !border-none !rounded-none">
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className="!text-green !text-base">{ticketInfo.attach.length} file uploaded. Click to preview.</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography className="!text-base">
                            {ticketInfo.attach.map((item: any, index) => {
                              return (
                                <a className="block" href={item.url} key={index}>{item.name}</a>
                              )
                            })}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                        </AccordionArea>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {
                    replyTicketInfo.map((item: any) => {
                      return (
                        <div className={`mt-10 flex ${item.type == 1? 'justify-end' : ''}`} key={item.id} >
                          <div className="w-2/3">
                            <label className={`block pt-3 truncate ${item.type == 1? 'text-right' : ''}`}>{item.type == 0?'Pandagrown Admin': user.username}</label>
                            <p className="block mt-2 border border-black/10 bg-green/10 rounded p-5" 
                              dangerouslySetInnerHTML={{
                                __html: item.message.replaceAll("\n", "<br>"),
                              }}/>
                            {
                              (item.image != "" && item.image != null) ? (
                                <img src={item.image} className="my-3 rounded border border-black/10" />
                              ) : (
                                <></>
                              )
                            }
                            <label className={`block pt-2 truncate text-black/50 ${item.type == 1? 'text-right' : ''}`}>{formatDateAndTime(item.datetime)}</label>
                          </div>
                        </div>
                      )
                    })
                  }
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Scrollbars>
            <div className="relative">
              <InputText isSending={isSending} onSendMessage={handleSendMessage} />
              {/* <input type='text' className="w-full py-1 box-none" placeholder="write your reply here..." onChange={handleInputChange} /> */}
            </div>
          </div>
        </div>
    </>
  );
}

export default MyTicketDetail;

interface ButtonWithSpinnerProps {
  isSending: boolean;
  isMobile: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isSending,
  isMobile,
  onClick,
  children,
}) => {
  return (
    <button disabled={isSending} className={`${isMobile ? 'py-1 w-28 absolute right-4' : 'w-32 h-12 py-3'} justify-center rounded-full !bg-green text-white flex items-center`} onClick={onClick}>
      {isSending ? <FaSpinner className="spinner m-auto text-xl" /> : children}
    </button>
  );
};


const AccordionArea = styled.div`
  
  .css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded {
    min-height: 48px;
  }
  .MuiPaper-root .css-o4b71y-MuiAccordionSummary-content.Mui-expanded {
    margin: 10px 0 10px 0;
  }
  
  .css-o4b71y-MuiAccordionSummary-content.Mui-expanded {
    margin: 5px 0;
  }

  .MuiAccordionSummary-expandIconWrapper {
    display: none;
  }
  .css-o4b71y-MuiAccordionSummary-content {
    margin: 10px 0;
    -webkit-transition: none;
    transition: none;
}
`;