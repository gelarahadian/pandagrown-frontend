import { useTranslation } from "react-i18next";
import i18n from "i18next";
import Select from "react-select";
import "styles/flags.scss";
import "styles/landing.scss";
import { useState } from "react";

interface MobileSidebarProps {
  isSide: boolean;
}

interface LangItemProps {
  icon: string;
  name: string;
}

const LangItem = ({ icon, name }: LangItemProps) => {
  return (
    <div className="flex items-center">
      <div className={`flag ${icon}`} style={{ marginLeft: "20px" }}></div>
      <label style={{ marginLeft: "10px" }}>{name}</label>
    </div>
  );
};

export default function LanguageSelect({ isSide }: MobileSidebarProps) {
  const { t, i18n } = useTranslation();

  const languageOptions = [
    {
      value: "en",
      label: <LangItem icon="us" name="English" />,
    },
    {
      value: "cn",
      label: (
        <div className="flex items-center">
          <div className="flag cn" style={{ marginLeft: "20px" }}></div>
          <label style={{ marginLeft: "10px" }}>Chinese</label>
        </div>
      ),
    },
  ];

  const handleLanguageChange = (selectedOption: any) => {
    const selectedLanguage = selectedOption.value;
    if (i18n.changeLanguage && typeof i18n.changeLanguage === "function") {
      i18n
        .changeLanguage("en")
        .then(() => {
          console.log("Language changed successfully.");
        })
        .catch((error) => {
          console.error("Error occurred while changing language:", error);
        });
    } else {
      console.error(
        "changeLanguage function is not available in the i18n object."
      );
    }
  };
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "0px",
      borderRadius: "100px",
      background: "transparent",
      // width: '176px',
      fontWeight: "500",
      fontSize: "20px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#200E32",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      width: "0px",
    }),
  };
  const customStyles_side = {
    control: (provided: any) => ({
      ...provided,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: "30px",
      border: "0px",
      borderRadius: "100px",
      background: "transparent",
      fontWeight: "500",
      fontSize: "20px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#200E32",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      width: "0px",
    }),
  };

  return (
    <Select
      styles={isSide ? customStyles_side : customStyles}
      defaultValue={languageOptions[0]}
      options={languageOptions}
      onChange={handleLanguageChange}
      placeholder={t("Select Language")}
      isSearchable={false}
      className={isSide ? "custom-select_sidebar" : "custom-select"}
      classNamePrefix={isSide ? "custom-select_sidebar" : "custom-select"}
    />
  );
}
