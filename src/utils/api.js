import config from '../config/config'
import axios from 'axios'

const getRequestWithQueryParameters = async (route, params = undefined, cancelCallback = undefined) => {
  const res = await axios({
    method: 'GET',
    url: config.get('API_HOST') + route,
    params: params,
    cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined
  })
  if (res.status !== 200) {
    throw new Error(`${route} responded with ${res.status}: ${res.data}`)
  }
  return res.data
}

// <TODO: link to docs>
async function getRecentCollections(cursor = undefined, perPage = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters('/api/collections/recent', {
    cursor,
    perPage
  }, cancelCallback)
}

// range: 'today' or 'week' or 'month' or 'year' or 'alltime'
// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
async function getPopularCollections(range = 'today', cursor = undefined, perPage = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters('/api/collections/popularv2', {
    range,
    cursor,
    perPage
  }, cancelCallback)
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
async function searchCollections(queryString, cursor, perPage = undefined, sortBy = undefined, orderBy = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters('/api/collections/search', {
    search: queryString,
    cursor,
    perPage,
    sortBy,
    orderBy
  }, cancelCallback)
}

// Returns CollectionData object: https://osucollector.com/docs.html#responses-getCollectionById-200-schema
async function getCollection(id, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/collections/${id}`, {}, cancelCallback)
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollectionBeatmaps-200-schema
async function getCollectionBeatmaps(id, cursor = undefined, perPage = undefined, sortBy = undefined, orderBy = undefined, filterMin = undefined, filterMax = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/collections/${id}/beatmapsv2`, {
    cursor,
    perPage,
    sortBy,
    orderBy,
    filterMin: filterMin && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMin : undefined,
    filterMax: filterMax && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMax : undefined
  }, cancelCallback)
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
    throw new Error(`/api/collections/upload responded with ${response.status}: ${await response.text()}`)
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
    console.log(await response.text())
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
    console.log(await response.text())
    return false
  }
}

async function editCollectionDescription(collectionId, description) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/description`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: description
    })
  })
  if (response.status === 200) {
    console.log('description successfully edited')
    return true
  } else {
    console.log(response)
    console.log(await response.text())
    return false
  }
}

async function deleteCollection(collectionId) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}`, {
    method: 'DELETE'
  })
  if (response.status === 200) {
    console.log('description successfully edited')
    return true
  } else {
    console.log(response)
    console.log(await response.text())
    return false
  }
}

// Returns PaginatedUserData object: TODO: add link to docs
async function getUsers(page, perPage = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters('/api/users', {
    page,
    perPage
  }, cancelCallback)
}

// Returns User object or null if 404: TODO: add link to docs
async function getUser(userId) {
  try {
    const res = await fetch(`${config.get('API_HOST')}/api/users/${userId}`)
    const user = await res.json()
    return user
  } catch {
    return null
  }
}

// https://osucollector.com/docs.html#responses-getOwnUser-200-schema
// (schema might not show in above link, if that's the case open openapi.yaml in swagger editor)
// https://osucollector.com/openapi.yaml
// https://editor.swagger.io/
async function getOwnUser() {
  const res = await fetch(`${config.get('API_HOST')}/api/users/me`)
  const data = await res.json()
  return data.loggedIn ? data.user : null
}

// Returns an array of CollectionData objects: https://osucollector.com/docs.html#responses-getUserFavourites-200-schema
async function getUserFavourites(userId, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/users/${userId}/favourites`, {}, cancelCallback)
}

// Returns an array of CollectionData objects: TODO: add link to docs
async function getUserUploads(userId, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/users/${userId}/uploads`, {}, cancelCallback)
}

async function getMetadata(cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/metadata`, {}, cancelCallback)
}

async function submitOtp(otp, y) {
  return await fetch(`${config.get('API_HOST')}/api/authentication/otp?otp=${otp}&y=${y}`, {
    method: 'POST',
  })
}

async function createCustomer(email) {
  const response = await fetch(`${config.get('API_HOST')}/api/payments/createCustomer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email
    })
  });
  if (response.status === 200)
    return await response.text()
  else
    throw new Error(`/api/payments/createCustomer responded with ${response.status}: ${await response.text()}`)
}

async function createSubscription() {
  const response = await fetch(`${config.get('API_HOST')}/api/payments/createSubscription`, {
    method: 'POST'
  })
  if (response.status === 200)
    return response.json()
  else
    throw new Error(`/api/payments/createSubscription responded with ${response.status}: ${await response.text()}`)
}

async function cancelSubscription() {
  const response = await fetch(`${config.get('API_HOST')}/api/payments/cancelSubscription`, {
    method: 'POST'
  })
  if (response.status === 200)
    return await response.json()
  else
    throw new Error(`/api/payments/cancelSubscription responded with ${response.status}: ${await response.text()}`)
}

async function unlinkTwitchAccount() {
  const response = await fetch(`${config.get('API_HOST')}/api/users/me/unlinkTwitch`, {
    method: 'POST'
  })
  if (response.status === 200)
    return await response.text()
  else
    throw new Error(`/api/users/me/unlinkTwitch responded with ${response.status}: ${await response.text()}`)
}

async function getInstallerURL() {
  const response = await axios.get('/api/installerURL')
  return response.data
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
  editCollectionDescription,
  deleteCollection,
  getUsers,
  getUser,
  getOwnUser,
  getUserFavourites,
  getUserUploads,
  getMetadata,
  submitOtp,
  createCustomer,
  createSubscription,
  cancelSubscription,
  unlinkTwitchAccount,
  getInstallerURL
}