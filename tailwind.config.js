/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      title: ["montserrat", "sans-serif"],
    },
    screens: {
      sm: "375px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1025px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      colors: {
        // primary: "#1E88E5",
        // secondary: "#26C6DA",
        // text: "#263238",
        // contrastText: "#ffffff",
        // accent: "#FF7043",
        // background: "#E1EDF5",
        // success: "#16a34a",
        // danger: "#dc2626",
        // warning: "#facc15",
        primary: "#334EAC",
        secondary: "#7096D1",
        text: "#081F5C",
        accent: "#FF7043",
        contrastText: "#ffffff",
        background: "#E1EDF5",
        success: "#28A745",
        danger: "#dc2626",
        warning: "#FFC107",
        error: "#DC3545",
      },
      keyframes: {
        typing: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
        "fade-in-down": {
          "0%": {
            opacity: 0,
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: 0,
            transform: "translate3d(0, 100%, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
        flip: {
          "0%": {
            transform: "rotateY(-180deg)",
          },
          "50%": {
            transform: "rotateY(-90deg)",
          },
          "100%": {
            transform: "rotateY(0deg)",
          },
        },
        "slide-in-down": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "slide-in-left": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(-100%, 0, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "slide-in-up": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(0, 100%, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "zoom-in": {
          "0%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3)",
          },
          "80%": {
            opacity: 0.8,
            transform: "scale3d(1.1, 1.1, 1.1)",
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      animation: {
        fadeInDown: "fade-in-down 1s ease-in 0.25s 1",
        fadeInUp: "fade-in-up 0.75s ease-in 0.25s 1",
        flip: "flip 0.75s 0.25s 1",
        slideInLeft: "slide-in-left 1s ease-in-out 0.25s 1",
        slideInDown: "slide-in-down 1s ease-in-out 0.25s 1",
        slideInUp: "slide-in-up 1s ease-in-out 0.25s 1",
        zoomIn: "zoom-in 1s ease-in-out 0.25s 1",
        typing: "typing 4s steps(30, end) forwards",
        blink: "blink 0.7s step-end infinite",
      },
    },
  },
  plugins: [],
};
