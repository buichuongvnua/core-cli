const paginationBuilder = ({ rows, total, hasNext = false }) => {
  return {
    data: rows,
    page: {
      total_pages: total,
      total_elements: total,
      hasNext,
    },
  }
}

const dataBuilder = ({ data }) => {
  return data
}

module.exports = {
  paginationBuilder,
  dataBuilder,
}
