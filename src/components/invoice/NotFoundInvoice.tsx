import React from "react";
import EmptyInvoicesIllustration from "../../assets/illustration-empty.svg";

const NotFoundInvoice = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <img src={EmptyInvoicesIllustration} alt="No invoices" className="mb-6 w-48 h-auto"/>
            <h2 className="text-[#DFE3FA] text-xl font-bold mb-2">There is nothing here</h2>
            <p className="text-[#DFE3FA] max-w-xs">Please check the invoice ID and try again</p>
        </div>
    )
}

export default NotFoundInvoice;