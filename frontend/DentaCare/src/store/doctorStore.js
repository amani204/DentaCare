import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useDoctorStore = create(
  persist(
    (set) => ({
      dToken: null,
      doctor: null,
      setAuth: (dToken, doctor) => set({ dToken, doctor }), // ← add this
      setDoctor: (doctor) => set({ doctor }),
      logout: () => set({ dToken: null, doctor: null }),
    }),
    { name: 'dentacare-doctor-v1' }
  )
)

export default useDoctorStore