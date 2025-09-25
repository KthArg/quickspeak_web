// En tu archivo postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- La clave correcta
    autoprefixer: {},
  },
};

export default config;