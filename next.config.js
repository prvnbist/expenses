require('dotenv').config()
const nodeExternals = require('webpack-node-externals');

module.exports = {
   typescript: {
      ignoreBuildErrors: true,
   },
   future: {
      webpack5: true,
   },
   webpack: (config, {isServer}) => {
      config.resolve.fallback = {
         ...config.resolve.fallback,
         fs: false,
      }
      if(isServer) {
         config.externals = [nodeExternals()]
      }

      return config
   },
   env: {
      HASURA_KEY: process.env.HASURA_KEY,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      WS_GRAPHQL_ENDPOINT: process.env.WS_GRAPHQL_ENDPOINT,
   },
}
