import { create } from 'zustand';
import { Product, Checkpoint, User } from '../types';

interface AppState {
  // User state
  user: User | null;
  isConnected: boolean;
  
  // Products state
  products: Product[];
  selectedProduct: Product | null;
  
  // Checkpoints state
  checkpoints: Checkpoint[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  currentView: 'dashboard' | 'scanner' | 'product' | 'manufacturer';
  
  // Actions
  setUser: (user: User | null) => void;
  setConnected: (connected: boolean) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  setSelectedProduct: (product: Product | null) => void;
  addCheckpoint: (checkpoint: Checkpoint) => void;
  getProductCheckpoints: (productId: string) => Checkpoint[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isConnected: false,
  products: [],
  selectedProduct: null,
  checkpoints: [],
  isLoading: false,
  error: null,
  currentView: 'dashboard',
  
  // Actions
  setUser: (user) => set({ user }),
  setConnected: (connected) => set({ isConnected: connected }),
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, product]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  addCheckpoint: (checkpoint) => set((state) => ({
    checkpoints: [...state.checkpoints, checkpoint]
  })),
  
  getProductCheckpoints: (productId) => {
    return get().checkpoints.filter(c => c.productId === productId);
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setCurrentView: (view) => set({ currentView: view }),
  clearError: () => set({ error: null }),
}));