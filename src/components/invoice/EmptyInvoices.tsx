import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const EmptyInvoices = () => {
    const { user } = useUser();
    const firstName = user?.firstName || "there";

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
                {/* Welcome message for new users */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome {firstName}! 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ready to create your first invoice and start managing your business?
                    </p>
                </div>

                {/* Illustration or icon */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <svg 
                            className="w-16 h-16 text-purple-600 dark:text-purple-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Additional helpful text */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Start building professional invoices in seconds
                </p>
            </div>
        </div>
    );
};

export default EmptyInvoices;