const { BadRequest } = require('../../helpers/error')
const { paginationBuilder } = require('../../helpers/responseBuilder')
const prisma = require('../../prisma')

const list = async ({ search, pagination }) => {
  let _where = {}
  if (search) {
    _where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ]
  }
  const total = await prisma.compass.count({ where: _where })
  const rows = await prisma.compass.findMany({
    skip: pagination.skip,
    take: pagination.take,
    where: _where,
    include: {
      compassItems: {
        include: { squares: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return paginationBuilder({ rows, total })
}

const get = async (id) => {
  let items = await prisma.compass.findUnique({
    where: { id: id },
    include: {
      compassItems: {
        include: {
          squares: true,
          compassItemsExplains: true,
        },
      },
    },
  })
  if (items.compassItems.length > 0) {
    for (let item of items.compassItems) {
      if (item.squares.length > 0) {
        item.squares = item.squares.sort((a, b) =>
          a.position > b.position ? 1 : a.position < b.position ? -1 : 0,
        )
      }
    }
  }

  return items
}

const create = async ({
  name,
  degreesFrom,
  degreesTo,
  description,
  compassItems,
}) => {
  let compass = await prisma.compass.findFirst({ where: { name: name } })
  if (compass) {
    throw new BadRequest('Name already exist')
  }
  let squares = []
  for (let i = 0; i < compassItems.length; i++) {
    squares.push(compassItems[i].squares)
    delete compassItems[i].squares
  }
  compass = await prisma.compass.create({
    data: {
      name,
      degreesFrom,
      degreesTo,
      description,
      compassItems: {
        create: compassItems,
      },
    },
    include: {
      compassItems: true,
    },
  })
  for (let item of compass.compassItems) {
    const index = item.position - 1
    for (let square of squares[index]) {
      const data = {
        compassItemsId: item.id,
        position: square.position,
        value: square.value,
      }
      console.log('data', data)
      await prisma.square.create({
        data: data,
      })
    }
  }
  return compass
}

const update = async ({
  id,
  name,
  degreesFrom,
  degreesTo,
  description,
  compassItems,
}) => {
  let compass = await prisma.compass.findUnique({ where: { id: id } })
  if (!compass) {
    throw new BadRequest('Compass does not exist')
  }
  if (name !== compass.name) {
    let compassExist = await prisma.compass.findFirst({ where: { name: name } })
    if (compassExist) {
      throw new BadRequest('Compass already exist')
    }
  }
  const dataUpdate = {
    name,
    degreesFrom,
    degreesTo,
    description,
  }
  compass = await prisma.compass.update({
    where: { id: id },
    data: dataUpdate,
  })
  let updates = []
  for (let i = 0; i < compassItems.length; i++) {
    if (compassItems[i].id) {
      for (let square of compassItems[i].squares) {
        updates.push(
          prisma.square.update({
            where: { id: square.id },
            data: { value: square.value },
          }),
        )
      }
    } else {
      updates.push(
        prisma.compassItems.create({
          data: {
            position: compassItems[i].position,
            compassId: compass.id,
            squares: {
              create: compassItems[i].squares,
            },
          },
        }),
      )
    }
  }
  await Promise.all(updates)

  return compass
}

const listCompassItems = async ({ compassId, search, pagination }) => {
  let _where = { compassId }
  if (search) {
    _where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ]
  }
  const total = await prisma.compassItems.count({ where: _where })
  const rows = await prisma.compassItems.findMany({
    skip: pagination.skip,
    take: pagination.take,
    where: _where,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return paginationBuilder({ rows, total })
}

const createExplain = async ({
  name,
  degreesFrom,
  degreesTo,
  description,
  compassItems,
}) => {
  let compass = await prisma.compass.findFirst({ where: { name: name } })
  if (compass) {
    throw new BadRequest('Name already exist')
  }
  compass = await prisma.compass.create({
    data: {
      name,
      degreesFrom,
      degreesTo,
      description,
      compassItems: {
        create: compassItems,
      },
    },
  })

  return compass
}

const del = async ({ id }) => {
  const compass = await prisma.compass.findUnique({
    where: { id },
    include: {
      realEstateCompass: true,
      compassItems: {
        include: {
          squares: true,
          compassItemsExplains: true,
        },
      },
    },
  })
  if (!compass) {
    throw new BadRequest('Compass does not exits')
  }
  for (let item of compass.realEstateCompass) {
    await prisma.realEstateCompass.delete({
      where: {
        realEstateId_compassId: {
          compassId: compass.id,
          realEstateId: item.realEstateId,
        },
      },
    })
  }
  for (let item of compass.compassItems) {
    await prisma.square.deleteMany({ where: { compassItemsId: item.id } })
    await prisma.compassItemsExplain.deleteMany({
      where: { compassItemsId: item.id },
    })
    await prisma.compassItems.delete({ where: { id: item.id } })
  }
  await prisma.compass.delete({ where: { id } })
  return { success: true }
}

const updateRealEstateCompass = async ({ id, realEstateId, value }) => {
  const realEstateCompass = await prisma.realEstateCompass.upsert({
    where: {
      realEstateId_compassId: {
        compassId: id,
        realEstateId,
      },
    },
    create: {
      compassId: id,
      realEstateId,
      value,
    },
    update: {
      value,
    },
  })

  return realEstateCompass
}

const getRealEstateCompass = async ({ compassId, realEstateId }) => {
  return await prisma.realEstateCompass.findUnique({
    where: {
      realEstateId_compassId: {
        compassId,
        realEstateId,
      },
    },
  })
}

const updateCompassItemExplain = async ({
  compassItemsId,
  realEstateId,
  value,
  shortValue,
}) => {
  const compassItemsRealEstate = await prisma.compassItemsExplain.upsert({
    where: {
      compassItemsId_realEstateId: {
        compassItemsId,
        realEstateId,
      },
    },
    update: {
      value,
      shortValue,
    },
    create: {
      compassItemsId,
      realEstateId,
      value,
      shortValue,
    },
  })
  return compassItemsRealEstate
}

const getCompassItemExplains = async ({ compassId, realEstateId }) => {
  const compassItems = await prisma.compassItems.findMany({
    where: { compassId },
  })
  let compassItemsIds = []
  for (let item of compassItems) {
    compassItemsIds.push(item.id)
  }
  return await prisma.compassItemsExplain.findMany({
    where: { compassItemsId: { in: compassItemsIds }, realEstateId },
  })
}

const getCompassItemExplain = async ({ compassItemsId, realEstateId }) => {
  const data = await prisma.compassItemsExplain.findUnique({
    where: {
      compassItemsId_realEstateId: {
        compassItemsId,
        realEstateId,
      },
    },
  })
  return data
}

module.exports = {
  list,
  get,
  create,
  update,
  listCompassItems,
  createExplain,
  del,
  updateRealEstateCompass,
  getRealEstateCompass,
  updateCompassItemExplain,
  getCompassItemExplains,
  getCompassItemExplain,
}
