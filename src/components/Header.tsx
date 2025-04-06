import React from "react";
import LogoApp from "../assets/logoapp.svg";
import Point from "../assets/Combined Shape.svg";
import BarSeparator from "../assets/Rectangle.svg";
import ProfilePicture from "../assets/image-avatar.jpg";

const Header = () => {
    return (
        <header className="flex justify-between items-center bg-[#1E2139]">
            <div>
                <img src={LogoApp} alt="Invoice App Logo" />
            </div>
            <div className="flex items-center gap-4 mr-5">
                <img src={Point} alt="Point" />
                <img src={BarSeparator} alt="Bar separator" />
                <img src={ProfilePicture} alt="Profile Picture" className="w-8 h-8 rounded-full"/>
            </div>
        </header>
    );
}

export default Header;