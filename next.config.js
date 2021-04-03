require('dotenv').config()

module.exports = {
   webpack: (config, { isServer }) => {
      if (!isServer) {
         config.node = { fs: 'empty', module: 'empty' }
      }

      return config
   },
   env: {
      HASURA_KEY: process.env.HASURA_KEY,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      WS_GRAPHQL_ENDPOINT: process.env.WS_GRAPHQL_ENDPOINT,
   },
}
