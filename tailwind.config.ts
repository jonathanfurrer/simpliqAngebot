import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211b', paper: '#f4f6f1', brand: '#1c6b4a', lime: '#c9f25f', muted: '#66736b'
      },
      boxShadow: { card: '0 12px 35px rgba(28, 55, 40, .08)' }
    }
  },
  plugins: []
} satisfies Config
