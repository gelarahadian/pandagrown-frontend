import { useMobileContext } from "context/MobileContext";
import { useTabletContext } from "context/TabletContext";
import { MyAuthContext } from "context/AuthContext";
import PhotoButton from "components/Account/PhotoButton";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PhoneInput from "react-phone-input-2";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
// import Skeleton from "react-loading-skeleton";
import { Skeleton } from "@mui/material";
import { FaSpinner } from "react-icons/fa";
import api from "utils/api";
import CountrySelect from "components/Account/CountrySelect";
import SidebarProfile from "components/Layout/SidebarProfile";
import { Scrollbars } from "rc-scrollbars";

import "react-datepicker/dist/react-datepicker.css";
import "styles/phone-number.scss";
import "react-toastify/dist/ReactToastify.css";
import "styles/accountsetup.scss";
import { config } from "../../../config";

interface ButtonWithSpinnerProps {
  isDisabled: boolean;
  isLoading: boolean;
  isMobile: boolean;
  children: React.ReactNode;
}
const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  isDisabled,
  isLoading,
  isMobile,
  children,
}) => {
  return (
    <button
      disabled={!isDisabled || isLoading}
      className={`${
        isDisabled ? "btn-green !bg-green" : "btn-gray"
      } rounded-5 ${
        children == "Upload photo" && !isMobile ? "absolute" : ""
      } bottom-0 ${!isMobile ? "w-368" : "w-full py-4"}`}
    >
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

function AccountSetup() {
  const isMobile = useMobileContext();
  const isTablet = useTabletContext();
  const [imageFile, setImageFile] = useState<File>();
  const { user, setUser } = useContext(MyAuthContext);
  const [userInfo, setUserInfo] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs("2022-04-17")
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploadPhoto, setIsUploadPhoto] = useState(false);
  const [isUploadProfile, setIsUploadProfile] = useState(false);
  const [isUpPhotoDisable, setIsUpPhotoDisable] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState("us");

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
  };

  const handleCountryChange = (value: string, code: string) => {
    setUserInfo({ ...userInfo, country: value });
    setPhoneCountry(code.toLowerCase());
  };

  const handlePhotoSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!imageFile) {
      return;
    }

    setIsUploadPhoto(true);
    const formData = new FormData();

    setTimeout(() => {
      formData.append("avatar", imageFile);
      api
        .patch(
          `user/${user.user_id}/profile/${user.profile_id}/update/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          // notice
          const data = res.data;
          console.log("photo uploaded successfully", res);
          if (data.type == "success") {
            if (
              data.data.avatar ==
              config.api.API_URL + "images/avatar/avatar.jpg"
            ) {
              if (data.data.gender == "0") {
                localStorage.setItem(
                  "profile_avatar",
                  config.api.API_URL + "images/avatar/female.png"
                ); // set token -> this means logged in
                setUser((prevUser: typeof MyAuthContext) => ({
                  ...prevUser,
                  profile_avatar:
                    config.api.API_URL + "images/avatar/female.png",
                }));
              } else {
                localStorage.setItem(
                  "profile_avatar",
                  config.api.API_URL + "images/avatar/male.png"
                ); // set token -> this means logged in
                setUser((prevUser: typeof MyAuthContext) => ({
                  ...prevUser,
                  profile_avatar: config.api.API_URL + "images/avatar/male.png",
                }));
              }
            } else if (user.profile_avatar != data.data.avatar) {
              localStorage.setItem("profile_avatar", data.data.avatar); // set token -> this means logged in
              setUser((prevUser: typeof MyAuthContext) => ({
                ...prevUser,
                profile_avatar: data.data.avatar,
              }));
            }
          }
          // if(data.avatar){
          //   localStorage.setItem('profile_avatar', data.avatar); // set token -> this means logged in
          //   setUser((prevUser: typeof MyAuthContext) => ({
          //     ...prevUser,
          //     profile_avatar: data.avatar,
          //   }));
          //   toast.success("Upload success");
          // }
          setIsUploadPhoto(false);
          setIsUpPhotoDisable(false);
        })
        .catch((err) => {
          console.log("photo upload error", err);
          toast.error("Upload Failed");
          setIsUploadPhoto(false);
        });
    });
  };

  const handleGetAccountInfo = () => {
    setTimeout(() => {
      api
        .get(`user/${user.user_id}/profile/${user.profile_id}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data;
          if (res.data && Object.keys(data).length > 0) {
            setUserInfo(data);
            setPhoneNumber(data.phone);

            const birthday = new Date(data.birthday);
            setSelectedDate(dayjs(birthday));
            setLoading(true);
          }
          // notice
          console.log("get account info", data);
        })
        .catch((err) => {
          console.log("get account info error", err);
        });
    });
  };

  useEffect(() => {
    handleGetAccountInfo();
  }, []);

  const handleInfoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploadProfile(true);

    const formData = new FormData(event.currentTarget);
    formData.append("phone", phoneNumber);
    formData.append("user", user?.user_id || "");

    setTimeout(() => {
      api
        .put(
          `user/${user.user_id}/profile/${user.profile_id}/update/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res: any) => {
          const data = res.data;
          if (data.country) {
            localStorage.setItem("profile_country", data.country); // set token -> this means logged in
            setUser((prevUser: typeof MyAuthContext) => ({
              ...prevUser,
              profile_country: data.country,
            }));
          }

          if (data.avatar == config.api.API_URL + "images/avatar/avatar.jpg") {
            if (data.gender == "0") {
              localStorage.setItem(
                "profile_avatar",
                config.api.API_URL + "images/avatar/female.png"
              ); // set token -> this means logged in
              setUser((prevUser: typeof MyAuthContext) => ({
                ...prevUser,
                profile_avatar: config.api.API_URL + "images/avatar/female.png",
              }));
            } else {
              localStorage.setItem(
                "profile_avatar",
                config.api.API_URL + "images/avatar/male.png"
              ); // set token -> this means logged in
              setUser((prevUser: typeof MyAuthContext) => ({
                ...prevUser,
                profile_avatar: config.api.API_URL + "images/avatar/male.png",
              }));
            }
          } else if (user.profile_avatar != data.avatar) {
            localStorage.setItem("profile_avatar", data.avatar); // set token -> this means logged in
            setUser((prevUser: typeof MyAuthContext) => ({
              ...prevUser,
              profile_avatar: data.avatar,
            }));
          }
          setIsUploadProfile(false);
          toast.success("Profile update success");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Profile update failed");
          setIsUploadProfile(false);
        });
    });
  };

  const onSelectPhoto = () => {
    setIsUpPhotoDisable(true);
  };

  if (isMobile) {
    return (
      <>
        <div className="pt-2 pb-4 px-4">
          <div className="border-gray border rounded-5">
            <div className="px-7 py-4 bg-gray font-bold">Profile Picture</div>
            <form onSubmit={handlePhotoSubmit} className="py-8 px-7 bg-white">
              <div className="mb-4" style={{ minHeight: "124px" }}>
                <PhotoButton
                  setFile={setImageFile}
                  onSelect={onSelectPhoto}
                  defaultImage={userInfo?.avatar || null}
                />
              </div>
              <div className="text-base pb-3">
                <p>
                  We recommend you to use a photo that clearly shows your face.
                </p>
                <label className="font-bold mt-2 block">360x360 pixels.</label>
              </div>
              <ButtonWithSpinner
                isDisabled={isUpPhotoDisable}
                isLoading={isUploadPhoto}
                isMobile={true}
              >
                Upload photo
              </ButtonWithSpinner>
            </form>
          </div>
          <form
            onSubmit={handleInfoSubmit}
            className="mt-7 border-gray border rounded-5 mobile-account-info"
          >
            <div className="px-7 py-4 bg-gray font-bold">
              Personal Information
            </div>
            <div className="py-4 px-7 bg-white">
              <label className="block mb-3" htmlFor="fname">
                First Name
              </label>
              <input
                className="h-57 rounded-5 border border-gray p-4 green"
                id="fname"
                name="f_name"
                defaultValue={userInfo?.f_name || ""}
              />
              <label className="block mb-3" htmlFor="lname">
                Last Name
              </label>
              <input
                className="h-57 rounded-5 border border-gray p-4 green"
                id="lname"
                name="l_name"
                defaultValue={userInfo?.l_name || ""}
              />
              <label className="block my-3 text-sm">
                Anyone will be able to read your first name.
              </label>
              <label className="block" htmlFor="gender">
                Gender
              </label>
              <select
                className="h-57 bg-white w-full rounded-5 border border-gray p-4 my-3"
                placeholder="Select Gender"
                id="gender"
                name="gender"
                value={userInfo?.gender || "-1"}
              >
                <option value="-1">None</option>
                <option value="0">Female</option>
                <option value="1">Male</option>
                <option value="2">Not say</option>
              </select>
              <label className="block" htmlFor="birthday">
                Date of Birth
              </label>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker className="w-full h-57" />
                </DemoContainer>
              </LocalizationProvider> */}
              {/* <DatePicker
                id="birthday"
                name="birthday"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                placeholderText="Select Date"
                className="h-57 rounded-5 border border-gray p-4 my-3"
              /> */}
              <label className="block" htmlFor="email">
                Email Address
              </label>
              <input
                className="h-57 rounded-5 border border-gray p-4 my-3 green"
                id="email"
                name="email"
                defaultValue={userInfo?.email || ""}
                readOnly
              />
              <label className="block" htmlFor="address">
                Address
              </label>
              <textarea
                rows={5}
                className="rounded-5 border border-gray p-4 my-3 green"
                id="address"
                name="address"
                defaultValue={userInfo?.address || ""}
              />
              <label className="block" htmlFor="country">
                Country
              </label>
              <CountrySelect
                value={userInfo?.country || "United States"}
                onChange={handleCountryChange}
              />
              <label className="block" htmlFor="city">
                City
              </label>
              <input
                className="h-57 rounded-5 border border-gray p-4 my-3 green"
                id="city"
                name="city"
                defaultValue={userInfo?.city || ""}
              />
              <label className="block" htmlFor="zip_code">
                Zip Code
              </label>
              <input
                className="h-57 rounded-5 border border-gray p-4 my-3 green"
                id="zip"
                name="zip"
                defaultValue={userInfo?.zip || ""}
              />
              <label className="block" htmlFor="phone_no">
                Phone No.
              </label>
              <PhoneInput
                specialLabel={""}
                country={phoneCountry}
                onChange={handlePhoneChange}
                value={phoneNumber}
                countryCodeEditable={false}
                disableDropdown
              />
              <label className="block mt-3" htmlFor="telegram_no">
                Telegram No.
              </label>
              <input
                className="h-57 rounded-5 border border-gray p-4 my-3 green"
                id="telegram_no"
                name="telegram"
              />
              <div className="mt-4 mb-6">
                <ButtonWithSpinner
                  isDisabled={true}
                  isLoading={isUploadProfile}
                  isMobile={true}
                >
                  Save Profile
                </ButtonWithSpinner>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      {isTablet ? <></> : <SidebarProfile />}
      <div className={`${isTablet ? "!ml-0" : ""} page-content relative !pr-0`}>
        {loading ? (
          <div className="pt-12 pb-10">
            <h5 className="text-4xl font-bold mb-3">Profile</h5>
            {/* <div>
              <NavLink to="/cloneshop" className="btn-skip">
                <label className="info-box mr-2" >i</label>
                Skip this step
              </NavLink>
            </div> */}
            <Scrollbars
              style={{ width: "100%", height: "calc(100vh - 200px)" }}
            >
              <div>
                <div className="flex">
                  <div className="w-full pr-10">
                    <div className="mt-2 card bg-white">
                      <div className="card-title font-bold">
                        Profile Picture
                      </div>
                      <div className="card-content px-7 pt-6 pb-7">
                        <form onSubmit={handlePhotoSubmit}>
                          <PhotoButton
                            setFile={setImageFile}
                            onSelect={onSelectPhoto}
                            defaultImage={user?.profile_avatar || null}
                          />
                          <div
                            style={{ marginLeft: "180px", height: "157px" }}
                            className="relative"
                          >
                            <div>
                              We recommend you to use clear frontal face for
                              your profile picture. Be sure to use a photo that
                              clearly shows your face and doesn’t include any
                              personal or sensitive information.
                            </div>
                            <ButtonWithSpinner
                              isDisabled={isUpPhotoDisable}
                              isLoading={isUploadPhoto}
                              isMobile={false}
                            >
                              Upload photo
                            </ButtonWithSpinner>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="mt-6 card bg-white">
                      <div className="card-title font-bold">
                        Personal Information
                      </div>
                      <form onSubmit={handleInfoSubmit}>
                        <div className="card-content pt-10 pb-7">
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="fname"
                            >
                              First Name
                            </label>
                            <div className="control-container">
                              <input
                                id="fname"
                                name="f_name"
                                defaultValue={userInfo?.f_name || ""}
                                className="green"
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="lname"
                            >
                              Last Name
                            </label>
                            <div className="control-container">
                              <input
                                id="lname"
                                name="l_name"
                                defaultValue={userInfo?.l_name || ""}
                                className="green"
                              />
                              <label>
                                Anyone will only be able to read your first
                                name.
                              </label>
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="gender"
                            >
                              Gender
                            </label>
                            <div className="control-container">
                              <select
                                className="bg-white"
                                placeholder="Select Gender"
                                id="gender"
                                name="gender"
                                value={userInfo?.gender || "-1"}
                                onChange={(e) =>
                                  setUserInfo({
                                    ...userInfo,
                                    gender: e.target.value,
                                  })
                                }
                              >
                                <option value="-1">None</option>
                                <option value="0">Female</option>
                                <option value="1">Male</option>
                                <option value="2">Not say</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="birthday"
                            >
                              Date Birth
                            </label>
                            <div className="control-container">
                              {/* <DatePicker
                            id="birthday"
                            name="birthday"
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            showYearDropdown
                            showMonthDropdown
                            placeholderText="Select Date"
                          /> */}
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                  <DatePicker
                                    label="Select Date"
                                    value={selectedDate}
                                    onChange={(newValue) =>
                                      setSelectedDate(newValue)
                                    }
                                    format="YYYY-MM-DD"
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="email"
                            >
                              Email Address
                            </label>
                            <div className="control-container">
                              <input
                                type="email"
                                id="email"
                                name="email"
                                className="green"
                                defaultValue={userInfo?.email || ""}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="address"
                            >
                              Address
                            </label>
                            <div className="control-container">
                              <textarea
                                rows={5}
                                className="rounded-5 border border-gray p-4 my-3 green"
                                id="address"
                                name="address"
                                defaultValue={userInfo?.address || ""}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control py-4"
                              htmlFor="country"
                            >
                              Country
                            </label>
                            <div className="control-container">
                              <CountrySelect
                                value={userInfo?.country || "United States"}
                                onChange={handleCountryChange}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="city"
                            >
                              City
                            </label>
                            <div className="control-container">
                              <input
                                id="city"
                                name="city"
                                className="green"
                                defaultValue={userInfo?.city || ""}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="zip"
                            >
                              Zip Code
                            </label>
                            <div className="control-container">
                              <input
                                id="zip"
                                name="zip"
                                className="green"
                                defaultValue={userInfo?.zip || ""}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="phone"
                            >
                              Phone No.
                            </label>
                            <div className="control-container">
                              <PhoneInput
                                specialLabel={""}
                                country={phoneCountry}
                                onChange={handlePhoneChange}
                                value={phoneNumber}
                                countryCodeEditable={false}
                                disableDropdown
                              />
                              {/* <label>You will need to verify your phone number. Click to <button color="text-green">verify</button> my phone number.</label> */}
                            </div>
                          </div>
                          <div className="form-row">
                            <label
                              className="text-right label-control"
                              htmlFor="telegram"
                            >
                              Telegram No.
                            </label>
                            <div className="control-container">
                              <input
                                id="telegram"
                                name="telegram"
                                className="green"
                                defaultValue={userInfo?.telegram || ""}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="control-container relative">
                              <ButtonWithSpinner
                                isDisabled={true}
                                isLoading={isUploadProfile}
                                isMobile={false}
                              >
                                Save Profile
                              </ButtonWithSpinner>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* <div className="w-1/4 mt-2">
                <div className="mx-auto px-12" >
                  <h5 className="font-bold text-xl mb-3">Setting up your account</h5>
                  <p>
                    Complete All the information below to continue.
                    You may skip this part, but you will need to complete all the
                    fields below to start investing.
                  </p>
                </div>
              </div> */}
                </div>
              </div>
            </Scrollbars>
          </div>
        ) : (
          <div className="pt-10">
            <h5 className="font-bold text-xl mb-3">
              <Skeleton animation="wave" height={40} width={200} />
            </h5>
            <div className="flex">
              <div className="w-full">
                <div className="mt-2 card bg-white">
                  <div className="card-title">
                    <Skeleton animation="wave" width={150} />
                  </div>
                  <div className="card-content px-7 pt-6 pb-7 flex">
                    <div style={{ height: "157px" }}>
                      <Skeleton
                        animation="wave"
                        variant="circular"
                        height={157}
                        width={157}
                      />
                    </div>
                    <div
                      style={{
                        marginLeft: "23px",
                        height: "157px",
                        width: "calc(100% - 16px)",
                      }}
                      className="relative"
                    >
                      <div>
                        <Skeleton
                          animation="wave"
                          variant="rectangular"
                          height={72}
                        />
                      </div>
                      <div className="absolute w-368 bottom-0">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={55}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 card bg-white">
                  <div className="card-title">
                    <Skeleton animation="wave" width={150} />
                  </div>
                  <div className="card-content pt-10 pb-7">
                    <div className="form-row">
                      <label
                        className="text-right label-control pl-16 pt-4"
                        htmlFor="fname"
                      >
                        <Skeleton animation="wave" variant="rounded" />
                      </label>
                      <div className="control-container">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={57}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label
                        className="text-right label-control pl-16 pt-4"
                        htmlFor="fname"
                      >
                        <Skeleton animation="wave" variant="rounded" />
                      </label>
                      <div className="control-container">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={57}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label
                        className="text-right label-control pl-16 pt-4"
                        htmlFor="fname"
                      >
                        <Skeleton animation="wave" variant="rounded" />
                      </label>
                      <div className="control-container">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={57}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label
                        className="text-right label-control pl-16 pt-4"
                        htmlFor="fname"
                      >
                        <Skeleton animation="wave" variant="rounded" />
                      </label>
                      <div className="control-container">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={57}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label
                        className="text-right label-control pl-16 pt-4"
                        htmlFor="fname"
                      >
                        <Skeleton animation="wave" variant="rounded" />
                      </label>
                      <div className="control-container">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={127}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label
                        className="text-right label-control pl-16 pt-4"
                        htmlFor="fname"
                      >
                        <Skeleton animation="wave" variant="rounded" />
                      </label>
                      <div className="control-container">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={57}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label
                        className="text-right label-control pl-16 pt-4"
                        htmlFor="fname"
                      >
                        <Skeleton animation="wave" variant="rounded" />
                      </label>
                      <div className="control-container">
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          height={57}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // if (isMobile) {
  //   return (
  //     <AuthLayoutMobile error="" setError={null}>
  //       <div className="bg-green text-white flex py-6 mb-6"
  //         style={{ marginLeft: '-35px', marginRight: '-35px', paddingLeft: '35px', paddingRight: '35px' }}>
  //         <label className="my-auto text-xl font-bold">Account Setup</label>
  //         <NavLink to="/cloneshop" className="border-white border ml-auto py-4 px-11 rounded-5 text-white">Skip</NavLink>
  //       </div>
  //       <div>Complete all the information below to continue.
  //         You may skip this part, but you will need to complete all the fields below to start
  //         investing.
  //       </div>
  //       <div className="mt-6 border-gray border rounded-5">
  //         <div className="px-7 py-4 bg-gray font-bold">Profile Picture</div>
  //         <form onSubmit={handlePhotoSubmit} className="py-8 px-7">
  //           <div className="mb-4" style={{ minHeight: '124px' }}>
  //             <PhotoButton setFile={setImageFile} onSelect={onSelectPhoto} defaultImage={userInfo?.avatar || null} />
  //             <div className="text-sm" style={{ marginLeft: '144px' }}>
  //               <p>We recommend you to use a photo that clearly shows your face.</p>
  //               <label className="font-bold mt-2 block">360x360 pixels.</label>
  //             </div>
  //           </div>
  //           <div className="clear-both"></div>
  //           <ButtonWithSpinner isDisabled={isUpPhotoDisable} isLoading={isUploadPhoto} isMobile={true} >
  //             Upload photo
  //           </ButtonWithSpinner>
  //         </form>
  //       </div>
  //       <form onSubmit={handleInfoSubmit} className="mt-7 border-gray border rounded-5 mobile-account-info">
  //         <div className="px-7 py-4 bg-gray font-bold">Personal Information</div>
  //         <div className="py-4 px-7">
  //           <label className="block mb-3" htmlFor="fname">First Name</label>
  //           <input className="h-57 rounded-5 border border-gray p-4 green" id="fname" name="f_name" defaultValue={userInfo?.f_name || ''} />
  //           <label className="block mb-3" htmlFor="lname">Last Name</label>
  //           <input className="h-57 rounded-5 border border-gray p-4 green" id="lname" name="l_name" defaultValue={userInfo?.l_name || ''} />
  //           <label className="block my-3 text-sm">Anyone will be able to read your first name.</label>
  //           <label className="block" htmlFor="gender">Gender</label>
  //           <select className="h-57 w-full rounded-5 border border-gray p-4 my-3" placeholder="Select Gender" id="gender" name="gender" value={userInfo?.gender || '-1'}>
  //             <option value="-1" >None</option>
  //             <option value="0" >Female</option>
  //             <option value="1" >Male</option>
  //             <option value="2" >Not say</option>
  //           </select>
  //           <label className="block" htmlFor="birthday">Date of Birth</label>
  //           <DatePicker
  //             id="birthday"
  //             name="birthday"
  //             selected={selectedDate}
  //             onChange={handleDateChange}
  //             dateFormat="yyyy-MM-dd"
  //             showYearDropdown
  //             showMonthDropdown
  //             placeholderText="Select Date"
  //             className="h-57 rounded-5 border border-gray p-4 my-3"
  //           />
  //           <label className="block" htmlFor="email">Email Address</label>
  //           <input className="h-57 rounded-5 border border-gray p-4 my-3 green" id="email" name="email" defaultValue={userInfo?.email || ''} readOnly/>
  //           <label className="block" htmlFor="address">Address</label>
  //           <textarea rows={5} className="rounded-5 border border-gray p-4 my-3 green" id="address" name="address" defaultValue={userInfo?.address || ''} />
  //           <label className="block" htmlFor="country">Country</label>
  //           <CountrySelect value={userInfo?.country || 'United States'} onChange={handleCountryChange} />
  //           <label className="block" htmlFor="city">City</label>
  //           <input className="h-57 rounded-5 border border-gray p-4 my-3 green" id="city" name="city" defaultValue={userInfo?.city || ''} />
  //           <label className="block" htmlFor="zip_code">Zip Code</label>
  //           <input className="h-57 rounded-5 border border-gray p-4 my-3 green" id="zip" name="zip" defaultValue={userInfo?.zip || ''} />
  //           <label className="block" htmlFor="phone_no">Phone No.</label>
  //           <PhoneInput
  //             specialLabel={''}
  //             country={phoneCountry}
  //             onChange={handlePhoneChange}
  //             value={phoneNumber}
  //             countryCodeEditable={false}
  //             disableDropdown
  //           />
  //           <label className="block mt-3" htmlFor="telegram_no">Telegram No.</label>
  //           <input className="h-57 rounded-5 border border-gray p-4 my-3 green" id="telegram_no" name="telegram" />
  //           <div className="mt-4 mb-6">
  //             <ButtonWithSpinner isDisabled={true} isLoading={isUploadProfile} isMobile={true} >
  //               Save Profile
  //             </ButtonWithSpinner>
  //           </div>
  //         </div>
  //       </form>
  //     </AuthLayoutMobile>
  //   )
  // }

  // return (
  //   <>
  //     <Scrollbars style={{ width: '100%', height: '100vh' }}>
  //     {loading ? (
  //       <div>
  //         <div className="topbar flex">
  //           <a href="/">
  //             <img src={logo} className="logo" />
  //           </a>
  //           {/* <div className="navs">
  //             <NavLink to="/how">How it works</NavLink>
  //             <NavLink to="/faq">FAQ</NavLink>
  //           </div> */}
  //         </div>
  //         <div style={{ marginBottom: '45px' }}>
  //           <div className="float-left" style={{ width: '367px', paddingLeft: '88px' }}>
  //             <h5 className="font-bold text-xl mb-3">Setting up your account</h5>
  //             <p>
  //               Complete All the information below to continue.
  //               You may skip this part, but you will need to complete all the
  //               fields below to start investing.
  //             </p>
  //           </div>
  //           <div style={{ marginLeft: '420px', maxWidth: '900px' }}>
  //             <h5 className="font-bold text-xl mb-3">Account Setup</h5>
  //             <div>
  //               <NavLink to="/cloneshop" className="btn-skip">
  //                 <label className="info-box mr-2" style={{ lineHeight: '23px', }}>i</label>
  //                 Skip this step
  //               </NavLink>
  //             </div>
  //             <div className="mt-6 card">
  //               <div className="card-title">Profile Picture</div>
  //               <div className="card-content px-7 pt-6 pb-7">
  //                 <form onSubmit={handlePhotoSubmit}>
  //                   <PhotoButton setFile={setImageFile} onSelect={onSelectPhoto} defaultImage={userInfo?.avatar || null} />
  //                   <div style={{ marginLeft: '180px', height: '157px' }} className="relative">
  //                     <div>
  //                       We recommend you to use clear frontal face for your profile picture.
  //                       Be sure to use a photo that clearly shows your face and doesn’t include any personal
  //                       or sensitive information.
  //                     </div>
  //                     <ButtonWithSpinner isDisabled={isUpPhotoDisable} isLoading={isUploadPhoto} isMobile={false} >
  //                       Upload photo
  //                     </ButtonWithSpinner>
  //                   </div>
  //                 </form>
  //               </div>
  //             </div>
  //             <div className="mt-6 card">
  //               <div className="card-title">Personal Information</div>
  //               <form onSubmit={handleInfoSubmit}>
  //                 <div className="card-content pt-10 pb-7">
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="fname">First Name</label>
  //                     <div className="control-container">
  //                       <input id="fname" name="f_name" defaultValue={userInfo?.f_name || ''} className="green" />
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="lname">Last Name</label>
  //                     <div className="control-container">
  //                       <input id="lname" name="l_name" defaultValue={userInfo?.l_name || ''} className="green" />
  //                       <label>Anyone will only be able to read your first name.</label>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="gender">Gender</label>
  //                     <div className="control-container">
  //                       <select placeholder="Select Gender" id="gender" name="gender" value={userInfo?.gender || '-1'} onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}>
  //                         <option value="-1" >None</option>
  //                         <option value="0" >Female</option>
  //                         <option value="1" >Male</option>
  //                         <option value="2" >Not say</option>
  //                       </select>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="birthday">Date Birth</label>
  //                     <div className="control-container">
  //                       <DatePicker
  //                         id="birthday"
  //                         name="birthday"
  //                         selected={selectedDate}
  //                         onChange={handleDateChange}
  //                         dateFormat="yyyy-MM-dd"
  //                         showYearDropdown
  //                         showMonthDropdown
  //                         placeholderText="Select Date"
  //                       />
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="email">Email Address</label>
  //                     <div className="control-container">
  //                       <input type="email" id="email" name="email" className="green" defaultValue={userInfo?.email || ''} readOnly/>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="address">Address</label>
  //                     <div className="control-container">
  //                       <textarea rows={5} className="rounded-5 border border-gray p-4 my-3 green"
  //                         id="address"
  //                         name="address"
  //                         defaultValue={userInfo?.address || ''} />
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="country">Country</label>
  //                     <div className="control-container">
  //                       <CountrySelect value={userInfo?.country || 'United States'}
  //                         onChange={handleCountryChange}
  //                       />
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="city">City</label>
  //                     <div className="control-container">
  //                       <input id="city" name="city" className="green" defaultValue={userInfo?.city || ''} />
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="zip">Zip Code</label>
  //                     <div className="control-container">
  //                       <input id="zip" name="zip" className="green" defaultValue={userInfo?.zip || ''} />
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="phone">Phone No.</label>
  //                     <div className="control-container">
  //                       <PhoneInput
  //                         specialLabel={''}
  //                         country={phoneCountry}
  //                         onChange={handlePhoneChange}
  //                         value={phoneNumber}
  //                         countryCodeEditable={false}
  //                         disableDropdown
  //                       />
  //                       {/* <label>You will need to verify your phone number. Click to <button color="text-green">verify</button> my phone number.</label> */}
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control" htmlFor="telegram">Telegram No.</label>
  //                     <div className="control-container">
  //                       <input id="telegram" name="telegram" className="green" defaultValue={userInfo?.telegram || ''} />
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <div className="control-container relative">
  //                       <ButtonWithSpinner isDisabled={true} isLoading={isUploadProfile} isMobile={false} >
  //                         Save Profile
  //                       </ButtonWithSpinner>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </form>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     ) : (
  //       <div>
  //         <div className="topbar flex">
  //           <a href="#">
  //             <Skeleton animation="wave" variant="rectangular"  height={70} />
  //           </a>
  //         </div>
  //         <div style={{ marginBottom: '45px' }}>
  //           <div className="float-left" style={{ width: '367px', paddingLeft: '88px' }}>
  //             <h5 className="font-bold text-xl mb-3"><Skeleton animation="wave"  /></h5>
  //             <p>
  //               <Skeleton animation="wave"  variant="rounded" height={100}/>
  //             </p>
  //           </div>
  //           <div style={{ marginLeft: '420px', maxWidth: '900px' }}>
  //             <h5 className="font-bold text-xl mb-3"><Skeleton animation="wave" width={150} /></h5>
  //             <div>
  //               <Skeleton animation="wave"  height={23}  width={130} />
  //             </div>
  //               <div className="mt-6 card">
  //                 <div className="card-title"><Skeleton animation="wave" width={150} /></div>
  //                 <div className="card-content px-7 pt-6 pb-7 flex">
  //                   <div style={{ height: '157px'}}><Skeleton animation="wave" variant="circular" height={157} width={157}/></div>
  //                   <div style={{ marginLeft: '23px', height: '157px', width: 'calc(100% - 16px)', }} className="relative">
  //                     <div >
  //                     <Skeleton animation="wave" variant="rectangular" height={72} />
  //                     </div>
  //                     <div className="absolute w-368 bottom-0"><Skeleton animation="wave" variant="rounded" height={55} /></div>
  //                   </div>
  //                 </div>
  //               </div>
  //               <div className="mt-6 card">
  //                 <div className="card-title"><Skeleton animation="wave" width={150} /></div>
  //                 <div className="card-content pt-10 pb-7">
  //                   <div className="form-row">
  //                     <label className="text-right label-control pl-16 pt-4" htmlFor="fname"><Skeleton animation="wave" variant="rounded" /></label>
  //                     <div className="control-container">
  //                     <Skeleton animation="wave" variant="rounded" height={57}/>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control pl-16 pt-4" htmlFor="fname"><Skeleton animation="wave" variant="rounded" /></label>
  //                     <div className="control-container">
  //                     <Skeleton animation="wave" variant="rounded" height={57}/>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control pl-16 pt-4" htmlFor="fname"><Skeleton animation="wave" variant="rounded" /></label>
  //                     <div className="control-container">
  //                     <Skeleton animation="wave" variant="rounded" height={57}/>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control pl-16 pt-4" htmlFor="fname"><Skeleton animation="wave" variant="rounded" /></label>
  //                     <div className="control-container">
  //                     <Skeleton animation="wave" variant="rounded" height={57}/>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control pl-16 pt-4" htmlFor="fname"><Skeleton animation="wave" variant="rounded" /></label>
  //                     <div className="control-container">
  //                     <Skeleton animation="wave" variant="rounded" height={127}/>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control pl-16 pt-4" htmlFor="fname"><Skeleton animation="wave" variant="rounded" /></label>
  //                     <div className="control-container">
  //                     <Skeleton animation="wave" variant="rounded" height={57}/>
  //                     </div>
  //                   </div>
  //                   <div className="form-row">
  //                     <label className="text-right label-control pl-16 pt-4" htmlFor="fname"><Skeleton animation="wave" variant="rounded" /></label>
  //                     <div className="control-container">
  //                     <Skeleton animation="wave" variant="rounded" height={57}/>
  //                     </div>
  //                   </div>
  //                 </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //     </Scrollbars>
  //   </>
  // )
}

export default AccountSetup;
