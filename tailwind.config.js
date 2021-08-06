module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],

    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: ['Inter', 'system-ui'],
            serif: ['Roboto', 'Georgia'],
        },
        colors: {
            primary: '#3C57E4',
            text: '#2F2F2F',
            'text-light': '#3E3E3E',
            background: '#F5F5F5',
        },

        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
