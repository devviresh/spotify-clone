/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                "green": "#1DB954",
                // "black": "#191414",
                "black-base": "#121212",
                "black-secondary": "#171818",
                "light-black": "#282828",
                "gray": "#535353",
                "white": "#FFFFFF",
                "secondary": "#b3b3b3"
            },
            gridTemplateColumns: {
                'auto-fill-cards': 'repeat(auto-fill, minmax(180px, 1fr))'
            }
        },
    },
    plugins: [require('@tailwindcss/line-clamp'),],
};
