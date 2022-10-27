/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${variableName}), ${opacityValue})`
        }
        return `rgb(var(${variableName}))`
    }
}

module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                xs: "425px",
            },
            colors: {
                bkg: "#fafbfc",
                grayBorder: "#E5E7EB",
                flatBlack: "#000000",
                flatWhite: "#FFFFFF",
                "ebay-red": "#EF4444",
                "ebay-blue": "#3B82F6",
                "ebay-yellow": "#EAB308",
                "ebay-green": "#22C55E",
            },
            textColor: {
                skin: {
                    base: withOpacity("--color-text-base"),
                    accent: withOpacity("--color-text-accent"),
                    muted: withOpacity("--color-text-muted"),
                    inverted: withOpacity("--color-text-inverted"),
                },
            },
            backgroundColor: {
                skin: {
                    fill: withOpacity("--color-fill"),
                    "button-accent": withOpacity("--color-button-accent"),
                    "button-accent-hover": withOpacity("--color-button-accent-hover"),
                    "button-muted": withOpacity("--color-button-muted"),
                },
            },
            gradientColorStops: {
                skin: {
                    hue: withOpacity("--color-fill"),
                },
            },
            animation: {
                blob: "blob 7s infinite",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translateY(1px, -1px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(1px, -1px) scale(1)",
                    },
                    "66%": {
                        transform: "translate(-1px, 1px) scale(1)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
        },
    },

    plugins: [],
}
