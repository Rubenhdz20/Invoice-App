import React from "react";
import { useState } from "react";

const statuses: string[] = ["All", "Paid", "Pending", "Draft"];

const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    }

    const toggleFilter = (status: string) => {
        setSelectedFilters((prev) => {
            if (prev.indexOf(status) >= 0) {
                return prev.filter((filter) => filter !== status);
            }
            return [...prev, status];
        });
    }

    return(
        <div>
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full p-4 mr-2 text-left bg-[#141625] text-white rounded font-bold cursor-pointer">
                Filter
                {isOpen ? <img src="src/assets/Path 2.svg" alt="arrow down" /> : <img src="src/assets/icon-arrow-down.svg" alt="arrow up" />}
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-auto bg-[#252945] text-white rounded-lg shadow-lg p-3 z-50">
                    {statuses.map((status) => (
                        <label 
                            key={status}
                            className="flex items-center px-3 py-1 font-bold rounded cursor-pointer hover:text-[#7C5DFA] transition"
                        >
                            <input 
                                type="checkbox" 
                                checked={selectedFilters.includes(status)}
                                onChange={() => toggleFilter(status)}
                                className="w-4 h-4 appearance-none border-2 border-[#1E2139] bg-[#1E2139] rounded-md checked:bg-[#7C5DFA] checked:border-[#7C5DFA] checked:bg-[url('src/assets/icon-check.svg')] focus:ring-0 cursor-pointer hover:border-[#7C5DFA] transition"
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