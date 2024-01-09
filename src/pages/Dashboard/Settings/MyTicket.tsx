import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import { styled } from 'styled-components';
import SidebarWallet from "components/Layout/SidebarWallet";
import api from "utils/api";
import { Skeleton } from '@mui/material';
import { config } from "config";
import 'styles/deposit.scss'
import {Scrollbars} from "rc-scrollbars";


interface ticketInfo {
  id: string;
  ticket_no: string;
  subject: string;
  content: string;
  un_read_count: number;
  status: string;
}

function MyTicket() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user, setUser } = useContext(MyAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketList, setTicketList] = useState<ticketInfo[]>([]);
  
  const navigate = useNavigate();

  const getTicketData = () => {
    setIsLoading(true);
    api.get(`user/ticket/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          const ticketData: ticketInfo[] = data.filter((item: any) => item.user == user.user_id).map((item: any) => {
            return {
              id: item.id,
              ticket_no: item.no,
              subject: item.subject,
              content: item.content,
              status: item.status,
              un_read_count: item.un_read_count,
            };
          });
          setTicketList(ticketData);
        }
        setIsLoading(false);
    })
    .catch(err => {
        console.log(err);
        setIsLoading(false);
    });
  }

  useEffect(() => {
    getTicketData();
  }, []);

  useEffect(() => {
    console.log("user.ticket_status", user.ticket_status);
    if ( user.ticket_status == '1' ) {
      const ticketIndex = ticketList.findIndex((ticket) => ticket.id === user.ticket_id);

      if (ticketIndex !== -1) {
        // Make a copy of the ticketList
        console.log("ticketList", ticketList);
        const updatedTicketList = [...ticketList];
  
        // Update the ticket in the copy with the updatedTicket data
        if(user.ticket_type == 0) {
          updatedTicketList[ticketIndex] = { 
            ...updatedTicketList[ticketIndex], 
            status: '1',
            un_read_count: updatedTicketList[ticketIndex].un_read_count + 1
          };
        } else if(user.ticket_type == 1) {
          updatedTicketList[ticketIndex] = { 
            ...updatedTicketList[ticketIndex],
            un_read_count: updatedTicketList[ticketIndex].un_read_count + 1
          };
        } else if(user.ticket_type == 2) {
          updatedTicketList[ticketIndex] = { 
            ...updatedTicketList[ticketIndex], 
            status: '2' 
          };
        }
  
        // Set the updated ticketList to the state
        setTicketList(updatedTicketList);
        console.log("updatedTicketList", updatedTicketList);
        
        setUser((prevUser: any) => ({
          ...prevUser,
          ticket_status: '0',
          ticket_type: '',
          ticket_id: '',
        }));
      }
    }
  }, [user.ticket_status]);

  const selectTicket = (id: string, status: string) => {
    if (status == '1'){
      navigate(`/myticket/${id}/`);
    }
  }

  if (isMobile) {
    return (
      <>
        <div className="pt-2 pb-4 px-4">
          <div className="flex w-full justify-end items-center">
            <button className="py-2 px-4 rounded-full bg-green text-sm text-white" onClick={() => navigate('/ticket')}>+ Create ticket</button>
          </div>
          <div className="w-full mt-3 pt-2 pb-10 bg-white rounded" >
            <div >
              <ul>
                {
                  isLoading ? (
                    Array.from({ length: 10 }, (_, index) => (
                      <li className={`bg-black/10 mt-3 pl-10 py-7 pr-5 hover:bg-green/10`} key={index}>
                        <div className="flex items-center mt-2">
                          <div className="w-2/3">
                            <Skeleton animation="wave" className="" variant="rounded" />
                          </div>
                          <div className="w-1/3 flex justify-end items-center">
                            <Skeleton animation="wave" className="ml-3 " variant="rounded" width={75}/>
                          </div>
                        </div>
                        <div className="pt-1">
                          <Skeleton animation="wave" className="" variant="rounded" width={150} height={15} />
                        </div>
                        <div className="mt-0">
                          <Skeleton animation="wave" className="mt-6 " variant="rounded" />
                          <Skeleton animation="wave" className="mt-1  " variant="rounded" />
                        </div>
                      </li>
                    ))
                  ) : (
                    ticketList.length > 0 ? (
                      ticketList.map(item => {
                        return (
                          <li className={`${item.status == '1'? 'cursor-pointer': ''} bg-black/10 mt-3 pl-10 py-7 pr-5 hover:bg-green/10`} key={item.id} onClick={() => selectTicket(item.id, item.status)} >
                            <div className="flex items-center">
                              <div className="w-2/3 flex items-center">
                                {
                                  (item.un_read_count > 0 && item.status == '1') ? (
                                    <span className="block text-center rounded-full text-sm text-white w-5 h-5 mr-2" style={{ background:"#f00" }}>{ item.un_read_count }</span>
                                  ) : (
                                    <></>
                                  )
                                }
                                <label className="block text-lg font-bold truncate">{item.subject}</label>
                              </div>
                              <div className="w-1/3 flex justify-end items-center">
                                {
                                  (item.status == '0') ? (  
                                    <><button className="bg-green rounded-full px-2 py-0 text-white">Pending</button></>
                                  ) : (item.status == '1' ? (
                                    <><button className="bg-green rounded-full px-2 py-0 text-white">Active</button></>
                                  ) : (
                                    <><button className="bg-black/60 rounded-full px-2 py-0 text-white">Closed</button></>
                                  ))
                                }
                                
                              </div>
                            </div>
                            <div className="pt-0">
                              <label className="text-xs">Ticket ID: {item.ticket_no}</label>
                            </div>
                            <ContainerTicket className="mt-2">
                              <p dangerouslySetInnerHTML={{
                                  __html: item.content.replaceAll("\n", "<br>"),
                                }} />
                            </ContainerTicket>
                          </li>
                        )
                      })
                    ) : (
                      <li className="bg-black/10 mt-3 pl-10 py-3 pr-5">
                        <p>no ticket</p>
                      </li>
                    )
                  )
                }
              </ul>
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
        <div className="w-full pt-12">
          <div className="flex w-full items-center ">
            <div className="w-1/2 text-left">
              <label className="text-4xl font-bold">My Tickets</label>
            </div>
            <div className="w-1/2 flex justify-end items-center">
              <button className="py-3 px-5 rounded-full bg-green text-white" onClick={() => navigate('/ticket')}>+ Create ticket</button>
            </div>
          </div>
          <div className="w-full mt-6 pt-2 pb-10 bg-white rounded" >
            <div >
              <Scrollbars className="" style={{ width: '100%', height: 'calc(100vh - 220px)' }}>
                <ul>
                  {
                    isLoading ? (
                        Array.from({ length: 10 }, (_, index) => (
                            <li className={`bg-black/10 mt-3 pl-10 py-7 pr-5 hover:bg-green/10`} key={index}>
                              <div className="flex items-center">
                                <div className="w-1/2">
                                  <Skeleton animation="wave" className="mt-2 " variant="rounded" width={300} />
                                </div>
                                <div className="w-1/2 flex justify-end items-center">
                                  <Skeleton animation="wave" className="ml-3 " variant="rounded" width={150}/>
                                  <Skeleton animation="wave" className="ml-3 " variant="rounded" width={75} />
                                </div>
                              </div>
                              <div className="mt-3">
                                <Skeleton animation="wave" className="mt-6 " variant="rounded" />
                                <Skeleton animation="wave" className="mt-1  " variant="rounded" />
                              </div>
                            </li>
                        ))
                    ) : (
                        ticketList.length > 0 ? (
                            ticketList.map(item => {
                              return (
                                  <li className={`${item.status == '1'? 'cursor-pointer': ''} bg-black/10 mt-3 pl-10 py-7 pr-5 hover:bg-green/10`} key={item.id} onClick={() => selectTicket(item.id, item.status)} >
                                    <div className="flex items-center">
                                      <div className="w-1/2 flex items-center">
                                        {
                                          (item.un_read_count > 0 && item.status == '1') ? (
                                              <span className="block text-center rounded-full text-sm text-white w-5 h-5 mr-2" style={{ background:"#f00" }}>{ item.un_read_count }</span>
                                          ) : (
                                              <></>
                                          )
                                        }
                                        <label className="text-lg font-bold">{item.subject}</label>
                                      </div>
                                      <div className="w-1/2 flex justify-end items-center">
                                        <label className="mr-3">Ticket ID {item.ticket_no}</label>
                                        {
                                          (item.status == '0') ? (
                                              <><button className="rounded-full px-3 py-1 text-white" style={{ background:"#F7931A" }}>Pending</button></>
                                          ) : (item.status == '1' ? (
                                              <><button className="bg-green rounded-full px-3 py-1 text-white">Active</button></>
                                          ) : (
                                              <><button className="bg-black/60 rounded-full px-3 py-1 text-white">Closed</button></>
                                          ))
                                        }

                                      </div>
                                    </div>
                                    <ContainerTicket className="mt-3">
                                      <p dangerouslySetInnerHTML={{
                                        __html: item.content.replaceAll("\n", "<br>"),
                                      }} />
                                    </ContainerTicket>
                                  </li>
                              )
                            })
                        ) : (
                            <li className="bg-black/10 mt-3 pl-10 py-3 pr-5">
                              <p>no ticket</p>
                            </li>
                        )
                    )
                  }
                </ul>
              </Scrollbars>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyTicket;


const ContainerTicket = styled.div`
    /* Set the maximum height to accommodate only two lines */
    height: 3.2em; /* This value might need adjustments based on font-size and line-height */
    position: relative;
    overflow: hidden;

  p {
    /* Set the line height to control the number of lines */
    line-height: 1.6em; /* This value should be twice the desired line height */
    word-wrap: break-word;
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

`;
