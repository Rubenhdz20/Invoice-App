import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "../../assets/icon-arrow-left.svg";

const GoBackButtonHome = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-baseline gap-2 p-5 cursor-pointer md:mt-5" onClick={() => navigate("/")}>
              <img src={ArrowLeft} alt="arrow left" className="mr-2"/>
              <button className="text-dark-1 dark:text-white font-bold cursor-pointer">
                Go back
              </button>
        </div>
    );
}   

export default GoBackButtonHome;