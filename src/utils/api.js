import config from '../config.json'

// All these functions return parsed response bodies as promises

async function getRecentCollections() {
  const res = await fetch(`${config.API_HOST}/api/collections/recent`)
  return await res.json()
}

async function getCollection(id) {
  const res = await fetch(`${config.API_HOST}/api/collections/${id}`)
  return await res.json()
}

async function getCollectionBeatmaps(id) {
  const res = await fetch(`${config.API_HOST}/api/collections/${id}/beatmaps`)
  return await res.json()
}

export {
  getRecentCollections,
  getCollection,
  getCollectionBeatmaps
}