/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      APP_PASSWORD: process.env.APP_PASSWORD,
   },
}

module.exports = nextConfig
