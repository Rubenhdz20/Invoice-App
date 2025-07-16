import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    userId: string; // ✅ Made required (not optional)
};

// Shape of the Zustand store
interface InvoiceStore {
  invoices: Invoice[];
  filters: string[];
  currentUserId: string | null;
  
  // User management
  setCurrentUser: (userId: string | null) => void;
  clearCurrentUser: () => void; // ✅ New: Clear user on logout
  switchUser: (newUserId: string) => void; // ✅ New: Switch between users
  getUserInvoices: () => Invoice[];
  initializeUserInvoices: (userId: string) => void;
  
  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'userId'>) => void; // ✅ Auto-add userId
  updateInvoice: (invoice: Omit<Invoice, 'userId'>) => void; // ✅ Auto-add userId
  deleteInvoice: (id: string) => void;
  togglePaid: (id: string) => void;
  
  // Filter operations
  setFilters: (filters: string[]) => void;
  toggleFilter: (status: string) => void;
  
  // ✅ New: Debug helpers
  getAllUsers: () => string[];
  getUserInvoiceCount: (userId: string) => number;
};

export const useInvoiceStore = create<InvoiceStore>()(
    persist(
      (set, get) => ({
        invoices: [],
        filters: ['All'],
        currentUserId: null,

        setCurrentUser: (userId: string | null) => {
          console.log('🔄 Setting current user:', userId);
          set({ currentUserId: userId });
        },

        clearCurrentUser: () => {
          console.log('🚪 Clearing current user');
          set({ 
            currentUserId: null,
            filters: ['All'] // Reset filters when user logs out
          });
        },

        switchUser: (newUserId: string) => {
          const { currentUserId } = get();
          if (currentUserId === newUserId) {
            console.log('👤 User already current:', newUserId);
            return;
          }
          
          console.log('🔄 Switching user from', currentUserId, 'to', newUserId);
          set({ 
            currentUserId: newUserId,
            filters: ['All'] // Reset filters when switching users
          });
        },

        getUserInvoices: () => {
          const { invoices, currentUserId } = get();
          if (!currentUserId) {
            console.log('⚠️ No current user set');
            return [];
          }
          
          const userInvoices = invoices.filter(invoice => invoice.userId === currentUserId);
          console.log(`📋 Found ${userInvoices.length} invoices for user ${currentUserId}`);
          return userInvoices;
        },

        initializeUserInvoices: (userId: string) => {
          const { invoices } = get();
          const userHasInvoices = invoices.some(invoice => invoice.userId === userId);
          
          if (!userHasInvoices) {
            console.log(`🆕 New user ${userId} - starting with empty invoices`);
          } else {
            const userInvoiceCount = invoices.filter(inv => inv.userId === userId).length;
            console.log(`👋 Welcome back! User ${userId} has ${userInvoiceCount} invoices`);
          }
        },

        addInvoice: (invoiceData) => {
          const { currentUserId } = get();
          if (!currentUserId) {
            console.error('❌ Cannot add invoice: No current user');
            return;
          }
          
          const invoice = { ...invoiceData, userId: currentUserId };
          console.log('➕ Adding invoice for user:', currentUserId, invoice.id);
          
          set((state) => ({ 
            invoices: [...state.invoices, invoice] 
          }));
        },

        updateInvoice: (invoiceData) => {
          const { currentUserId } = get();
          if (!currentUserId) {
            console.error('❌ Cannot update invoice: No current user');
            return;
          }

          const invoice = { ...invoiceData, userId: currentUserId };
          console.log('✏️ Updating invoice for user:', currentUserId, invoice.id);

          set((state) => ({
            invoices: state.invoices.map((item) =>
              item.id === invoice.id && item.userId === currentUserId 
                ? invoice 
                : item
            ),
          }));
        },

        togglePaid: (id: string) => {
          const { currentUserId } = get();
          if (!currentUserId) {
            console.error('❌ Cannot toggle payment: No current user');
            return;
          }

          console.log('💳 Toggling payment status for invoice:', id, 'user:', currentUserId);

          set((state) => ({
            invoices: state.invoices.map((inv) => {
              if (inv.id !== id || inv.userId !== currentUserId) return inv;
              const newStatus = inv.status === "Paid" ? "Pending" : "Paid";
              console.log(`💳 Changed status from ${inv.status} to ${newStatus}`);
              return { ...inv, status: newStatus };
            }),
          }));
        },

        deleteInvoice: (id: string) => {
          const { currentUserId } = get();
          if (!currentUserId) {
            console.error('❌ Cannot delete invoice: No current user');
            return;
          }

          console.log('🗑️ Deleting invoice:', id, 'for user:', currentUserId);

          set((state) => ({
            invoices: state.invoices.filter(
              (item) => !(item.id === id && item.userId === currentUserId)
            ),
          }));
        },

        setFilters: (filters) => {
          console.log('🔍 Setting filters:', filters);
          set({ filters });
        },
        
        toggleFilter: (status: string) => {
          const { filters } = get();
          let next: string[];
          if (status === "All") {
            next = ["All"];
          } else {
            const withoutAll = filters.filter((s) => s !== "All");
            if (withoutAll.includes(status)) {
              next = withoutAll.filter((s) => s !== status);
            } else {
              next = [...withoutAll, status];
            }
            if (next.length === 0) next = ["All"];
          }
          console.log('🔍 Toggling filter:', status, '→', next);
          set({ filters: next });
        },

        // ✅ Debug helpers
        getAllUsers: () => {
          const { invoices } = get();
          const userIds = [...new Set(invoices.map(inv => inv.userId))];
          console.log('👥 All users with invoices:', userIds);
          return userIds;
        },

        getUserInvoiceCount: (userId: string) => {
          const { invoices } = get();
          const count = invoices.filter(inv => inv.userId === userId).length;
          console.log(`📊 User ${userId} has ${count} invoices`);
          return count;
        }
      }),

      {
        name: "invoice-storage",
        // ✅ Only persist invoices and filters, NOT currentUserId
        partialize: (state) => ({ 
          invoices: state.invoices,
          filters: state.filters
          // currentUserId is intentionally excluded from persistence
        }),
      }
    )
);