/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    container: {
      center: true,
      padding: "16px",
    },
    extend: {
      colors: {
        primary50: "#008ADA",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      poppins: "Poppins",
      nunitoSans: "nunito sans",
      pacifico: "pacifico",
    },
  },
  plugins: [],
};
