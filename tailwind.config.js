// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006990', // Add your custom primary color
        'Gray-Text': '#6B7280',
        secondary: '#F3A92A', // Add your custom secondary color
        success: '#13DEB9', // Add your custom success color
        text: {
          primary: '#000', // Add your custom primary text color
          secondary: '#F3A92A', // Add your custom secondary text color
        },
        action: {
          disabledBackground: 'rgba(73,82,88,0.12)',
          hoverOpacity: 0.02,
          hover: '#f6f9fc',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'Arial', 'sans-serif'],
        roboto: ['Roboto', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xl': '1.875rem',
        '3xl': '1.5rem',
        '4xl': '1.3125rem',
        '5xl': '1.125rem',
        '6xl': '1rem',
      },
      lineHeight: {
        '2xl': '2.25rem',
        '3xl': '1.75rem',
        '4xl': '1.6rem',
        '5xl': '1.6rem',
        '6xl': '1.2rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
      },
    },
  },
  plugins: [],
};
