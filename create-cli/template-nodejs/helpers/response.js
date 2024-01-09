const paginationBuilder = (items, total) => {
  return {
    total: total,
    data: items,
  }
}

const dataBuilder = (data) => {
  return {
    data: data,
  }
}

module.exports = {
  dataBuilder,
  paginationBuilder,
}
