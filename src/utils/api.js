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
    method: 'POST'
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

async function renameCollection(collectionId, name) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/rename`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  })
  if (response.status === 200) {
    console.log('collection successfully renamed')
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

async function downloadCollectionDb(collectionId) {
  const route = `/api/collections/${collectionId}/collectionDb/export`
  try {
    const res = await axios.get(
      config.get('API_HOST') + route,
      { responseType: 'arraybuffer' }
    )
    return res.data
  } catch (err) {
    throw new Error(`${route} responded with ${err.response.status}: ${err.response.statusText}`)
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

async function getTwitchSubStatus(cancelCallback = undefined) {
  const endpoint = '/api/users/me/twitchSub'
  try {
    const response = await axios.get(config.get('API_HOST') + endpoint, {
      cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined
    })
    return response.data.isSubbedToFunOrange
  } catch (err) {
    if (err.response.status === 404) {
      return null
    } else {
      console.log(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
      return null
    }
  }
}

async function linkPaypalSubscription(subscriptionId) {
  const endpoint = '/api/payments/paypalSubscription/link'
  if (!subscriptionId) {
    throw new Error('subscriptionId is required')
  }
  try {
    const response = await axios.post(
      config.get('API_HOST') + endpoint,
      { subscriptionId: subscriptionId }
    )
    return response.data
  } catch (err) {
    throw new Error(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
  }
}

async function getPaypalSubscription(cancelCallback = undefined) {
  const endpoint = '/api/payments/paypalSubscription'
  try {
    const response = await axios.get(config.get('API_HOST') + endpoint, {
      cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined
    })
    return response.data
  } catch (err) {
    if (err.response.status === 404) {
      return null
    } else {
      console.log(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
      return null
    }
  }
}

async function cancelPaypalSubscription() {
  const endpoint = '/api/payments/paypalSubscription/cancel'
  try {
    await axios.post(config.get('API_HOST') + endpoint)
  } catch (err) {
    if (err.response.status !== 404) {
      throw new Error(`${endpoint} responded with ${err.response.status}: ${JSON.stringify(err.response.data)}`)
    }
  }
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

async function getSubscription(cancelCallback = undefined) {
  try {
    const response = await axios.get(`${config.get('API_HOST')}/api/payments/stripeSubscription`, {
      cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined
    })
    return response.data
  } catch (err) {
    if (err.response.status === 404) {
      return null
    } else {
      console.log(`/api/payments/createSubscription responded with ${err.response.status}: ${err.response.data}`)
      return null
    }
  }
}

async function cancelSubscription() {
  const endpoint = '/api/payments/cancelSubscription'
  try {
    const response = await axios.post(config.get('API_HOST') + endpoint)
    return response.data
  } catch (err) {
    throw new Error(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
  }
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

async function getInstallerURL(platform = undefined) {
  const response = await axios.get('/api/installerURL', {
    params: { platform }
  })
  return response.data
}

async function postComment(collectionId, message) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message
    })
  })
  if (response.status === 200)
    return await response.text()
  else
    throw new Error(`POST /api/collections/${collectionId}/comments responded with ${response.status}: ${await response.text()}`)
}

async function likeComment(collectionId, commentId, remove = false) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      remove: remove
    })
  })
  if (response.status === 200)
    return await response.text()
  else
    throw new Error(`POST /api/collections/${collectionId}/comments/${commentId}/like responded with ${response.status}: ${await response.text()}`)
}

async function deleteComment(collectionId, commentId) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}`, {
    method: 'DELETE'
  })
  if (response.status === 200)
    return await response.text()
  else
    throw new Error(`DELETE /api/collections/${collectionId}/comments/${commentId} responded with ${response.status}: ${await response.text()}`)
}

async function reportComment(collectionId, commentId) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}/report`, {
    method: 'POST'
  })
  if (response.status === 200)
    return await response.text()
  else
    throw new Error(`POST /api/collections/${collectionId}/comments/${commentId}/report responded with ${response.status}: ${await response.text()}`)
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
  renameCollection,
  deleteCollection,
  downloadCollectionDb,
  getUsers,
  getUser,
  getOwnUser,
  getUserFavourites,
  getUserUploads,
  getMetadata,
  submitOtp,
  getTwitchSubStatus,
  linkPaypalSubscription,
  getPaypalSubscription,
  cancelPaypalSubscription,
  createCustomer,
  createSubscription,
  getSubscription,
  cancelSubscription,
  unlinkTwitchAccount,
  getInstallerURL,
  postComment,
  likeComment,
  deleteComment,
  reportComment
}