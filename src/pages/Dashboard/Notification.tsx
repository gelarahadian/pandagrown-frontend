import { useEffect, useContext, useState } from "react";

import { useMobileContext } from "context/MobileContext";
import { MyAuthContext } from "context/AuthContext";

import api from "utils/api";
import {Scrollbars} from "rc-scrollbars";

interface NotyItem {
    date: string;
    type: string;
    content: string;
}

function Notification() {
  const isMobile = useMobileContext();
  const { user, setUser } = useContext(MyAuthContext);
  const [ notyList, setNotyList ] = useState<NotyItem[]>([]);

  useEffect(() => {
      setTimeout(() => {
          addNotyList();
      }, 100)
  }, []);

  const addNotyList = () => {
    api.get(`user/${user.user_id}/notifications/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          const transformedData: NotyItem[] = data.map((item: any) => {
            return {
              date: formatDate(item.updated_at),
              type: item.type,
              content: item.content,
            };
          });
          setNotyList(transformedData);
          
          localStorage.setItem('noty', '0'); // set token -> this means logged in
          setUser((prevUser: typeof MyAuthContext) => ({
            ...prevUser,
            noty: 0,
          }));
        }
        // setIsLoading(false);
    })
    .catch(err => {
        console.log(err);
        // setIsLoading(false);
    });
  }
  
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    
    // Get day, month, and year
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    // Get hours and minutes
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Construct the formatted date and time string
    const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}`;
    
    return formattedDateTime;
  }

  if (isMobile) {
    return (
        <div className="pt-2 pb-4 px-4">
            <div className="mt-5 p-5 bg-white rounded">
                { notyList.length>0 ? (
                    notyList.map((item, index) => (
                        <div className="p-5 odd:bg-black/10 hover:bg-green/10" key={index}>
                            <label className="font-bold text-sm">{item.date}</label>
                            <p className="pt-2 text-sm">{item.content}</p>
                        </div>
                    ))
                ) : (
                    <></>
                )
                }
            </div>
        </div>
    )
  }

  return (
    <>
      <div className="page-content-no-sidebar relative pb-10">
        <label className="text-4xl font-bold">Notications</label>
        <div className="mt-5 pt-4 pb-6 bg-white rounded">
            <Scrollbars style={{ width: '100%', height: 'calc(100vh - 240px)' }}>
            { notyList.length>0 ? (
                notyList.map((item, index) => (
                    <div className="pl-10 pr-12 py-3 odd:bg-black/10 hover:bg-green/10" key={index}>
                        <label className="font-bold">{item.date}</label>
                        <p className="pt-1">{item.content}</p>
                    </div>
                ))
             ) : (
                <></>
             )
            }
            </Scrollbars>
        </div>
      </div>
    </>
  );
}

export default Notification;
