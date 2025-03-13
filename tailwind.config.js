/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary), 0.05)',
          100: 'rgb(var(--color-primary), 0.1)',
          200: 'rgb(var(--color-primary), 0.2)',
          300: 'rgb(var(--color-primary), 0.3)',
          400: 'rgb(var(--color-primary), 0.4)',
          500: 'rgb(var(--color-primary), 0.5)',
          600: 'rgb(var(--color-primary), 0.6)',
          700: 'rgb(var(--color-primary), 0.7)',
          800: 'rgb(var(--color-primary), 0.8)',
          900: 'rgb(var(--color-primary), 0.9)',
        },
        secondary: {
          50: 'rgb(var(--color-secondary), 0.05)',
          100: 'rgb(var(--color-secondary), 0.1)',
          200: 'rgb(var(--color-secondary), 0.2)',
          300: 'rgb(var(--color-secondary), 0.3)',
          400: 'rgb(var(--color-secondary), 0.4)',
          500: 'rgb(var(--color-secondary), 0.5)',
          600: 'rgb(var(--color-secondary), 0.6)',
          700: 'rgb(var(--color-secondary), 0.7)',
          800: 'rgb(var(--color-secondary), 0.8)',
          900: 'rgb(var(--color-secondary), 0.9)',
        },
        accent: {
          50: 'rgb(var(--color-accent), 0.05)',
          100: 'rgb(var(--color-accent), 0.1)',
          200: 'rgb(var(--color-accent), 0.2)',
          300: 'rgb(var(--color-accent), 0.3)',
          400: 'rgb(var(--color-accent), 0.4)',
          500: 'rgb(var(--color-accent), 0.5)',
          600: 'rgb(var(--color-accent), 0.6)',
          700: 'rgb(var(--color-accent), 0.7)',
          800: 'rgb(var(--color-accent), 0.8)',
          900: 'rgb(var(--color-accent), 0.9)',
        },
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['SF Pro Text', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'text': '0 2px 2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};