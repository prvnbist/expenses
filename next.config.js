/** @type {import('next').NextConfig} */
module.exports = {
   reactStrictMode: true,
   pageExtensions: ['page.tsx', 'page.ts', 'api.tsx', 'api.ts'],
   env: {
      NEXT_MAGIC_PUBLISHABLE_KEY: process.env.NEXT_MAGIC_PUBLISHABLE_KEY,
      NEXT_MAGIC_SECRET_KEY: process.env.NEXT_MAGIC_SECRET_KEY,
      NEXT_MAGIC_ENCRYPTION_KEY: process.env.NEXT_MAGIC_ENCRYPTION_KEY,
      NEXT_HASURA_ENDPOINT: process.env.NEXT_HASURA_ENDPOINT,
      NEXT_HASURA_ADMIN_SECRET: process.env.NEXT_HASURA_ADMIN_SECRET,
   },
   webpack: config => {
      config.resolve.preferRelative = true
      return config
   },
}
