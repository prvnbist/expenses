require('dotenv').config()

module.exports = {
   env: {
      HASURA_KEY: process.env.HASURA_KEY,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      WS_GRAPHQL_ENDPOINT: process.env.WS_GRAPHQL_ENDPOINT,
   },
}
