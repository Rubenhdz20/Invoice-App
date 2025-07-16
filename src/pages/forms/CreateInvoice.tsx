import React from 'react';
import {  useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';
import { useInvoiceStore, Invoice } from '../../store/InvoiceStore';
import GoBackButton from "../../components/buttons/GoBackButton";
import BillFromSection from "../../components/invoiceForms/BillFromSection";
import BillToSection from "../../components/invoiceForms/BillToSection";
import DateTermsSection from "../../components/invoiceForms/DateTermsSection";
import ItemsSection from "../../components/invoiceForms/ItemsSection";

export  type InvoiceFormValues = Omit<Invoice, 'id' | 'total'> & { status: Invoice['status'] }

const CreateInvoice: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const addInvoice = useInvoiceStore((s) => s.addInvoice);
    const currentUserId = useInvoiceStore((s) => s.currentUserId);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InvoiceFormValues>({
        defaultValues: {
            createdAt: '',
            paymentDue: '',
            description: '',
            paymentTerms: 30,
            clientName: '',
            clientEmail: '',
            senderAddress: {
                street: '',
                city: '',
                postCode: '',
                country: '',
            },
            clientAddress: {
                street: '',
                city: '',
                postCode: '',
                country: '',
            },
            items: [
                // start with one empty row
                { name: '', quantity: 1, price: 0, total: 0 },
            ],
            status: 'Draft',
        },
    });

    const onSubmit = (data: InvoiceFormValues) => {        
        try {
            // Check if user is set
            if (!currentUserId) {
                console.error('No current user ID found!');
                alert('Error: User not found. Please try signing out and back in.');
                return;
            }

            // Build a new items array where each item gets its computed total
            const itemsWithTotals = data.items.map(item => ({
                ...item,
                total: item.quantity * item.price
            }));

            const id = uuidv4().slice(0, 8);
            console.log('Generated invoice ID:', id);

            // Create the new invoice object with a unique ID
            const newInvoice = {
                ...data,
                id: id,
                items: itemsWithTotals,
                total: itemsWithTotals.reduce((acc, item) => acc + item.total, 0)
            };
            
            addInvoice(newInvoice);
            navigate('/invoices');
            
            console.log('Navigation called');
            
        } catch (error) {
            console.error('ERROR in onSubmit:', error);
            alert(`Error creating invoice: ${error}`);
        }
    };

    // Show loading if user not loaded yet
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
            <> 
                <form id="edit-invoice-form" onSubmit={handleSubmit(onSubmit)}  className="min-h-screen p-6 pb-20 space-y-6 dark:bg-dark-2 lg:max-w-screen-lg lg:flex lg:flex-col lg:justify-between lg:mx-auto">
                    <GoBackButton/>
                    <h1 className="text-2xl font-bold dark:text-white">New Invoice</h1>
                    <BillFromSection  control={control} errors={errors} />
                    <BillToSection    register={register} errors={errors} />
                    <DateTermsSection register={register} errors={errors} />
                    <ItemsSection     control={control} register={register} errors={errors} />
                </form>
                <footer className=" flex justify-center items-center px-6 py-4 space-x-4 bg-white-custom dark:bg-strong-blue ">
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Discard clicked, navigating to /invoices');
                            navigate('/invoices');
                        }}
                        className="w-20 h-12 text-purple font-bold dark:text-white bg-light-gray dark:bg-light-blue rounded-3xl hover:bg-gray-100 dark:hover:bg-white hover:text-[#7E88C3] cursor-pointer transition"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        form="edit-invoice-form"
                        className="w-36 h-12 text-white font-bold bg-[#7C5DFA] rounded-3xl cursor-pointer hover:bg-[#9277FF] transition"
                    >
                        Save & Send
                    </button>
            </footer>
            </>
    );
};

export default CreateInvoice;