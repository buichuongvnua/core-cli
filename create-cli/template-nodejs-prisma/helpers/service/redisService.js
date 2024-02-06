const { Redis } = require('ioredis')
const { REDIS_URL } = require('../../config')

const redis = new Redis(REDIS_URL)

const _keySession = (id) => {
  return `session.${id}`
}

const _keySessionAccess = (id) => {
  return `session.access.${id}`
}

const _keySessionRefresh = (id) => {
  return `session.refresh.${id}`
}

const addSession = async ({
  id,
  session_access_id,
  session_refresh_id,
  expired_access_second,
  expired_refresh_second,
}) => {
  await redis
    .multi()
    .set(_keySession(session_access_id), session_access_id)
    .set(_keySession(session_refresh_id))
    .sadd(_keySessionAccess(id), session_access_id)
    .sadd(_keySessionRefresh(id), session_refresh_id)
}

module.exports = {
  addSession,
}
