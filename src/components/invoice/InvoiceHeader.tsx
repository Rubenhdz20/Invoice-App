import NewInvoiceButton from "../buttons/NewInvoiceButton";

type InvoiceHeaderProps = {
    invoiceCount: number;   
};

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceCount }) => {
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
            <NewInvoiceButton />
        </div>
    );
};

export default InvoiceHeader;