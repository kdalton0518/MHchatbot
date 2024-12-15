/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/py/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://192.168.111.116:8000/api/py/:path*'
            : '/api/',
      },
    ]
  },
}

module.exports = nextConfig
