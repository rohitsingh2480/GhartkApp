import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (data) => {
        localStorage.setItem('ghartk_token', data.accessToken);
        set({
          user: {
            id: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            profileImage: data.profileImage,
          },
          token: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('ghartk_token');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      isAdmin: () => get().user?.role === 'ADMIN',
      isMerchant: () => get().user?.role === 'MERCHANT',
      isDriver: () => get().user?.role === 'DRIVER',
    }),
    {
      name: 'ghartk_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
