export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://8a309e94.ngrok.io'
    : // : 'https://8a309e94.ngrok.io'
      'http://localhost:5000'
