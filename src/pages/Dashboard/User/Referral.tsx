import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { useForm } from 'react-hook-form';
import { MyAuthContext } from "context/AuthContext";
import SidebarProfile from "components/Layout/SidebarProfile";
import { toast } from 'react-toastify';
import api from "utils/api";
import { FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import {Scrollbars} from "rc-scrollbars";

interface ReferralInfo {
  name: string;
  country: string;
  email: string;
}

function Referral() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const { user } = useContext(MyAuthContext);
  const [referralLink, setReferralLink] = useState('');
  const [myReferrList, setMyReferrList] = useState<ReferralInfo[]>([]);
  const [isCopy, setIsCopy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable1, setIsDisable1] = useState(true);
  const [isDisable2, setIsDisable2] = useState(true);
  const [isDisable3, setIsDisable3] = useState(true);
  const [isDisable4, setIsDisable4] = useState(true);
  const [name1, setName1] = useState('');
  const [email1, setEmail1] = useState('');
  const [name2, setName2] = useState('');
  const [email2, setEmail2] = useState('');
  const [name3, setName3] = useState('');
  const [email3, setEmail3] = useState('');
  const [name4, setName4] = useState('');
  const [email4, setEmail4] = useState('');
  
  const getReferralLink = () => {
    api.get(`user/${user.user_id}/referr/link/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (res.data && data.type == "success") {
          setReferralLink(data.link);
        }
    })
    .catch(err => {
        console.log(err);
    });
  }
  
  const getMyReferrallist = () => {
    api.get(`user/${user.user_id}/referrs/`, {
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
        const data = res.data;
        if (data.type == 'success' && data.referrs && Object.keys(data.referrs).length > 0) {
          const departmentData: ReferralInfo[] = data.referrs.map((item: any) => {
            return {
              name: item.name,
              country: item.referr_country,
              email: item.referr_email,
            };
          });
          setMyReferrList(departmentData);
        }
    })
    .catch(err => {
        console.log(err);
    });
  }

  useEffect(() => {
    getReferralLink();
    getMyReferrallist();
  }, []);
  
  const handleSubmit = function (values: any) {
    values.preventDefault();
    setIsLoading(true);

    let data = [];
    if(!isDisable1) {
      data.push({name: name1, email: email1});
    }
    if(!isDisable2) {
      data.push({name: name2, email: email2});
    }
    if(!isDisable3) {
      data.push({name: name3, email: email3});
    }
    if(!isDisable4) {
      data.push({name: name4, email: email4});
    }
    
    api.post(`user/${user.user_id}/referr/email/`, {
      friends: data,
    }).then((res: any) => {
      const data = res.data;
      if (res.data && data.type == "success") {
        toast.success("Invitation email successfully sent to your friends.");
      }
      setIsLoading(false);
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
    });
  }

  function isValidEmail(email: string) {
    // Basic email pattern check
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  }
  
  const handleChangeName1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName1(event.target.value);
    if (event.target.value == "") {
      setIsDisable1(true);
    } else if (isValidEmail(email1)) {
      setIsDisable1(false);
    } else {
      setIsDisable1(true);
    }
  };

  const handleChangeEmail1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail1(event.target.value);
    if (!isValidEmail(event.target.value)) {
      setIsDisable1(true);
    } else if (name1 != "") {
      setIsDisable1(false);
    } else {
      setIsDisable1(true);
    }
  };
  
  const handleChangeName2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName2(event.target.value);
    if (event.target.value == "") {
      setIsDisable2(true);
    } else if (isValidEmail(email2)) {
      setIsDisable2(false);
    } else {
      setIsDisable2(true);
    }
  };

  const handleChangeEmail2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail2(event.target.value);
    if (!isValidEmail(event.target.value)) {
      setIsDisable2(true);
    } else if (name2 != "") {
      setIsDisable2(false);
    } else {
      setIsDisable2(true);
    }
  };
  
  const handleChangeName3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName3(event.target.value);
    if (event.target.value == "") {
      setIsDisable3(true);
    } else if (isValidEmail(email3)) {
      setIsDisable3(false);
    } else {
      setIsDisable3(true);
    }
  };

  const handleChangeEmail3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail3(event.target.value);
    if (!isValidEmail(event.target.value)) {
      setIsDisable3(true);
    } else if (name3 != "") {
      setIsDisable3(false);
    } else {
      setIsDisable3(true);
    }
  };

  const handleChangeName4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName4(event.target.value);
    if (event.target.value == "") {
      setIsDisable4(true);
    } else if (isValidEmail(email4)) {
      setIsDisable4(false);
    } else {
      setIsDisable4(true);
    }
  };

  const handleChangeEmail4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail4(event.target.value);
    if (!isValidEmail(event.target.value)) {
      setIsDisable4(true);
    } else if (name4 != "") {
      setIsDisable4(false);
    } else {
      setIsDisable4(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setIsCopy(true);
        toast.success('Referral Link Copied.');
      })
      .catch((err) => console.error('Failed to copy: ', err));
  }
  
  if (isMobile) {
    return (
      <>
      <div className="pt-2 pb-4 px-4">
        <div className="w-full py-5 px-7 bg-white rounded">
          <div className="pb-5">
            <label className="block pb-1 text-xl font-bold">Referral Link</label>
            <p className="">You can copy and share this link to your friends. Once they join with your link, you’ll get 50 PGA Token for every friend that join using your link.</p>
          </div>
          <div>
            <div className="control-container">
              <input type="text" className="outline-none mb-3" value={referralLink} disabled readOnly/>
              <button  className={`btn-green w-full text-white text-base font-bold items-center mt-2 mx-auto py-5 px-4 rounded-5`} onClick={copyToClipboard} >Copy</button>
            </div>
          </div>
        </div>
        <div className="w-full mt-5 py-5 px-7 bg-white rounded">
          <div className="pb-5">
            <label className="block pb-1 text-xl font-bold">Invite your friends</label>
            <p className="">You can also invite your friends by sending them an invitation email. Simply type their name and email in the box below.</p>
          </div>
          <div className="">
            <form onSubmit={handleSubmit}  className="login-form w-full">
              <ul className="grid grid-cols-1 gap-3 list-none">
                <li>
                  <label className="font-bold">Name</label>
                  <input type="text" className="outline-none " name="name1" placeholder="Name"  value={name1} onChange={handleChangeName1}  />
                </li>
                <li>
                  <label className="font-bold">Email</label>
                  <input type="email" className="outline-none " name="email1" placeholder="Email" value={email1} onChange={handleChangeEmail1} />
                </li>
              </ul>
              <ButtonWithSpinner isDisabled={!isDisable1} isLoading={isLoading} >Send Referral</ButtonWithSpinner>
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
        <SidebarProfile />
      )}
      <div  className={`${isTablet? '!ml-0' : ''} page-content relative !pr-0 `} >
        <div className="flex">
          <div className="w-3/4 py-10 px-8">
            <label className="text-4xl font-bold">Referral</label>
            <Scrollbars style={{ width: '100%', height: 'calc(100vh - 170px)' }}>
              <div className="w-full mt-8 py-8 px-7 bg-white rounded">
                <div className="pb-5">
                  <label className="block pb-1 text-xl font-bold">Referral Link</label>
                  <p className="">You can copy and share this link to your friends. Once they join with your link, you’ll get 50 PGA Token for every friend that join using your link.</p>
                </div>
                <div>
                  <div className="control-container">
                    <input type="text" className="outline-none mb-3" value={referralLink} disabled readOnly/>
                    <button  className={`btn-green w-full text-white text-base font-bold items-center mt-2 mx-auto py-5 px-4 rounded-5`} onClick={copyToClipboard} >Copy</button>
                  </div>
                </div>
              </div>
              <div className="w-full mt-8 py-8 px-7 bg-white rounded">
                <div className="pb-5">
                  <label className="block pb-1 text-xl font-bold">Invite your friends</label>
                  <p className="">You can also invite your friends by sending them an invitation email. Simply type their name and email in the box below.</p>
                </div>
                <div className="">
                  <form onSubmit={handleSubmit}  className="login-form w-full">
                    <ul className="grid grid-cols-2 gap-3 list-none">
                      <li>
                        <label className="font-bold">Name</label>
                      </li>
                      <li>
                        <label className="font-bold">Email</label>
                      </li>
                      <li>
                        <input type="text" className="outline-none " name="name1" placeholder="Name"  value={name1} onChange={handleChangeName1}  />
                      </li>
                      <li>
                        <input type="email" className="outline-none " name="email1" placeholder="Email" value={email1} onChange={handleChangeEmail1} />
                      </li>
                      <li>
                        <input type="text" className="outline-none " name="name2" placeholder="Name"  value={name2} onChange={handleChangeName2}  />
                      </li>
                      <li>
                        <input type="email" className="outline-none " name="email2" placeholder="Email" value={email2} onChange={handleChangeEmail2} />
                      </li>
                      <li>
                        <input type="text" className="outline-none " name="name3" placeholder="Name"  value={name3} onChange={handleChangeName3}  />
                      </li>
                      <li>
                        <input type="email" className="outline-none " name="email3" placeholder="Email" value={email3} onChange={handleChangeEmail3} />
                      </li>
                      <li>
                        <input type="text" className="outline-none " name="name4" placeholder="Name"  value={name4} onChange={handleChangeName4}  />
                      </li>
                      <li>
                        <input type="email" className="outline-none " name="email4" placeholder="Email" value={email4} onChange={handleChangeEmail4} />
                      </li>
                    </ul>
                    <ButtonWithSpinner isDisabled={!isDisable1 || !isDisable2 || !isDisable3 || !isDisable4} isLoading={isLoading} >Send Referral</ButtonWithSpinner>
                  </form>
                </div>
              </div>
            </Scrollbars>

          </div>
          <div className="w-1/4 bg-white pt-12 px-6">
            <div className="pb-5">
              <label className="text-xl font-bold">My Referral</label>
            </div>
            <Scrollbars style={{ width: '100%', height: 'calc(100vh - 185px)' }}>
              {
                myReferrList.map((item, index) => (
                    <div className="mt-3 bg-black/10 rounded px-5 py-3" key={index}>
                      <label className="block font-bold pb-1">{item.name}</label>
                      <label className="block text-sm truncate">{item.email ? item.email : '--'}</label>
                    </div>
                ))
              }
            </Scrollbars>

          </div>
        </div>
      </div>
    </>
  );
}

interface ButtonWithSpinnerProps {
    isDisabled: boolean;
    isLoading: boolean;
    children: React.ReactNode;
  }
  const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
    isDisabled,
    isLoading,
    children,
  }) => {
    return (
      <button  disabled={!isDisabled || isLoading} className={`${(isDisabled) ? 'btn-green !bg-green' : 'btn-gray'} w-full text-white text-base font-bold items-center mt-3 mx-auto py-5 px-4 rounded-5`} >
        {isLoading ? (
          <>
            <FaSpinner className="spinner m-auto text-xl" />
          </>
        ) : (
          children
        )}
      </button>
    );
};

export default Referral;
