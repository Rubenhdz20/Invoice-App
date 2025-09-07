import { vi, beforeEach, describe, test, expect } from 'vitest';
import { useInvoiceStore, Invoice } from './InvoiceStore';

// Mock console methods to avoid noise during tests
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

vi.stubGlobal('console', {
  ...console,
  log: mockConsoleLog,
  error: mockConsoleError,
});

// Mock localStorage for persistence testing
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

vi.stubGlobal('localStorage', mockLocalStorage);

// Sample invoice data for testing
const createSampleInvoice = (overrides: Partial<Invoice> = {}): Omit<Invoice, 'userId'> => ({
  id: 'RT3080',
  createdAt: '2024-01-15T10:00:00Z',
  paymentDue: '2024-02-15T10:00:00Z',
  description: 'Website Redesign',
  paymentTerms: 30,
  clientName: 'Jensen Huang',
  clientEmail: 'jensen@example.com',
  status: 'Pending',
  senderAddress: {
    street: '19 Union Terrace',
    city: 'London',
    postCode: 'E1 3EZ',
    country: 'United Kingdom',
  },
  clientAddress: {
    street: '106 Kendell Street',
    city: 'Sharrington',
    postCode: 'NR24 5WQ',
    country: 'United Kingdom',
  },
  items: [
    {
      name: 'Website Redesign',
      quantity: 1,
      price: 14002.33,
      total: 14002.33,
    },
  ],
  total: 14002.33,
  ...overrides,
});

const createInvoiceWithUserId = (userId: string, overrides: Partial<Invoice> = {}): Invoice => ({
  ...createSampleInvoice(overrides),
  userId,
  ...overrides,
});

