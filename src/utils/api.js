import config from '../config/config'

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
async function getRecentCollections(page, perPage=undefined) {
  const queryParams = [
    `?page=${page}`,
    perPage ? `&perPage=${perPage}` : ''
  ].join('')
  const res = await fetch(`${config.get('API_HOST')}/api/collections${queryParams}`)
  return await res.json()
}

// range: 'today' or 'week' or 'month' or 'year' or 'alltime'
// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
async function getPopularCollections(range='today', page, perPage=undefined) {
  const queryParams = [
    `?range=${range}`,
    `&page=${page}`,
    perPage ? `&perPage=${perPage}` : ''
  ].join('')
  const res = await fetch(`${config.get('API_HOST')}/api/collections/popular${queryParams}`)
  return await res.json()
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
async function searchCollections(queryString, page, perPage=undefined) {
  const queryParams = [
    `?search=${encodeURIComponent(queryString)}`,
    `&page=${page}`,
    perPage ? `&perPage=${perPage}` : ''
  ].join('')
  const res = await fetch(`${config.get('API_HOST')}/api/collections${queryParams}`)
  return await res.json()
}

// Returns CollectionData object: https://osucollector.com/docs.html#responses-getCollectionById-200-schema
async function getCollection(id) {
  const res = await fetch(`${config.get('API_HOST')}/api/collections/${id}`)
  return await res.json()
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollectionBeatmaps-200-schema
async function getCollectionBeatmaps(id, page, perPage=undefined, sortBy=undefined, orderBy=undefined) {
  const queryParams = [
    `?page=${page}`,
    perPage ? `&perPage=${perPage}` : '',
    sortBy ? `&sortBy=${sortBy}` : '',
    orderBy ? `&orderBy=${orderBy}` : ''
  ].join('')
  const res = await fetch(`${config.get('API_HOST')}/api/collections/${id}/beatmaps${queryParams}`)
  return await res.json()
}

// TODO: return value is garbage, don't use it
// throws error on upload failure
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

// Returns true on success
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

// Returns PaginatedUserData object: TODO: add link
async function getUsers(page, perPage=undefined) {
  const queryParams = [
    `?page=${page}`,
    perPage ? `&perPage=${perPage}` : ''
  ].join('')
  const res = await fetch(`${config.get('API_HOST')}/api/users${queryParams}`)
  return await res.json()
}

// Only returns the 'user' property of this object: https://osucollector.com/docs.html#responses-getOwnUser-200-schema
// If user is not logged in, will return null
// (schema might not show in above link, if that's the case open openapi.yaml in swagger editor)
// https://osucollector.com/openapi.yaml
// https://editor.swagger.io/
async function getOwnUser() {
  const res = await fetch(`${config.get('API_HOST')}/api/users/me`)
  const data = await res.json()
  return data.loggedIn ? data.user : null
}

// Returns an array of CollectionData objects: https://osucollector.com/docs.html#responses-getUserFavourites-200-schema
async function getUserFavourites(userId) {
  const res = await fetch(`${config.get('API_HOST')}/api/${userId}/favourites`)
  return await res.json()
}

export {
  getRecentCollections,
  getPopularCollections,
  searchCollections,
  getCollection,
  getCollectionBeatmaps,
  uploadCollections,
  favouriteCollection,
  unfavouriteCollection,
  getUsers,
  getOwnUser,
  getUserFavourites
}