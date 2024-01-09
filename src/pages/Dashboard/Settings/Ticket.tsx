import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import SidebarWallet from "components/Layout/SidebarWallet";
import api from "utils/api";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import attachImg from "assets/icons/attach-file.svg";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { config } from "config";
import { OptionInfo } from "types/common";
import 'styles/deposit.scss'

interface DepartmentInfo {
  id: string;
  name: string;
}
const Ticket = () => {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);
  const [ticketNo, setTicketNo] = useState('');
  const [departmentList, setDepartmentList] = useState<DepartmentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [options, SetOptions] = useState<OptionInfo[]>([]);
  
  const navigate = useNavigate();
  
  const getTicketNo = () => {
    api.get(`user/ticket/generate/id/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && data.type == "success") {
          setTicketNo(data.value);
        }
    })
    .catch(err => {
        console.log(err);
    });
  }
  
  const getDepartmentList = () => {
    api.get(`user/ticket/department/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && Object.keys(data).length > 0) {
          const departmentData: DepartmentInfo[] = data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          setDepartmentList(departmentData);
          const transformedMobileData: OptionInfo[] = data.map((item: any) => {
            return {
              value: item.id,
              label:
                <div className="w-full">
                    <label className="block ">{item.name}</label>
                </div>,
            };
          });
          SetOptions(transformedMobileData);
        }
    })
    .catch(err => {
        console.log(err);
    });
  }

  useEffect(() => {
    getTicketNo();
    getDepartmentList();
  }, []);

  
  const handleSubmit = (e: any) => {    
    e.preventDefault();
    setIsLoading(true);
    // return;

    const formData = new FormData(e.target);
    formData.append('no', ticketNo);
    formData.append('status', "0");
    formData.append('user', user.user_id);
    // formData.append('subject', values.subject);
    // formData.append('content', values.content);
    // formData.append('attach', fileList);

    api.post(`user/ticket/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then((res: any) => {
      const data = res.data;
      if(data) {
        toast.success("ticket created.");
        navigate('/myticket/');
      }
      setIsLoading(true);
    }).catch(err => {
      console.log(err);
      setIsLoading(true);
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Your custom logic when files are selected
    const selectedFiles = event.target.files;
    if(selectedFiles){
      setFileList(event.target.files);
    }
    console.log(selectedFiles);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  if (isMobile) {
    return (
      <>
        <div className="pt-2 pb-4 px-4">
          <div className="w-full mt-0 pt-2 pb-8 bg-white rounded">
            <div className="border-b border-black/10 px-7 py-2">
              <label className="text-lg">Ticket No. {ticketNo}</label>
            </div>
            <div className="px-7 pt-5" >
              <form onSubmit={handleSubmit}>
                <div className="w-full department-type">
                  <div className="">
                    <label className="font-bold">Department ID</label>
                  </div>
                  <div className="pt-2">
                    <Select 
                    name="department" 
                    placeholder="Please select..."
                    defaultValue={options[0]}
                    options={options}
                    />
                  </div>
                </div>
                <div className="w-full pt-5">
                  <div className="">
                    <label className="font-bold">Subject</label>
                  </div>
                  <div className="">
                    <input type="text" name="subject" className="w-full rounded px-3" placeholder="Write your subject or topic" value={subject} onChange={handleSubjectChange} />
                  </div>
                </div>
                <div className="w-full pt-5">
                  <div className="">
                    <label className="font-bold">Content</label>
                  </div>
                  <div className="">
                    <div className="relative">
                      <textarea name="content" className="h-48 rounded" placeholder="Write your message or questions"  value={content} onChange={handleContentChange} />
                      {/* <textarea className="h-48" placeholder="Write your message or questions"></textarea> */}
                      <div>
                        <label htmlFor="fileInput" className="p-3 absolute bottom-4 right-3 bg-green rounded">
                          <img src={attachImg} className="w-4 h-4" />
                        </label>
                        <input id="fileInput" name="attach" type="file" className="hidden" multiple onChange={handleFileChange} />
                      </div>
                    </div>
                    <div>
                    {(fileList && fileList.length > 0) ? (
                      <label className="text-green">{fileList.length} file{fileList.length>1?'s':''} uploaded.</label>
                    ) : (
                      <label className="text-transparent">&nbsp;</label>
                    )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end ">
                  <ButtonWithSpinner isLoading={isLoading} isDisable={!subject || !content} ><FaPaperPlane className="h-5 w-5 mr-2"/>Send</ButtonWithSpinner>
                  {/* <button className="py-3 px-5 rounded-full bg-green text-white flex items-center"><FaPaperPlane className="h-6 w-6 mr-2"/>Send</button> */}
                </div>
              </form>
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
          <label className="text-4xl font-bold">Create New Ticket</label>
          <div className="w-full mt-8 pt-2 pb-8 bg-white rounded">
            <div className="border-b border-black/10 px-7 py-2">
              <label className="text-xl">Ticket No. {ticketNo}</label>
            </div>
            <div className="px-7 pt-5" >
              <form onSubmit={handleSubmit}>
                <div className="flex w-full items-center">
                  <div className="w-1/3">
                    <label className="font-bold">Department ID</label>
                  </div>
                  <div className="w-2/3">
                    <select className="w-full bg-white h-12 px-4 border border-black/10 rounded" name="department" placeholder="Please select a department">
                      {
                        departmentList.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="flex w-full pt-5">
                  <div className="w-1/3">
                    <label className="font-bold">Subject</label>
                  </div>
                  <div className="w-2/3">
                    <input type="text" name="subject" className="w-full rounded px-4" placeholder="Write your subject or topic" value={subject} onChange={handleSubjectChange} />
                  </div>
                </div>
                <div className="flex w-full pt-5">
                  <div className="w-1/3">
                    <label className="font-bold">Content</label>
                  </div>
                  <div className="w-2/3 ">
                    <div className="relative">
                      <textarea name="content" className="h-48 rounded" placeholder="Write your message or questions" value={content} onChange={handleContentChange} />
                      {/* <textarea className="h-48" placeholder="Write your message or questions"></textarea> */}
                      <div>
                        <label htmlFor="fileInput" className="p-3 absolute bottom-4 right-3 bg-green rounded">
                          <img src={attachImg} className="w-4 h-4" />
                        </label>
                        <input id="fileInput" name="attach" type="file" className="hidden" multiple onChange={handleFileChange} />
                      </div>
                    </div>
                    <div>
                      {(fileList && fileList.length > 0) ? (
                          <label className="text-green">{fileList.length} file{fileList.length>1?'s':''} uploaded.</label>
                      ) : (
                          <label className="text-transparent">&nbsp;</label>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end ">
                  <ButtonWithSpinner isLoading={isLoading} isDisable={!subject || !content}  ><FaPaperPlane className="h-6 w-6 mr-2"/>Send</ButtonWithSpinner>
                  {/* <button className="py-3 px-5 rounded-full bg-green text-white flex items-center"><FaPaperPlane className="h-6 w-6 mr-2"/>Send</button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Ticket;


interface ButtonWithSpinnerProps {
  isLoading: boolean;
  isDisable: boolean;
  children: React.ReactNode;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isLoading,
  isDisable,
  children,
}) => {
  return (
    <button disabled={isLoading || isDisable} className={`${isDisable ? '' : '!bg-green'} w-28 h-12 justify-center py-3 rounded-full text-white flex items-center`} >
      {isLoading ? <FaSpinner className="h-6 w-6 spinner m-auto text-xl" /> : children}
    </button>
  );
};

