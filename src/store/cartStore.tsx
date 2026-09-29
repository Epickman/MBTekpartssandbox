'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'
import type { CartItem, ConfiguratorState, Product, Vehicle, Terrain } from '@/types'

// ── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_TERRAIN'; terrain: Terrain }
  | { type: 'SET_VEHICLE'; vehicle: Vehicle }
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR' }

// ── State / Reducer ───────────────────────────────────────────────────────────

const initialState: ConfiguratorState = {
  terrain: null,
  vehicle: null,
  items: [],
}

function reducer(state: ConfiguratorState, action: Action): ConfiguratorState {
  switch (action.type) {
    case 'SET_TERRAIN':
      return { ...state, terrain: action.terrain }

    case 'SET_VEHICLE':
      return { ...state, vehicle: action.vehicle }

    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: action.quantity ?? 1,
            terrain: state.terrain ?? undefined,
            vehicle: state.vehicle ?? undefined,
          },
        ],
      }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) }

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }

    case 'CLEAR':
      return { ...state, items: [] }

    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

type CartContextValue = {
  state: ConfiguratorState
  setTerrain: (terrain: Terrain) => void
  setVehicle: (vehicle: Vehicle) => void
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clear: () => void
  totalItems: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'mbtek-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (typeof window === 'undefined') return init
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as ConfiguratorState) : init
    } catch {
      return init
    }
  })

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // localStorage unavailable (private mode, etc.) — silently ignore
    }
  }, [state])

  const value: CartContextValue = {
    state,
    setTerrain: (terrain) => dispatch({ type: 'SET_TERRAIN', terrain }),
    setVehicle: (vehicle) => dispatch({ type: 'SET_VEHICLE', vehicle }),
    addItem: (product, quantity) => dispatch({ type: 'ADD_ITEM', product, quantity }),
    removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
    updateQty: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', productId, quantity }),
    clear: () => dispatch({ type: 'CLEAR' }),
    totalItems: state.items.reduce((sum, i) => sum + i.quantity, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
