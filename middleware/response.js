/**
 * Response middleware
 */

module.exports = (req, res) => {
  if (req.result) {
    res.send(req.result)
  } else if (res.location) {
    res.status(204).send()
  } else {
    res.status(404).json({ error: { code: 404, message: 'Not found' } })
  }
}
