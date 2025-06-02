import React from "react";
import { useState } from "react";
import { useInvoiceStore } from "../../store/InvoiceStore";

const statuses: string[] = ["All", "Paid", "Pending", "Draft"];

const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const filters = useInvoiceStore((state) => state.filters);
    const toggleFilter = useInvoiceStore((state) => state.toggleFilter);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    }
 
    return(
        <div>
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full p-4 mr-2 text-left text-dark-2 bg-white-custom dark:bg-dark-2 dark:text-white rounded font-bold cursor-pointer">
                Filter
                {isOpen ? <img src="src/assets/Path 2.svg" alt="arrow down" /> : <img src="src/assets/icon-arrow-down.svg" alt="arrow up" />}
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-auto bg-white dark:bg-light-blue text-dark-1 dark:text-white rounded-lg shadow-lg p-3 z-50">
                    {statuses.map((status) => (
                        <label 
                            key={status}
                            className="flex items-center px-3 py-1 font-bold rounded cursor-pointer hover:text-[#7C5DFA] transition"
                        >
                            <input 
                                type="checkbox" 
                                id={status}
                                checked={filters.includes(status)}
                                onChange={() => toggleFilter(status)}
                                className="w-4 h-4 appearance-none border-2 border-white dark:border-strong-blue bg-light-gray dark:bg-strong-blue rounded-md checked:bg-[#7C5DFA] checked:border-[#7C5DFA] checked:bg-[url('src/assets/icon-check.svg')] focus:ring-0 cursor-pointer hover:border-[#7C5DFA] transition"
                            />
                            <span className="ml-2 cursor-pointer">{status}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
};

export default FilterDropdown;