/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    googleAnalyticsMeasurementId: process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
    socketServerUrl: process.env.SOCKET_SERVER_URL,
  },
}

module.exports = nextConfig
