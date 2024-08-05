import type { Config } from "tailwindcss"
const defaultTheme = require("tailwindcss/defaultTheme")

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        /* 
        set the default font to Poppins
        */
        sans: ['"Poppins"', ...defaultTheme.fontFamily.sans],
        roboto: ['"Roboto"'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "sw-white": "#FFF",
        "sw-purple": "#687CEB",
        "sw-charcoal": "#4A4A52",
        "sw-black": "#292B2E",
        "sw-grey-ash": "#E5E7EB",
        "sw-modal-footer-bg": "rgba(50, 167, 173, 0.10)",
        "sw-modal-footer-text": "rgba(41, 43, 46, 0.20)",
      },
      boxShadow: {
        "sw-shadow": "0px 4px 4px 0px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
}
export default config
