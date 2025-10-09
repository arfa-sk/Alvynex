const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      ignoreUnknownVersions: true,
      flexbox: 'no-2009',
      grid: 'autoplace',
      remove: false,
      add: true,
      // Suppress gradient warnings
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not ie 11'
      ]
    },
  },
};

export default config;