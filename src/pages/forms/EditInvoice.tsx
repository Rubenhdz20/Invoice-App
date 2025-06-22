import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useInvoiceStore } from "../../store/InvoiceStore";
import GoBackButton from "../../components/buttons/GoBackButton";
import BillFromSection from "../../components/invoiceForms/BillFromSection";
import BillToSection from "../../components/invoiceForms/BillToSection";
import DateTermsSection from "../../components/invoiceForms/DateTermsSection";
import ItemsSection from "../../components/invoiceForms/ItemsSection";
import { InvoiceFormValues } from "./CreateInvoice";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

interface EditInvoiceProps {
  onCancel: () => void;
  onSave: () => void;
}

const EditInvoice: React.FC<EditInvoiceProps> = ({ onCancel, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoices = useInvoiceStore((s) => s.invoices);
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const invoice = invoices.find((inv) => inv.id === id);
  const isTabletUp = useMediaQuery("(min-width: 768px)"); // True for tablet and desktop

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    defaultValues: invoice && {
      createdAt: invoice.createdAt,
      paymentDue: invoice.paymentDue,
      description: invoice.description,
      paymentTerms: invoice.paymentTerms,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      senderAddress: invoice.senderAddress,
      clientAddress: invoice.clientAddress,
      items: invoice.items,
      status: invoice.status,
    },
  });

  useEffect(() => {
    if (invoice) reset(invoice as any);
  }, [invoice, reset]);

  if (!invoice) {
    return (
      <div className="p-6 text-white">
        <GoBackButton />
        Invoice not found
      </div>
    );
  }

  const onSubmit = (data: InvoiceFormValues) => {
    const itemsWithTotals = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    }));
    const invoiceTotal = itemsWithTotals.reduce((sum, i) => sum + i.total, 0);
    updateInvoice({
      ...invoice,
      ...data,
      items: itemsWithTotals,
      total: invoiceTotal,
    });
    if (isTabletUp) {
      onSave(); // close overlay passed from parent
    } else {
      navigate(`/invoice/${id}`, { replace: true });
    }
    console.log("🏁 onSubmit fired with", data);
  };

  const handleCancel = () => {
    // This logic should also be consolidated
    if (isTabletUp) {
      onCancel(); // close overlay passed from parent
    } else {
      navigate(-1); // navigate back to previous page (detail page) on mobile
    }
  };

  // Define a single form ID for all contexts
  const formId = "edit-invoice-form";

  // The actual form content, shared across all breakpoints
  const formContent = (
    <>
      {/* GoBackButton and H1 might need conditional rendering or layout adjustments with Tailwind
          if their positions differ significantly between mobile and tablet/desktop.
          For now, I'm putting them here. */}
      {/* If GoBackButton's appearance/placement is different on mobile/tablet */}
      {!isTabletUp && <GoBackButton />} {/* Mobile-only placement */}
      
      {isTabletUp && ( // Tablet/Desktop specific placement and wrapper for h1 & back button
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold dark:text-white">
              Edit <span className="text-purple">#{invoice.id}</span>
            </h1>
         </div>
      )}
      {!isTabletUp && ( // Mobile specific h1
        <h1 className="text-2xl font-bold dark:text-white">Edit <span className="text-purple">#{invoice.id}</span></h1>
      )}
      <BillFromSection control={control} errors={errors} />
      <BillToSection register={register} errors={errors} />
      <DateTermsSection register={register} errors={errors} />
      <ItemsSection control={control} register={register} errors={errors} />
      <footer className="sticky bottom-0 bg-white dark:bg-dark-2 p-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-card-gray text-strong-gray dark:text-white-custom dark:bg-light-blue font-bold rounded-2xl cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          form={formId} // IMPORTANT: Use the single formId here
          className="px-6 py-2 bg-strong-violet rounded-2xl text-white bg-strong-purple dark:bg-purple hover:bg-purple dark:hover:bg-light-blue transition-colors duration-200 cursor-pointer "
          // No need for onClick={handleSubmit(onSubmit)} if type="submit" and form ID is correct
          // The form's onSubmit handler will take care of it
        >
          Save Changes
        </button>
      </footer>
    </>
  );

  // Conditional rendering of the Animated Panel vs. full-screen form

  if (isTabletUp) {
    return (
     <AnimatePresence>
        {/* BACKDROP */}
        <motion.div
          key="edit-backdrop"
          className="fixed inset-0 bg-black dark:bg-black/60 z-10"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={handleCancel}
        />

        {/* SLIDING PANEL */}
        <motion.div
          key="edit-panel"
          className="fixed inset-y-0 left-0 w-full max-w-md md:max-w-xl lg:max-w-2xl overflow-auto bg-white dark:bg-dark-2 z-20"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 0.25 }}
        >
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="min-h-full p-6 space-y-6">
            {formContent} {/* Render the shared content here */}
          </form>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    // Mobile mode: render form full-screen, no animation
    return (
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="min-h-screen p-6 space-y-6 bg:dark-2 bg-white dark:bg-dark-2">
        {formContent} {/* Render the shared content here */}
      </form>
    );
  }
};

export default EditInvoice;