import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

export type CartActions =
  | { type: "add-to-cart"; payload: { guitar: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "decrease-quantity"; payload: { id: Guitar["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitar["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  if (action.type === "add-to-cart") {
    const itemExists = state.cart.find(
      (guitar) => guitar.id === action.payload.guitar.id
    );
    let updatedCart: CartItem[] = [];
    if (itemExists) {
      updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.guitar.id) {
          if (item.quantity < MAX_ITEMS)
            return { ...item, quantity: item.quantity + 1 };
          else return item;
        } else return item;
      });
      // if (state.cart[itemExists].quantity >= MAX_ITEMS) return;
      // const updatedCart = [...state.cart];
      // updatedCart[itemExists].quantity++;
    } else {
      const newItem: CartItem = { ...action.payload.guitar, quantity: 1 };
      updatedCart = [...state.cart, newItem];
    }
    return { ...state, cart: updatedCart };
  }
  if (action.type === "remove-from-cart") {
    const updatedCart = state.cart.filter(
      (item) => item.id !== action.payload.id
    );
    return { ...state, cart: updatedCart };
  }
  if (action.type === "decrease-quantity") {
    const updatedCart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity > MIN_ITEMS)
        return { ...item, quantity: item.quantity - 1 };
      return item;
    });
    return { ...state, cart: updatedCart };
  }
  if (action.type === "increase-quantity") {
    const updatedCart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity < MAX_ITEMS)
        return { ...item, quantity: item.quantity + 1 };
      return item;
    });
    return { ...state, cart: updatedCart };
  }
  if (action.type === "clear-cart") return initialState;
  return state;
};
