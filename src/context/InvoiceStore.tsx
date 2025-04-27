import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    togglePaid: (id: string) => void;
};

export const useInvoiceStore = create<InvoiceStore>()(
    persist(
      (set, get) => ({
        invoices: invoicesData,
  
        setInvoices: (invoices) => set({ invoices }),
  
        addInvoice: (invoice) =>
          set((state) => ({ invoices: [...state.invoices, invoice] })
        ),
  
        updateInvoice: (invoice) =>
          set((state) => ({
            invoices: state.invoices.map((item) =>
              item.id === invoice.id ? invoice : item
            ),
        })),
  
        togglePaid: (id: string) =>
          set((state) => ({
            invoices: state.invoices.map((inv) => {
              if (inv.id !== id) return inv;
              const newStatus = inv.status === "Paid" ? "Pending" : "Paid";
              return { ...inv, status: newStatus };
            }),
        })),
  
        deleteInvoice: (id: string) =>
          set((state) => ({
            invoices: state.invoices.filter((item) => item.id !== id),
          })),
      }),
      {
        name: "invoice-storage",          // key in localStorage
        getStorage: () => localStorage,    // (optional) explicitly choose storage
      }
    )
  );

// create<InvoiceStore>((set) => ({ ... })): This call initializes your store with default state and actions.

// Each action (set, add, update, delete) is a function that uses set to produce a new state.

// React Components call these actions or read invoices from the store. This ensures a single source of truth for your invoice data.