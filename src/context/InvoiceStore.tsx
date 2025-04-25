import { create } from "zustand";
import invoicesData from "../data/data.json";

interface Invoice {
    id: string;
    createdAt: string;
    paymentDue: string;
    description: string;
    paymentTerms: number;
    clientName: string;
    clientEmail: string;
    status: string;
    senderAddress: {
        street: string;
        city: string;
        postCode: string;
        country: string;
    };
    clientAddress: {
        street: string;
        city: string;
        postCode: string;
        country: string;
    };
    items: {
        name: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    total: number;
};


// shape of the Zustand store.
interface InvoiceStore {
    invoices: Invoice[];
    setInvoices: (invoices: Invoice[]) => void; // replace the entire invoices array.
    addInvoice: (invoice: Invoice) => void; // add a new invoice to the invoices array.
    updateInvoice: (invoice: Invoice) => void; // update an existing invoice in the invoices array.
    deleteInvoice: (id: string) => void; // delete an invoice from the invoices array.  
    markAsPaid: (id: string) => void;
};

export const useInvoiceStore = create<InvoiceStore>((set) => ({
    invoices: invoicesData,
    setInvoices: (invoices) => set({ invoices }),
    //  Replace the entire invoices array at once.
    addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
    // Add a new invoice to the array
    updateInvoice: (invoice) => set((state) => ({
        invoices: state.invoices.map((item) => (item.id === invoice.id ? invoice : item)),
    })),
    markAsPaid: (id: string) =>
        set((state) => ({
          invoices: state.invoices.map((item) =>
            item.id === id ? { ...item, status: "Paid" } : item
          ),
    })),
    // replace the invoice with the same id in the invoices array. 
    deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter((item) => item.id !== id),
    })),
}));

// create<InvoiceStore>((set) => ({ ... })): This call initializes your store with default state and actions.

// Each action (set, add, update, delete) is a function that uses set to produce a new state.

// React Components call these actions or read invoices from the store. This ensures a single source of truth for your invoice data.