/** @type {import('next').NextConfig} */
module.exports = {
   reactStrictMode: true,
   env: {
      NEXT_MAGIC_PUBLISHABLE_KEY: process.env.NEXT_MAGIC_PUBLISHABLE_KEY,
      NEXT_MAGIC_SECRET_KEY: process.env.NEXT_MAGIC_SECRET_KEY,
      NEXT_MAGIC_ENCRYPTION_KEY: process.env.NEXT_MAGIC_ENCRYPTION_KEY,
      NEXT_HASURA_ENDPOINT: process.env.NEXT_HASURA_ENDPOINT,
      NEXT_HASURA_ADMIN_SECRET: process.env.NEXT_HASURA_ADMIN_SECRET,
   },
}
