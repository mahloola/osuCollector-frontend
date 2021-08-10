import config from '../config/config'

// All these functions return parsed response bodies as promises

async function getRecentCollections(page) {
  const res = await fetch(`${config.get('API_HOST')}/api/collections?page=${page}`)
  return await res.json()
}

async function getCollection(id) {
  const res = await fetch(`${config.get('API_HOST')}/api/collections/${id}`)
  return await res.json()
}

async function getCollectionBeatmaps(id) {
  const res = await fetch(`${config.get('API_HOST')}/api/collections/${id}/beatmaps`)
  return await res.json()
}

async function uploadCollections(collections) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(collections)
  });
  if (response.status === 200)
    return response.json();
  else
    throw new Error(`/api/collections/upload responded with ${response.status}: ${response.body}`)
}

// Returns true on success
async function favouriteCollection(collectionId) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/favourite`, {
    "method": "POST"
  })
  if (response.status === 200) {
    console.log(`collection ${collectionId} added to favourites`)
    return true
  } else {
    console.log(response)
    return false
  }
}

async function unfavouriteCollection(collectionId) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/favourite`, {
    "method": "DELETE"
  })
  if (response.status === 200) {
    console.log(`collection ${collectionId} removed from favourites`)
    return true
  } else {
    console.log(response)
    return false
  }
}

export {
  getRecentCollections,
  getCollection,
  getCollectionBeatmaps,
  uploadCollections,
  favouriteCollection,
  unfavouriteCollection
}