module.exports = {
   plugins: {
      tailwindcss: {},
      autoprefixer: {},
      ...(process.env.NODE_ENV === 'production'
         ? {
              '@fullhuman/postcss-purgecss': {
                 content: [
                    './components/**/*.jsx',
                    './pages/**/*.js',
                    './sections/**/**/*.jsx',
                 ],
                 defaultExtractor: content =>
                    content.match(/[\w-/:]+(?<!:)/g) || [],
              },
           }
         : {}),
   },
}
