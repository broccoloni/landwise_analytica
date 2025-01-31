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
          green: {
            DEFAULT: 'var(--dark-green)',
            a: 'var(--dark-green-a)',
            b: 'var(--dark-green-b)',
            c: 'var(--dark-green-c)',
            d: 'var(--dark-green-d)',
            e: 'var(--dark-green-e)',
          },
          olive: 'var(--dark-olive)',
          blue: {
            DEFAULT: 'var(--dark-blue)',
            accent: 'var(--dark-blue-accent)',
          },
          brown: 'var(--dark-brown)',
          gray: {
            a: 'var(--dark-gray-a)',
            b: 'var(--dark-gray-b)',
            c: 'var(--dark-gray-c)',
            d: 'var(--dark-gray-d)',
          },
          red: 'var(--dark-red)',
          yellow: 'var(--dark-yellow)',
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
