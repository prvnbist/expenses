/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
      appDir: true,
   },
   env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SECRET: process.env.SUPABASE_SECRET,
   },
}

module.exports = nextConfig
