module.exports = function (req, res, next) {
  let query = req.query
  let pageNumber = 1
  let pageSize = 5
  console.log(req.query)
  if (query && JSON.stringify(query) !== JSON.stringify({})) {
    pageSize = parseInt(query.pageSize) || 5
    pageNumber = parseInt(query.pageNumber) || 1
  }
  req.pagination = {
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
  }
  next()
}
