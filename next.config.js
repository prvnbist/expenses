require('dotenv').config()

module.exports = {
   typescript: {
      ignoreBuildErrors: true,
   },
   future: {
      webpack5: true,
   },
   webpack: config => {
      config.resolve.fallback = {
         ...config.resolve.fallback,
         fs: false,
      }

      return config
   },
   env: {
      HASURA_KEY: process.env.HASURA_KEY,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      WS_GRAPHQL_ENDPOINT: process.env.WS_GRAPHQL_ENDPOINT,
   },
}
