
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const applyDoctor = create(
  persist(
    (set, get) => ({
      //AUTH
      dToken:  null,
      doctor:  null,
      setAuth: (token, doctor) => set({ dToken: token, doctor }),
      logout:  () => set({ dToken: null, doctor: null }),

      //THEME (shared with admin)
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: next })
        document.documentElement.classList.toggle('dark', next === 'dark')
      },
      applyTheme: () => {
        document.documentElement.classList.toggle('dark', get().theme === 'dark')
      },

      //LANGUAGE
      lang: 'en',
      toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'fr' : 'en' })),
    }),
    { name: 'dentacare-doctor-v1' }
  )
)

export default applyDoctor
