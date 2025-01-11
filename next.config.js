/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/v1/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/fastapi/:path*'
            : '/api/v1/:path*',
      },
    ]
  },
}

module.exports = nextConfig
