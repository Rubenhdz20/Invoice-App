import React from "react";
import LogoApp from "../assets/logoapp.svg";
import { UserButton } from '@clerk/clerk-react'
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
        <header className="flex justify-between items-center bg-strong-blue lg:flex-col lg:justify-between lg:items-center lg:w-20 lg:h-screen">
            <div>
                <img src={LogoApp} alt="Invoice App Logo" />
            </div>
            <div className="flex items-center gap-4 mr-5 lg:flex-col lg:gap-2 lg:mr-0">
                <button onClick={onToggleTheme} className="p-2 cursor-pointer">
                    {current === 'light'
                        ? <img src={Moon}/>
                        : <img src={Sun}/>
                    }
                </button>
                <div className="lg:flex lg:flex-row lg:items-center">
                    <img src={BarSeparator} alt="Bar separator" />
                </div>
                
                <UserButton
                    afterSignOutUrl="/sign-in"
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "w-8 h-8"
                        }
                    }}
                />
            </div>
        </header>
    );
}

export default Header;