/**
 * Response middleware
 */

module.exports = (req, res) => {
  // Add links header
  if (req.links) {
    const linkHeader = {}
    Object.keys(req.links).forEach(key => {
      linkHeader[key] = req.links[key].link
    })
    res.links(linkHeader)
  }
  if (req.result) {
    //Add links property to json if it is appropriate
    if (!Array.isArray(res.result) && !req.result.links) {
      req.result.links = req.links
    }
    res.json(req.result)
  } else if (req.route) {
    res.status(204).send()
  } else {
    res.status(404).json({ error: { code: 404, message: 'Not found' } })
  }
}
