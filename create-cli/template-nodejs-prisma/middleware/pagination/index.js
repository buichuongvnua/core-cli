module.exports = function (req, res, next) {
  let query = req.query
  let page = 1
  let size = 10
  if (query && JSON.stringify(query) !== JSON.stringify({})) {
    page = parseInt(query.page) || 0
    size = parseInt(query.size) || 10
  }
  req.pagination = {
    skip: page * size,
    take: size,
  }
  next()
}
