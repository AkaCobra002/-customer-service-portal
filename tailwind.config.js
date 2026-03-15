/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#12A1BA",
        primaryDark: "#343C6A",
        secondary: "#FE5C73",
      },
    },
  },
  plugins: [],
};
