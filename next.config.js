/** @type {import('next').NextConfig} */
module.exports = {
   reactStrictMode: true,
   pageExtensions: ['page.tsx', 'page.ts', 'api.tsx', 'api.ts'],
   env: {
      NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL,
      NEXT_SUPABASE_PUBLIC_KEY: process.env.NEXT_SUPABASE_PUBLIC_KEY,
      NEXT_HASURA_ENDPOINT: process.env.NEXT_HASURA_ENDPOINT,
      NEXT_HASURA_ADMIN_SECRET: process.env.NEXT_HASURA_ADMIN_SECRET,
   },
   webpack: config => {
      config.resolve.preferRelative = true
      return config
   },
   typescript: {
      ignoreBuildErrors: true,
   },
}
