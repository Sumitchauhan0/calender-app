import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/calender-app/',  // 👈 your repo name here
  plugins: [react()],
})
