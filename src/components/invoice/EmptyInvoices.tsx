import React from "react";
import EmptyInvoicesIllustration from "../../assets/illustration-empty.svg";

const EmptyInvoices = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white-custom dark:bg-dark-2">
            <img src={EmptyInvoicesIllustration} alt="No invoices" className="w-48 h-auto mb-6"/>
            <h2 className=" text-xl font-bold mb-2 dark:text-light-gray">There is nothing here</h2>
            <p className="max-w-xs text-strong-gray dark:text-light-gray ">Create an invoice by clicking the <br/><strong>New</strong> button and get started</p>
        </div>
    )
}

export default EmptyInvoices;