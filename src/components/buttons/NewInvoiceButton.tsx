import { useNavigate } from "react-router-dom";


const NewInvoiceButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            className="flex items-center justify-center gap-2 bg-[#7C5DFA] text-white px-2 py-2 rounded-full shadow-md hover:bg-[#9277FF] transition cursor-pointer" 
            onClick={() => navigate('/create-invoice')}>
            <div className="bg-white text-[#7C5DFA] rounded-full w-10 h-10 flex items-center justify-center">
                <img src="src/assets/icon-plus.svg" alt="Plus icon" />
            </div>
            <span className="text-lg font-semibold">New</span>
        </button>
    );
};

export default NewInvoiceButton;