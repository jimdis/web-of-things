'use strict'
/**
 * Auth Middleware to check for API key.
 */

/**
 * Checks header for 'Authorization' and verifies Bearer token.
 * In case token is vefified, adds token to request object.
 * Else sends 401 response.
 */
const auth = async (req, res, next) => {
  try {
    const apiKey = req.get('X-API-Key')
    if (!apiKey) {
      throw new Error(
        'Authorization needed. Put your API key in header X-API-Key'
      )
    }
    if (apiKey !== process.env.API_KEY) {
      throw new Error('Invalid API key.')
    }
    next()
  } catch (e) {
    return res
      .status(401)
      .header('WWW-Authenticate', 'X-API-Key')
      .json({
        error: { code: 401, message: e.message },
      })
  }
}

module.exports = auth
