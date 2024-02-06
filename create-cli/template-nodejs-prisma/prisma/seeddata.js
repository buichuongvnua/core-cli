//default password: 123456
const supperAdmin = {
  username: 'admin@labanhuyenkhong.com',
  email: 'admin@labanhuyenkhong.com',
  passwordSalt: '4af0a4a4948b',
  passwordHash:
    'a6d8ab0913b315cf9cb42857be5d581610ffe64b3c5055666038154d8ff9876765edfc9c812e510190570ad3a6a7854da7561989c60a595d4aa2f3112b868f81',
  isActived: true,
  displayName: 'admin',
  isSupperAdmin: true,
}

const realEstates = [
  {
    code: 'nha_o',
    name: 'Nhà ở',
    description: 'Nhà ở',
    isActived: true,
  },
  {
    code: 'dat_kinh_doanh',
    name: 'Đất kinh doanh',
    description: 'Đất kinh doanh',
    isActived: true,
  },
]

module.exports = { supperAdmin, realEstates }
