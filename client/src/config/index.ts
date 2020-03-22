export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://deb100b8.ngrok.io'
    : 'http://localhost:5000'
