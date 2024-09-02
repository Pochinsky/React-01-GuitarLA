import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { Guitar, CartItem } from "../types";

export const useCart = () => {
  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [guitars] = useState(db);
  const [cart, setCart] = useState(initialCart);

  function addToCart(item: Guitar) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists >= 0) {
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar["id"]) {
    setCart(cart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS)
        return { ...item, quantity: item.quantity + 1 };
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS)
        return { ...item, quantity: item.quantity - 1 };
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  const cartIsEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return {
    guitars,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartIsEmpty,
    cartTotal,
  };
};