describe('InvoiceStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useInvoiceStore.getState().clearCurrentUser();
    useInvoiceStore.setState({
      invoices: [],
      filters: ['All'],
      currentUserId: null,
    });
    
    // Clear mocks
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockLocalStorage.clear();
  });

  describe('Initial State', () => {
    test('initializes with correct default state', () => {
      const state = useInvoiceStore.getState();
      
      expect(state.invoices).toEqual([]);
      expect(state.filters).toEqual(['All']);
      expect(state.currentUserId).toBeNull();
    });

    test('has all required methods', () => {
      const state = useInvoiceStore.getState();
      
      // User management methods
      expect(typeof state.setCurrentUser).toBe('function');
      expect(typeof state.clearCurrentUser).toBe('function');
      expect(typeof state.switchUser).toBe('function');
      expect(typeof state.getUserInvoices).toBe('function');
      expect(typeof state.initializeUserInvoices).toBe('function');
      
      // Invoice operation methods
      expect(typeof state.addInvoice).toBe('function');
      expect(typeof state.updateInvoice).toBe('function');
      expect(typeof state.deleteInvoice).toBe('function');
      expect(typeof state.togglePaid).toBe('function');
      
      // Filter operation methods
      expect(typeof state.setFilters).toBe('function');
      expect(typeof state.toggleFilter).toBe('function');
      
      // Debug helper methods
      expect(typeof state.getAllUsers).toBe('function');
      expect(typeof state.getUserInvoiceCount).toBe('function');
    });
  });

  describe('User Management', () => {
    test('setCurrentUser sets the current user ID', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user123');
      
      expect(useInvoiceStore.getState().currentUserId).toBe('user123');
      expect(mockConsoleLog).toHaveBeenCalledWith('🔄 Setting current user:', 'user123');
    });

    test('setCurrentUser accepts null to clear user', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user123');
      store.setCurrentUser(null);
      
      expect(useInvoiceStore.getState().currentUserId).toBeNull();
      expect(mockConsoleLog).toHaveBeenCalledWith('🔄 Setting current user:', null);
    });

    test('clearCurrentUser clears user and resets filters', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user123');
      store.setFilters(['Paid', 'Pending']);
      store.clearCurrentUser();
      
      const state = useInvoiceStore.getState();
      expect(state.currentUserId).toBeNull();
      expect(state.filters).toEqual(['All']);
      expect(mockConsoleLog).toHaveBeenCalledWith('🚪 Clearing current user');
    });

    test('switchUser changes user and resets filters', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user123');
      store.setFilters(['Paid']);
      store.switchUser('user456');
      
      const state = useInvoiceStore.getState();
      expect(state.currentUserId).toBe('user456');
      expect(state.filters).toEqual(['All']);
      expect(mockConsoleLog).toHaveBeenCalledWith('🔄 Switching user from', 'user123', 'to', 'user456');
    });

    test('switchUser does nothing when switching to same user', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user123');
      mockConsoleLog.mockClear();
      
      store.switchUser('user123');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('👤 User already current:', 'user123');
    });

    test('getUserInvoices returns empty array when no user set', () => {
      const store = useInvoiceStore.getState();
      
      const result = store.getUserInvoices();
      
      expect(result).toEqual([]);
      expect(mockConsoleLog).toHaveBeenCalledWith('⚠️ No current user set');
    });

    test('getUserInvoices returns invoices for current user only', () => {
      const store = useInvoiceStore.getState();
      
      // Add invoices for different users
      const user1Invoice = createInvoiceWithUserId('user1', { id: 'INV001' });
      const user2Invoice = createInvoiceWithUserId('user2', { id: 'INV002' });
      
      useInvoiceStore.setState({
        invoices: [user1Invoice, user2Invoice],
        currentUserId: 'user1'
      });
      
      const result = store.getUserInvoices();
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('INV001');
      expect(result[0].userId).toBe('user1');
      expect(mockConsoleLog).toHaveBeenCalledWith('📋 Found 1 invoices for user user1');
    });

    test('initializeUserInvoices logs for new user', () => {
      const store = useInvoiceStore.getState();
      
      store.initializeUserInvoices('newUser');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('🆕 New user newUser - starting with empty invoices');
    });

    test('initializeUserInvoices logs for existing user with invoices', () => {
      const store = useInvoiceStore.getState();
      
      const existingInvoice = createInvoiceWithUserId('existingUser', { id: 'INV001' });
      useInvoiceStore.setState({
        invoices: [existingInvoice]
      });
      
      store.initializeUserInvoices('existingUser');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('👋 Welcome back! User existingUser has 1 invoices');
    });
  });

  describe('Invoice Operations', () => {
    beforeEach(() => {
      useInvoiceStore.getState().setCurrentUser('testUser');
    });

    test('addInvoice adds invoice with current user ID', () => {
      const store = useInvoiceStore.getState();
      const invoiceData = createSampleInvoice({ id: 'INV001' });
      
      store.addInvoice(invoiceData);
      
      const state = useInvoiceStore.getState();
      expect(state.invoices).toHaveLength(1);
      expect(state.invoices[0].id).toBe('INV001');
      expect(state.invoices[0].userId).toBe('testUser');
      expect(mockConsoleLog).toHaveBeenCalledWith('➕ Adding invoice for user:', 'testUser', 'INV001');
    });

    test('addInvoice fails when no current user', () => {
      const store = useInvoiceStore.getState();
      store.setCurrentUser(null);
      
      const invoiceData = createSampleInvoice({ id: 'INV001' });
      store.addInvoice(invoiceData);
      
      expect(useInvoiceStore.getState().invoices).toHaveLength(0);
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Cannot add invoice: No current user');
    });

    test('updateInvoice updates existing invoice for current user', () => {
      const store = useInvoiceStore.getState();
      
      // Add initial invoice
      const originalInvoice = createInvoiceWithUserId('testUser', { 
        id: 'INV001',
        description: 'Original description'
      });
      useInvoiceStore.setState({ invoices: [originalInvoice] });
      
      // Update invoice
      const updatedData = createSampleInvoice({ 
        id: 'INV001',
        description: 'Updated description'
      });
      store.updateInvoice(updatedData);
      
      const state = useInvoiceStore.getState();
      expect(state.invoices[0].description).toBe('Updated description');
      expect(state.invoices[0].userId).toBe('testUser');
      expect(mockConsoleLog).toHaveBeenCalledWith('✏️ Updating invoice for user:', 'testUser', 'INV001');
    });

    test('updateInvoice fails when no current user', () => {
      const store = useInvoiceStore.getState();
      store.setCurrentUser(null);
      
      const updateData = createSampleInvoice({ id: 'INV001' });
      store.updateInvoice(updateData);
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Cannot update invoice: No current user');
    });

    test('updateInvoice only updates invoices belonging to current user', () => {
      const store = useInvoiceStore.getState();
      
      const user1Invoice = createInvoiceWithUserId('user1', { 
        id: 'INV001',
        description: 'User 1 invoice'
      });
      const user2Invoice = createInvoiceWithUserId('user2', { 
        id: 'INV001',
        description: 'User 2 invoice'
      });
      
      useInvoiceStore.setState({ 
        invoices: [user1Invoice, user2Invoice],
        currentUserId: 'user1'
      });
      
      const updateData = createSampleInvoice({ 
        id: 'INV001',
        description: 'Updated description'
      });
      store.updateInvoice(updateData);
      
      const state = useInvoiceStore.getState();
      expect(state.invoices[0].description).toBe('Updated description'); // user1's invoice updated
      expect(state.invoices[1].description).toBe('User 2 invoice'); // user2's invoice unchanged
    });

    test('deleteInvoice removes invoice for current user', () => {
      const store = useInvoiceStore.getState();
      
      const invoice = createInvoiceWithUserId('testUser', { id: 'INV001' });
      useInvoiceStore.setState({ invoices: [invoice] });
      
      store.deleteInvoice('INV001');
      
      expect(useInvoiceStore.getState().invoices).toHaveLength(0);
      expect(mockConsoleLog).toHaveBeenCalledWith('🗑️ Deleting invoice:', 'INV001', 'for user:', 'testUser');
    });

    test('deleteInvoice fails when no current user', () => {
      const store = useInvoiceStore.getState();
      store.setCurrentUser(null);
      
      store.deleteInvoice('INV001');
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Cannot delete invoice: No current user');
    });

    test('deleteInvoice only removes invoices belonging to current user', () => {
      const store = useInvoiceStore.getState();
      
      const user1Invoice = createInvoiceWithUserId('user1', { id: 'INV001' });
      const user2Invoice = createInvoiceWithUserId('user2', { id: 'INV001' });
      
      useInvoiceStore.setState({ 
        invoices: [user1Invoice, user2Invoice],
        currentUserId: 'user1'
      });
      
      store.deleteInvoice('INV001');
      
      const state = useInvoiceStore.getState();
      expect(state.invoices).toHaveLength(1);
      expect(state.invoices[0].userId).toBe('user2');
    });

    test('togglePaid changes invoice status from Pending to Paid', () => {
      const store = useInvoiceStore.getState();
      
      const invoice = createInvoiceWithUserId('testUser', { 
        id: 'INV001',
        status: 'Pending'
      });
      useInvoiceStore.setState({ invoices: [invoice] });
      
      store.togglePaid('INV001');
      
      const state = useInvoiceStore.getState();
      expect(state.invoices[0].status).toBe('Paid');
      expect(mockConsoleLog).toHaveBeenCalledWith('💳 Toggling payment status for invoice:', 'INV001', 'user:', 'testUser');
      expect(mockConsoleLog).toHaveBeenCalledWith('💳 Changed status from Pending to Paid');
    });

    test('togglePaid changes invoice status from Paid to Pending', () => {
      const store = useInvoiceStore.getState();
      
      const invoice = createInvoiceWithUserId('testUser', { 
        id: 'INV001',
        status: 'Paid'
      });
      useInvoiceStore.setState({ invoices: [invoice] });
      
      store.togglePaid('INV001');
      
      const state = useInvoiceStore.getState();
      expect(state.invoices[0].status).toBe('Pending');
      expect(mockConsoleLog).toHaveBeenCalledWith('💳 Changed status from Paid to Pending');
    });

    test('togglePaid fails when no current user', () => {
      const store = useInvoiceStore.getState();
      store.setCurrentUser(null);
      
      store.togglePaid('INV001');
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Cannot toggle payment: No current user');
    });

    test('togglePaid only affects invoices belonging to current user', () => {
      const store = useInvoiceStore.getState();
      
      const user1Invoice = createInvoiceWithUserId('user1', { 
        id: 'INV001',
        status: 'Pending'
      });
      const user2Invoice = createInvoiceWithUserId('user2', { 
        id: 'INV001',
        status: 'Pending'
      });
      
      useInvoiceStore.setState({ 
        invoices: [user1Invoice, user2Invoice],
        currentUserId: 'user1'
      });
      
      store.togglePaid('INV001');
      
      const state = useInvoiceStore.getState();
      expect(state.invoices[0].status).toBe('Paid'); // user1's invoice changed
      expect(state.invoices[1].status).toBe('Pending'); // user2's invoice unchanged
    });
  });

  describe('Filter Operations', () => {
    test('setFilters updates filters array', () => {
      const store = useInvoiceStore.getState();
      
      store.setFilters(['Paid', 'Pending']);
      
      expect(useInvoiceStore.getState().filters).toEqual(['Paid', 'Pending']);
      expect(mockConsoleLog).toHaveBeenCalledWith('🔍 Setting filters:', ['Paid', 'Pending']);
    });

    test('toggleFilter with "All" sets filters to ["All"]', () => {
      const store = useInvoiceStore.getState();
      
      store.setFilters(['Paid', 'Pending']);
      store.toggleFilter('All');
      
      expect(useInvoiceStore.getState().filters).toEqual(['All']);
      expect(mockConsoleLog).toHaveBeenCalledWith('🔍 Toggling filter:', 'All', '→', ['All']);
    });

    test('toggleFilter adds new filter when not present', () => {
      const store = useInvoiceStore.getState();
      
      store.setFilters(['All']);
      store.toggleFilter('Paid');
      
      expect(useInvoiceStore.getState().filters).toEqual(['Paid']);
      expect(mockConsoleLog).toHaveBeenCalledWith('🔍 Toggling filter:', 'Paid', '→', ['Paid']);
    });

    test('toggleFilter removes filter when present', () => {
      const store = useInvoiceStore.getState();
      
      store.setFilters(['Paid', 'Pending']);
      store.toggleFilter('Paid');
      
      expect(useInvoiceStore.getState().filters).toEqual(['Pending']);
      expect(mockConsoleLog).toHaveBeenCalledWith('🔍 Toggling filter:', 'Paid', '→', ['Pending']);
    });

    test('toggleFilter sets to ["All"] when removing last filter', () => {
      const store = useInvoiceStore.getState();
      
      store.setFilters(['Paid']);
      store.toggleFilter('Paid');
      
      expect(useInvoiceStore.getState().filters).toEqual(['All']);
      expect(mockConsoleLog).toHaveBeenCalledWith('🔍 Toggling filter:', 'Paid', '→', ['All']);
    });

    test('toggleFilter removes "All" when adding specific filter', () => {
      const store = useInvoiceStore.getState();
      
      store.setFilters(['All']);
      store.toggleFilter('Draft');
      
      expect(useInvoiceStore.getState().filters).toEqual(['Draft']);
    });

    test('toggleFilter works with multiple filters', () => {
      const store = useInvoiceStore.getState();
      
      store.setFilters(['All']);
      store.toggleFilter('Paid');
      store.toggleFilter('Pending');
      
      expect(useInvoiceStore.getState().filters).toEqual(['Paid', 'Pending']);
      
      store.toggleFilter('Draft');
      expect(useInvoiceStore.getState().filters).toEqual(['Paid', 'Pending', 'Draft']);
    });
  });

  describe('Debug Helper Methods', () => {
    test('getAllUsers returns unique user IDs from invoices', () => {
      const store = useInvoiceStore.getState();
      
      const invoice1 = createInvoiceWithUserId('user1', { id: 'INV001' });
      const invoice2 = createInvoiceWithUserId('user2', { id: 'INV002' });
      const invoice3 = createInvoiceWithUserId('user1', { id: 'INV003' }); // duplicate user
      
      useInvoiceStore.setState({ invoices: [invoice1, invoice2, invoice3] });
      
      const users = store.getAllUsers();
      
      expect(users).toEqual(['user1', 'user2']);
      expect(mockConsoleLog).toHaveBeenCalledWith('👥 All users with invoices:', ['user1', 'user2']);
    });

    test('getAllUsers returns empty array when no invoices', () => {
      const store = useInvoiceStore.getState();
      
      const users = store.getAllUsers();
      
      expect(users).toEqual([]);
      expect(mockConsoleLog).toHaveBeenCalledWith('👥 All users with invoices:', []);
    });

    test('getUserInvoiceCount returns correct count for user', () => {
      const store = useInvoiceStore.getState();
      
      const invoice1 = createInvoiceWithUserId('user1', { id: 'INV001' });
      const invoice2 = createInvoiceWithUserId('user1', { id: 'INV002' });
      const invoice3 = createInvoiceWithUserId('user2', { id: 'INV003' });
      
      useInvoiceStore.setState({ invoices: [invoice1, invoice2, invoice3] });
      
      const user1Count = store.getUserInvoiceCount('user1');
      const user2Count = store.getUserInvoiceCount('user2');
      const user3Count = store.getUserInvoiceCount('user3'); // non-existent user
      
      expect(user1Count).toBe(2);
      expect(user2Count).toBe(1);
      expect(user3Count).toBe(0);
      
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 User user1 has 2 invoices');
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 User user2 has 1 invoices');
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 User user3 has 0 invoices');
    });
  });

  describe('Store Persistence', () => {
    test('persists only invoices and filters, not currentUserId', () => {
      const store = useInvoiceStore.getState();
      
      // Set up state
      store.setCurrentUser('testUser');
      store.addInvoice(createSampleInvoice({ id: 'INV001' }));
      store.setFilters(['Paid', 'Pending']);
      
      // Simulate persistence
      const persistedState = useInvoiceStore.persist?.getOptions?.()?.partialize?.(useInvoiceStore.getState());
      
      expect(persistedState).toEqual({
        invoices: expect.any(Array),
        filters: ['Paid', 'Pending']
      });
      
      // currentUserId should not be persisted
      expect(persistedState).not.toHaveProperty('currentUserId');
    });

    test('storage name is correctly configured', () => {
      const options = useInvoiceStore.persist?.getOptions?.();
      expect(options?.name).toBe('invoice-storage');
    });
  });

  describe('Store Subscription and State Updates', () => {
    test('state updates are reflected in subscribers', () => {
      let currentState = useInvoiceStore.getState();
      
      // Subscribe to store changes
      const unsubscribe = useInvoiceStore.subscribe((state) => {
        currentState = state;
      });
      
      // Trigger state change
      useInvoiceStore.getState().setCurrentUser('testUser');
      
      expect(currentState.currentUserId).toBe('testUser');
      
      unsubscribe();
    });

    test('multiple state updates work correctly', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user1');
      store.addInvoice(createSampleInvoice({ id: 'INV001' }));
      store.addInvoice(createSampleInvoice({ id: 'INV002' }));
      store.setFilters(['Paid']);
      
      const finalState = useInvoiceStore.getState();
      
      expect(finalState.currentUserId).toBe('user1');
      expect(finalState.invoices).toHaveLength(2);
      expect(finalState.filters).toEqual(['Paid']);
    });
  });

  describe('Complex Integration Scenarios', () => {
    test('user workflow: login, add invoices, switch user, add more invoices', () => {
      const store = useInvoiceStore.getState();
      
      // User 1 workflow
      store.setCurrentUser('user1');
      store.addInvoice(createSampleInvoice({ id: 'USER1_INV001' }));
      store.addInvoice(createSampleInvoice({ id: 'USER1_INV002' }));
      
      // Switch to User 2
      store.switchUser('user2');
      store.addInvoice(createSampleInvoice({ id: 'USER2_INV001' }));
      
      const allInvoices = useInvoiceStore.getState().invoices;
      const user1Invoices = store.getUserInvoices();
      
      // Should have 3 total invoices
      expect(allInvoices).toHaveLength(3);
      
      // Current user (user2) should only see their invoice
      expect(user1Invoices).toHaveLength(1);
      expect(user1Invoices[0].id).toBe('USER2_INV001');
      
      // Switch back to user1
      store.switchUser('user1');
      const user1InvoicesAgain = store.getUserInvoices();
      
      expect(user1InvoicesAgain).toHaveLength(2);
      expect(user1InvoicesAgain.map(inv => inv.id)).toEqual(['USER1_INV001', 'USER1_INV002']);
    });

    test('filter operations with multiple users', () => {
      const store = useInvoiceStore.getState();
      
      // Set up invoices for different users
      store.setCurrentUser('user1');
      store.addInvoice(createSampleInvoice({ id: 'INV001', status: 'Paid' }));
      store.addInvoice(createSampleInvoice({ id: 'INV002', status: 'Pending' }));
      
      store.switchUser('user2');
      store.addInvoice(createSampleInvoice({ id: 'INV003', status: 'Draft' }));
      
      // Set filters for user2
      store.setFilters(['Draft', 'Pending']);
      
      // Switch to user1 - filters should reset to ['All']
      store.switchUser('user1');
      expect(useInvoiceStore.getState().filters).toEqual(['All']);
      
      // Set new filters for user1
      store.toggleFilter('Paid');
      expect(useInvoiceStore.getState().filters).toEqual(['Paid']);
    });

    test('invoice operations edge cases', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user1');
      
      // Try to update non-existent invoice
      store.updateInvoice(createSampleInvoice({ id: 'NONEXISTENT' }));
      expect(useInvoiceStore.getState().invoices).toHaveLength(0);
      
      // Try to delete non-existent invoice
      store.deleteInvoice('NONEXISTENT');
      expect(useInvoiceStore.getState().invoices).toHaveLength(0);
      
      // Try to toggle payment on non-existent invoice
      store.togglePaid('NONEXISTENT');
      expect(useInvoiceStore.getState().invoices).toHaveLength(0);
      
      // None of these operations should throw errors
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    test('concurrent user operations', () => {
      const store = useInvoiceStore.getState();
      
      // Simulate concurrent operations
      store.setCurrentUser('user1');
      const invoice1 = createSampleInvoice({ id: 'INV001', status: 'Pending' });
      store.addInvoice(invoice1);
      
      // Another user's session (different store instance scenario)
      store.setCurrentUser('user2');
      const invoice2 = createSampleInvoice({ id: 'INV001', status: 'Draft' }); // Same ID, different user
      store.addInvoice(invoice2);
      
      const allInvoices = useInvoiceStore.getState().invoices;
      expect(allInvoices).toHaveLength(2);
      
      // Each user should only be able to modify their own invoices
      store.togglePaid('INV001'); // Should only affect user2's invoice
      
      const finalInvoices = useInvoiceStore.getState().invoices;
      const user1Invoice = finalInvoices.find(inv => inv.userId === 'user1');
      const user2Invoice = finalInvoices.find(inv => inv.userId === 'user2');
      
      expect(user1Invoice?.status).toBe('Pending'); // Unchanged
      expect(user2Invoice?.status).toBe('Paid'); // Changed from Draft to Paid (Draft→Paid toggle)
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles empty invoice operations gracefully', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('testUser');
      
      // Operations on empty store should not crash
      expect(() => {
        store.getUserInvoices();
        store.deleteInvoice('nonexistent');
        store.updateInvoice(createSampleInvoice({ id: 'nonexistent' }));
        store.togglePaid('nonexistent');
      }).not.toThrow();
    });

    test('maintains data integrity during rapid state changes', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user1');
      
      // Rapid operations
      for (let i = 0; i < 10; i++) {
        store.addInvoice(createSampleInvoice({ id: `INV${i}` }));
      }
      
      expect(useInvoiceStore.getState().invoices).toHaveLength(10);
      
      // Rapid deletions
      for (let i = 0; i < 5; i++) {
        store.deleteInvoice(`INV${i}`);
      }
      
      expect(useInvoiceStore.getState().invoices).toHaveLength(5);
    });

    test('filter state consistency during user switching', () => {
      const store = useInvoiceStore.getState();
      
      store.setCurrentUser('user1');
      store.setFilters(['Paid', 'Draft']);
      
      // Rapid user switching
      store.switchUser('user2');
      expect(useInvoiceStore.getState().filters).toEqual(['All']);
      
      store.switchUser('user3');
      expect(useInvoiceStore.getState().filters).toEqual(['All']);
      
      store.switchUser('user1');
      expect(useInvoiceStore.getState().filters).toEqual(['All']); // Always resets
    });
  });
});