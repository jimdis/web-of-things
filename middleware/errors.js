'use strict'

/**
 * Error handler. Catches errors and sends 500 Internal Server Error for non-specific errors.
 * Needs 4 arguments to work as middleware with error handling, even though last arg is not used...
 */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, _) => {
  console.error(err)
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .json({ error: { code: err.statusCode, message: err.message } })
  }
  return res.status(500).json({
    error: {
      code: 500,
      message: err.message,
    },
  })
}
