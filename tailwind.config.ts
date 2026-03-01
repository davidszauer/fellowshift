import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "0" }
        }
      },
      animation: {
        "caret-blink": "caret-blink 2.2s ease-in-out infinite"
      },
      colors: {
        "hobbit-bg": "#f4ecd8",
        "hobbit-paper": "#fdfbf7",
        "hobbit-wood": "#8b5a2b",
        "hobbit-wood-dark": "#5e3a17",
        "hobbit-moss": "#6a8c3d",
        "hobbit-shire": "#2f9e44",
        "hobbit-ember": "#cf5c36",
        "hobbit-gold": "#eebb44",
        "hobbit-soil": "#8d7b68",
        "hobbit-stone": "#d9d2c5",
        "hobbit-ink": "#4a3c31"
      },
      fontFamily: {
        serif: ["Crimson Pro", "serif"],
        display: ["Lora", "serif"],
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        parchment: "0 10px 30px -5px rgba(94, 58, 23, 0.15)",
        "wood-inset": "inset 0 2px 5px rgba(0,0,0,0.4)",
        stone: "0 4px 0 #b0a89b, 0 6px 6px rgba(0,0,0,0.1)",
        "stone-pressed": "0 0 0 #b0a89b, inset 0 2px 4px rgba(0,0,0,0.2)"
      },
      backgroundImage: {
        "parchment-texture":
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZjRlY2Q4Ii8+CjxwYXRoIGQ9Ik0wIDBoMnYyaC0yek0yIDJoMnYyaC0yeiIgZmlsbD0iI2YwZTdjMyIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPC9zdmc+')",
        "wood-texture":
          "linear-gradient(180deg, rgba(139,90,43,1) 0%, rgba(120,77,36,1) 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;
