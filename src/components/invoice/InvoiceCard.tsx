import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

interface Invoice {
  id: string;
  createdAt: string;
  clientName: string;
  total: number;
  status: string;
}

const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const { id, createdAt, clientName, total, status } = invoice;
  const navigate = useNavigate();
  const date = dayjs(createdAt).format("DD MMM YYYY");

  const navigateToInvoice = () => {
    navigate(`/invoice/${id}`);
  };

  return (
    <div
      onClick={navigateToInvoice}
      className="grid grid-cols-[1fr_auto] p-5 gap-y-2 bg-white dark:bg-strong-blue rounded-lg cursor-pointer md:grid-cols-[1.2fr_1fr_1fr_1fr_auto_auto] md:gap-y-0 md:items-center"
    >
      <p className="text-sm text-medium-gray dark:text-light-gray md:mb-0">
        #<span className="font-bold text-dark-1 dark:text-white">{id}</span>
      </p>
      <p className="text-sm text-medium-gray dark:text-light-gray md:mb-0">Due {date}</p>
      <p className="hidden md:block text-md font-medium text-dark-1 dark:text-white">{clientName}</p>
      <p className="text-md font-bold text-dark-1 dark:text-light-gray md:justify-self-start">{formatCurrency(total)}</p>
      <span
        className={`
          hidden md:inline-flex items-center justify-center
          w-24 h-10 gap-2 text-sm font-bold rounded-md
          ${status === "Paid"
            ? "bg-[#33D69F]/10 text-[#33D69F]"
            : "bg-[#FF8B37]/10 text-[#FF8B37]"}
        `}
      >
      <span className="w-2 h-2 rounded-full bg-current" />{status}</span>
      <span className="hidden font-bold md:block md:ml-4 dark:text-purple">{">"}</span>

      {/* MOBILE ONLY BLOCKS */}
      <div className="md:hidden flex justify-between col-span-full pt-2">
        <p className="text-md font-medium text-dark-1 dark:text-white">{clientName}</p>
        <span
          className={`
            inline-flex items-center justify-center
            w-24 h-10 gap-2 text-sm font-bold rounded-md
            ${status === "Paid"
              ? "bg-[#33D69F]/10 text-[#33D69F]"
              : "bg-[#FF8B37]/10 text-[#FF8B37]"}
          `}
        >
        <span className="w-2 h-2 rounded-full bg-current" />{status}</span>
      </div>
    </div>
  );
};

export default InvoiceCard;
