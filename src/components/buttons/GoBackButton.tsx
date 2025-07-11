import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "../../assets/icon-arrow-left.svg";

const GoBackButton = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-baseline gap-2 p-5 cursor-pointer" onClick={() => navigate(-1)}>
              <img src={ArrowLeft} alt="arrow left" className="mr-2"/>
              <button className="dark:text-white cursor-pointer font-bold">
                Go back
              </button>
        </div>
    );
}   

export default GoBackButton;