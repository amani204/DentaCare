
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAdminStore = create(
  persist(
    (set) => ({
      aToken: null,
      setAToken: (token) => set({ aToken: token }),
      logout: () => set({ aToken: null }),

      lang: 'en',
      toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'fr' : 'en' })),
    }),
    { name: 'dentacare-admin-v3' }
  )
)

export default useAdminStore