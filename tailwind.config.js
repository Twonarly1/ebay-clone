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
            // fontSize: {
            //     sm: ["clamp(1.00rem, calc(0.92rem + 0.39vw), 1.20rem)", "1.4"],
            //     base: ["clamp(1.13rem, calc(0.98rem + 0.73vw), 1.50rem)", "1.5"],
            //     lg: ["clamp(1.27rem, calc(1.03rem + 1.19vw), 1.88rem)", "1.4"],
            //     xl: ["clamp(1.42rem, calc(1.06rem + 1.80vw), 2.34rem)", "1.4"],
            //     "2xl": ["clamp(1.60rem, calc(1.08rem + 2.59vw), 2.93rem)", "1.2"],
            //     "3xl": ["clamp(1.80rem, calc(1.08rem + 3.63vw), 3.66rem)", "1.1"],
            //     "4xl": ["clamp(2.03rem, calc(1.03rem + 4.98vw), 4.58rem)", "1"],
            //     "5xl": ["clamp(2.28rem, calc(0.94rem + 6.71vw), 5.72rem)", "1"],
            //     "6xl": ["clamp(2.57rem, calc(0.78rem + 8.95vw), 7.15rem)", "1"],
            // },
        },
    },

    // theme: {
    //     extend: {
    //         textColor: {
    //             skin: {
    //                 base: "#ffffff",
    //                 muted: "#c7d2fe",
    //                 inverted: "#4f46e5",
    //             },
    //         },
    //         backgroundColor: {
    //             skin: {
    //                 fill: "#ffffff",
    //                 "button-accent": "#3B82F6",
    //                 "button-accent-hover": "#eef2ff",
    //                 "button-muted": "#6366f1",
    //             },
    //         },
    //         gradientColorStops: {
    //             skin: {
    //                 hue: "#4338ca",
    //             },
    //         },
    //     },
    // },
    plugins: [],
}
