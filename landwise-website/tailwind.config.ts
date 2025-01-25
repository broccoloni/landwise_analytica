import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        light: {
          DEFAULT: 'var(--light-green)',
          green: 'var(--light-green)',
          yellow: 'var(--light-yellow)',
          blue: 'var(--light-blue)',
          brown: 'var(--light-brown)',
        },
        medium: {
          DEFAULT: 'var(--medium-green)',
          green: 'var(--medium-green)',
          yellow: 'var(--medium-yellow)',
          orange: 'var(--medium-orange)',
          brown: 'var(--medium-brown)',
        },
        dark: {
          DEFAULT: 'var(--dark-green)',
          green: 'var(--dark-green)',
          olive: 'var(--dark-olive)',
          blue: 'var(--dark-blue)',
          brown: 'var(--dark-brown)',
        },
      },
      height: {
        '86': '344px',
      },
    },
  },
  plugins: [],
};
export default config;
