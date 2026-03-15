import React from "react";
import Logo from "../../assets/icons/WDC-Logo.svg";
import Title from "../../assets/icons/WDC-Title.svg";

export default function WDCLogo() {
  return (
    <div className="flex flex-row justify-start items-center">
      <img src={Logo} alt="Logo" />
      <img src={Title} alt="Title" className="-ml-4" />
    </div>
  );
}
