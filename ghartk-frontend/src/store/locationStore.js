import { create } from 'zustand';

const savedPincode = localStorage.getItem('ghartk_pincode') || '248001';
const savedCity = localStorage.getItem('ghartk_city') || 'Dehradun';

const useLocationStore = create((set) => ({
  pincode: savedPincode,
  city: savedCity,
  selectedStoreId: null,
  selectedStoreName: null,
  availableStores: [],

  setPincode: (pincode, city = 'Dehradun') => {
    localStorage.setItem('ghartk_pincode', pincode);
    if (city) localStorage.setItem('ghartk_city', city);
    set({ pincode, city, selectedStoreId: null, selectedStoreName: null });
  },

  setSelectedStore: (storeId, storeName = null) => {
    set({ selectedStoreId: storeId, selectedStoreName: storeName });
  },

  setAvailableStores: (stores) => {
    set({ availableStores: stores || [] });
  },
}));

export default useLocationStore;
