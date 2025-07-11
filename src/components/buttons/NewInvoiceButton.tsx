import React from "react";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../../assets/icon-plus.svg";


const NewInvoiceButton = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button 
                className="flex items-center justify-center gap-2 bg-[#7C5DFA] text-white px-2 md:px-3 py-2 rounded-full shadow-md hover:bg-[#9277FF] transition cursor-pointer" 
                onClick={() => navigate('/create-invoice')}>
                <div className="bg-white text-[#7C5DFA] rounded-full w-10 h-10 flex items-center justify-center">
                    <img src={PlusIcon} alt="Plus icon" />
                </div>
                <p className="font-bold">
                    <span className="hidden md:inline">New Invoice</span>
                    <span className="inline md:hidden">New</span>
                </p>
            </button>
        </div>
    );
};

export default NewInvoiceButton;