import type { Config } from "tailwindcss"

export const themeConfig: Config = {
  theme: {
    extend: {
      borderRadius: {
        full: "9999px",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
    },
  },
}

