import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: null,
  itemCount: 0,

  setCart: (cartData) => {
    const count = cartData?.items
      ? cartData.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : (cartData?.itemCount || 0);
    set({ cart: cartData, itemCount: count });
  },

  clearCartStore: () => {
    set({ cart: null, itemCount: 0 });
  },
}));

export default useCartStore;
