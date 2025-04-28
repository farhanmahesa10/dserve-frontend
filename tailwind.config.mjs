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
      boxShadow: {
        'md-reverse': '0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -1px rgba(0,0,0,0.06)',
        'sm-reverse':"0 -1px 2px 0 rgba(0,0,0,0.10)",
        'md':"0 4px 5px -1px rgba(0,0,0,0.07)",
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
