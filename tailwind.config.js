/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      backgroundImage: {
        gradient: "linear-gradient(to right, #C9184A, #FFB5A7)",
        gradient01: "linear-gradient(to right, #075D70, #A1C5CD)",
        gradient02: "linear-gradient(to right, #075D70, #FEFEFE)",
        gradient03: "linear-gradient(to bottom, #075D70 100%, #CACBCB 100%)",
        gradient04: "linear-gradient(to top, #B9E4EE 20%, #F9F9F9 100%)",
        bordergradient1: "linear-gradient(to right, rgba(7, 93, 112, 0.19), rgba(13, 178, 214, 0.1))",
        
      },
      
      colors: {
        background01: "#F4FCFC",
        background02: "#FEFEFE",
        background03: "#F6F4F1",
        background04: "#5882E6",
        background05:"#075D70"
,        primary01: "#7791A1",
        primary02: "#075D70",
        primary03: "#5C616E",
        secondary01: "#CBBEA6",
        secondary02: "#F65868",
        secondary03: "#A88A66",
        secondary04: "#6198A3A8",
        successState01: "#4BB53A",
        successState02: "#ADD1A7",
        successState03: "#BFD1BC",
        errorState01: "#4BB53A",
        errorState02: "#ADD1A7",
        errorState03: "#BFD1BC",
        
        neutral01: "#1E1E1E",
        neutral02: "#333333",
        neutral03: "#666666",
        neutral04: "#808080",
        neutral05: "#999999",
        neutral06: "#CCCCCC",
        neutral06: "#E6E6E6",
      },

      fontSize: {
        '56px': '56px',
        '18px': '18px',
        '24px': '24px',
        '32px': '32px',
        '14px': '14px',
        '8px': '8px',
        '13px': '13px',
        '16px': '16px',
      },
      lineHeight: {
        '74px': '74px',
        '27px': '27px',
        '20px': '20px',
        '21px': '21px',
        '12px': '12px',
        '22.97px': '22.97px',
        '19.5px': '19.5px',
        '23.12px': '23.12px',
        '48px': '48px',
      },
      letterSpacing: {
        '4%': '0.04em',
      },
    },
  },
  plugins: [],
};
