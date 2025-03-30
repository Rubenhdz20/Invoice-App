import React from "react";

const EmptyInvoices = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <img src="src/assets/illustration-empty.svg" alt="No invoices" className="mb-6 w-48 h-auto"/>
            <h2 className="text-[#DFE3FA] text-xl font-bold mb-2">There is nothing here</h2>
            <p className="text-[#DFE3FA] max-w-xs">Create an invoice by clicking the <br/><strong>New</strong> button and get started</p>
        </div>
    )
}

export default EmptyInvoices;