import React from "react";
import LogoApp from "../assets/logoapp.svg";
import Point from "../assets/Combined Shape.svg";
import BarSeparator from "../assets/Rectangle.svg";
import ProfilePicture from "../assets/image-avatar.jpg";
import Moon from "../assets/icon-moon.svg";
import Sun from "../assets/icon-sun.svg";

interface Props {
  onToggleTheme: () => void
  current: 'light'|'dark'
}

const Header: React.FC<Props> = ({ onToggleTheme, current }) => {
    return (
        <header className="flex justify-between items-center bg-[#1E2139]">
            <div>
                <img src={LogoApp} alt="Invoice App Logo" />
            </div>
            <div className="flex items-center gap-4 mr-5">
                <button onClick={onToggleTheme} className="p-2 cursor-pointer">
                    {current === 'light'
                        ? <img src={Moon}/>
                        : <img src={Sun}/>
                    }
                </button>
                <img src={BarSeparator} alt="Bar separator" />
                <img src={ProfilePicture} alt="Profile Picture" className="w-8 h-8 rounded-full"/>
            </div>
        </header>
    );
}

export default Header;