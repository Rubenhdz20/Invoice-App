import { useNavigate } from "react-router-dom";

type InvoiceHeaderProps = {
    invoiceCount: number;   
};

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceCount }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center p-6 bg-[#141625] text-white">
            <div>
                <h1 className="text-2xl font-bold text-white">Invoices</h1>
                <p className="text-[#DFE3FA]">{invoiceCount} invoices</p>
            </div>
            <div className="flex items-center justify-end">
                <p className="text-xl font-bold text-white">Filter</p>
                <select name="" id="" className="w-7 text-[#7C5DFA] rounded">
                    <option></option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Draft</option>
                </select>
            </div>
            <button className="flex items-center gap-2 bg-[#7C5DFA] text-white px-2 py-2 rounded-full shadow-md hover:bg-[#9277FF] transition" onClick={() => navigate('/create-invoice')}>
                <div className="bg-white text-[#7C5DFA] rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-xl font-bold">+</span>
                </div>
                <span className="text-lg font-semibold">New</span>
            </button>
        </div>
    );
};

export default InvoiceHeader;