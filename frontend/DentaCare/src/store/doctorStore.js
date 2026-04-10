
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const applyDoctor = create(
  persist(
    (set, get) => ({
      //AUTH
      dToken:  null,
      doctor:  null,
      setDoctor: (doctor) => set({ doctor }),
      logout:  () => set({ dToken: null, doctor: null }),
    }),
    { name: 'dentacare-doctor-v1' }
  )
)

export default applyDoctor
