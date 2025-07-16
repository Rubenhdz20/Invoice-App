import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
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
  const { user, isLoaded } = useUser();
  
  // ✅ Use user-specific invoice getter
  const getUserInvoices = useInvoiceStore((s) => s.getUserInvoices);
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const setCurrentUser = useInvoiceStore((s) => s.setCurrentUser);
  const currentUserId = useInvoiceStore((s) => s.currentUserId);
  
  const isTabletUp = useMediaQuery("(min-width: 768px)");

  // ✅ Set current user when component loads
  useEffect(() => {
    if (isLoaded && user && !currentUserId) {
      console.log('EditInvoice - Setting current user:', user.id);
      setCurrentUser(user.id);
    }
  }, [user, isLoaded, currentUserId, setCurrentUser]);

  // ✅ Get user's invoices and find the specific one
  const userInvoices = getUserInvoices();
  const invoice = userInvoices.find((inv) => inv.id === id);

  console.log('EditInvoice Debug:', {
    userId: user?.id,
    currentUserId,
    invoiceId: id,
    userInvoicesCount: userInvoices.length,
    foundInvoice: !!invoice
  });

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

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show error if invoice not found
  if (!invoice) {
    return (
      <div className="p-6 text-gray-900 dark:text-white">
        <GoBackButton />
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold mb-2">Invoice not found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The invoice you're looking for doesn't exist or you don't have permission to edit it.
          </p>
          <button 
            onClick={() => navigate('/invoices')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: InvoiceFormValues) => {
    try {
      console.log('EditInvoice - Starting update...', data);
      
      const itemsWithTotals = data.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      }));
      
      const invoiceTotal = itemsWithTotals.reduce((sum, i) => sum + i.total, 0);
      
      const updatedInvoice = {
        ...invoice,
        ...data,
        items: itemsWithTotals,
        total: invoiceTotal,
      };

      console.log('EditInvoice - About to update invoice:', updatedInvoice);
      
      updateInvoice(updatedInvoice);
      
      console.log('EditInvoice - Invoice updated successfully');
      
      if (isTabletUp) {
        onSave(); // close overlay passed from parent
      } else {
        navigate(`/invoice/${id}`, { replace: true });
      }
      
    } catch (error) {
      console.error('EditInvoice - Error updating invoice:', error);
      alert(`Error updating invoice: ${error}`);
    }
  };

  const handleCancel = () => {
    try {
      if (isTabletUp) {
        onCancel(); // close overlay passed from parent
      } else {
        navigate('/invoices'); // ✅ Navigate to invoices list instead of back
      }
    } catch (error) {
      console.error('EditInvoice - Error in handleCancel:', error);
      navigate('/invoices'); // Fallback navigation
    }
  };

  // Define a single form ID for all contexts
  const formId = "edit-invoice-form";

  // The actual form content, shared across all breakpoints
  const formContent = (
    <>
      {!isTabletUp && <GoBackButton />}
      
      {isTabletUp && (
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold dark:text-white">
              Edit <span className="text-purple">#{invoice.id}</span>
            </h1>
         </div>
      )}
      {!isTabletUp && (
        <h1 className="text-2xl font-bold dark:text-white">
          Edit <span className="text-purple">#{invoice.id}</span>
        </h1>
      )}
      <BillFromSection control={control} errors={errors} />
      <BillToSection register={register} errors={errors} />
      <DateTermsSection register={register} errors={errors} />
      <ItemsSection control={control} register={register} errors={errors} />
      <footer className="sticky bottom-0 bg-white dark:bg-dark-2 p-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-card-gray text-strong-gray dark:text-white-custom dark:bg-light-blue font-bold rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          form={formId}
          className="px-6 py-2 bg-strong-violet rounded-2xl text-white bg-strong-purple dark:bg-purple hover:bg-purple dark:hover:bg-light-blue transition-colors duration-200 cursor-pointer"
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
            {formContent}
          </form>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    // Mobile mode: render form full-screen, no animation
    return (
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="min-h-screen p-6 space-y-6 bg:dark-2 bg-white dark:bg-dark-2">
        {formContent}
      </form>
    );
  }
};

export default EditInvoice;