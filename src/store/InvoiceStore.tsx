import { create } from "zustand";
import { persist } from "zustand/middleware";
import invoicesData from "../data/data.json";

export interface Invoice {
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
  filters: string[];
  setFilters: (filters: string[]) => void; // set the filters array.
  setInvoices: (invoices: Invoice[]) => void; // replace the entire invoices array.
  addInvoice: (invoice: Invoice) => void; // add a new invoice to the invoices array.
  updateInvoice: (invoice: Invoice) => void; // update an existing invoice in the invoices array.
  deleteInvoice: (id: string) => void; // delete an invoice from the invoices array.  
  togglePaid: (id: string) => void; // toggle the status of an invoice between "Paid" and "Pending".
  toggleFilter: (status: string) => void; // toggle a filter status on or off.
};

export const useInvoiceStore = create<InvoiceStore>()(
    persist(
      (set, get) => ({
        invoices: invoicesData,

        filters: ['All'],
  
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

        setFilters: (filters) => set({ filters }),
        
        toggleFilter: (status: string) => {
          const { filters } = get(); // get the current filters from the store
          let next: string[];
          if (status === "All") {
            next = ["All"];
          } else {
            const withoutAll = filters.filter((s) => s !== "All"); // we remove “All” from the current filters, because selecting any specific status should automatically unselect “All.”
            if (withoutAll.includes(status)) { // If the array already contains that status, we remove it (turn it off).
              next = withoutAll.filter((s) => s !== status);
            } else { // If the array does not contain that status, we add it (turn it on).
              next = [...withoutAll, status];
            }
            if (next.length === 0) next = ["All"];
          }
          set({ filters: next });
        }
      }),

      {
        name: "invoice-storage",          // key in localStorage
        // (optional) explicitly choose storage
      }
  )
);

// create<InvoiceStore>((set) => ({ ... })): This call initializes your store with default state and actions.

// Each action (set, add, update, delete) is a function that uses set to produce a new state.

// React Components call these actions or read invoices from the store. This ensures a single source of truth for your invoice data.