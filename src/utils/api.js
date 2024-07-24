import { useMemo } from 'react'
import config from '../config/config'
import Axios from 'axios'
import { axiosFetcher, formatQueryParams, useCancellableSWRImmutable } from './misc'
import useSWRInfinite from 'swr/infinite'
import useSWRImmutable from 'swr/immutable'

const axios = Axios.create({
  baseURL: config.get('API_HOST'),
  withCredentials: true,
})

const getRequestWithQueryParameters = async (route, params = undefined, cancelCallback = undefined) => {
  const res = await axios.get(route, {
    params: params,
    cancelToken: cancelCallback ? new Axios.CancelToken(cancelCallback) : undefined,
  })
  return res.data
}

function useInfinite(url, query, mappingFunction = (x) => x, fetchCondition = true) {
  const {
    data: pages,
    error,
    isValidating,
    size: currentPage,
    setSize: setCurrentPage,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (!fetchCondition) return null
      let _query = { ...query }
      if (previousPageData?.nextPageCursor) {
        _query.cursor = previousPageData.nextPageCursor
      }
      return url + '?' + formatQueryParams(_query)
    },
    (url) => axiosFetcher(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
    }
  )
  if (error) console.error(error)
  // cache object with useMemo
  // otherwise a new object gets created on each render, causing a render loop if used inside a useEffect dependency array
  const entities = useMemo(() => pages?.flatMap(mappingFunction) ?? [], [JSON.stringify(pages)])
  const hasMore = pages?.length > 0 ? pages[pages.length - 1].hasMore : true

  return {
    entities,
    error,
    isValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  }
}

export async function getRecentCollections(cursor = undefined, perPage = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters(
    '/api/collections/recent',
    {
      cursor,
      perPage,
    },
    cancelCallback
  )
}
export function useRecentCollections({ perPage = 9, fetchCondition = true }) {
  const { entities, error, isValidating, currentPage, setCurrentPage, hasMore } = useInfinite(
    '/api/collections/recent',
    { perPage },
    (data) => data.collections,
    fetchCondition
  )
  return {
    recentCollections: entities,
    recentCollectionsError: error,
    isValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  }
}

// range: 'today' or 'week' or 'month' or 'year' or 'alltime'
// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
export async function getPopularCollections(
  range = 'today',
  cursor = undefined,
  perPage = undefined,
  cancelCallback = undefined
) {
  return getRequestWithQueryParameters(
    '/api/collections/popularv2',
    {
      range,
      cursor,
      perPage,
    },
    cancelCallback
  )
}
export function usePopularCollections({ range = 'today', perPage = 9 }) {
  const { entities, error, isValidating, currentPage, setCurrentPage, hasMore } = useInfinite(
    '/api/collections/popularv2',
    { range, perPage },
    (data) => data.collections
  )
  return {
    popularCollections: entities,
    popularCollectionsError: error,
    isValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  }
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
export async function searchCollections(
  queryString,
  cursor,
  perPage = undefined,
  sortBy = undefined,
  orderBy = undefined,
  cancelCallback = undefined
) {
  return getRequestWithQueryParameters(
    '/api/collections/search',
    {
      search: queryString,
      cursor,
      perPage,
      sortBy,
      orderBy,
    },
    cancelCallback
  )
}

// Returns CollectionData object: https://osucollector.com/docs.html#responses-getCollectionById-200-schema
export async function getCollection(id, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/collections/${id}`, {}, cancelCallback)
}
export function useCollection(id) {
  const { data, error, mutate } = useSWRImmutable(`/api/collections/${id}`, axiosFetcher)
  if (error) console.error(error)
  return { collection: data, collectionError: error, mutateCollection: mutate }
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollectionBeatmaps-200-schema
export async function getCollectionBeatmaps(
  id,
  cursor = undefined,
  perPage = undefined,
  sortBy = undefined,
  orderBy = undefined,
  filterMin = undefined,
  filterMax = undefined,
  cancelCallback = undefined
) {
  const query = {
    cursor,
    perPage,
    sortBy,
    orderBy,
    filterMin: filterMin && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMin : undefined,
    filterMax: filterMax && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMax : undefined,
  }
  return getRequestWithQueryParameters(`/api/collections/${id}/beatmapsv2`, query, cancelCallback)
}
export function useCollectionBeatmaps(id, { perPage, sortBy, orderBy, filterMin, filterMax }) {
  const query = {
    perPage,
    sortBy,
    orderBy,
    filterMin: filterMin && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMin : undefined,
    filterMax: filterMax && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMax : undefined,
  }
  const { entities, error, isValidating, currentPage, setCurrentPage, hasMore } = useInfinite(
    `/api/collections/${id}/beatmapsv2`,
    query,
    (data) => data.beatmaps
  )
  return {
    collectionBeatmaps: entities,
    collectionBeatmapsError: error,
    isValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  }
}

// throws error on upload failure
export async function uploadCollections(collections) {
  try {
    const response = await axios.post(`/api/collections/upload`, collections)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(`/api/collections/upload responded with ${error.response.status}: ${error.response.data}`)
  }
}

// Returns true on success
export async function favouriteCollection(collectionId) {
  try {
    await axios.post(`/api/collections/${collectionId}/favourite`)
    console.log(`collection ${collectionId} added to favourites`)
    return true
  } catch (error) {
    console.error(error)
    console.error(error.response.data)
    return false
  }
}

// Returns true on success
export async function unfavouriteCollection(collectionId) {
  try {
    await axios.delete(`/api/collections/${collectionId}/favourite`)
    console.log(`collection ${collectionId} removed from favourites`)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function editCollectionDescription(collectionId, description) {
  try {
    await axios.put(`/api/collections/${collectionId}/description`, {
      description: description,
    })
    console.log('description successfully edited')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function renameCollection(collectionId, name) {
  try {
    await axios.put(`/api/collections/${collectionId}/rename`, { name })
    console.log('collection successfully renamed')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function deleteCollection(collectionId) {
  try {
    await axios.delete(`/api/collections/${collectionId}`)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function downloadCollectionDb(collectionId) {
  const route = `/api/collections/${collectionId}/collectionDb/export`
  try {
    const res = await axios.get(route, {
      responseType: 'arraybuffer',
    })
    return res.data
  } catch (err) {
    throw new Error(`${route} responded with ${err.response.status}: ${err.response.statusText}`)
  }
}

// Returns PaginatedUserData object
export async function getUsers(page, perPage = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters(
    '/api/users',
    {
      page,
      perPage,
    },
    cancelCallback
  )
}

// Returns User object or null if 404
export async function getUser(userId) {
  try {
    const response = await axios.get(`/api/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

// https://osucollector.com/docs.html#responses-getOwnUser-200-schema
// (schema might not show in above link, if that's the case open openapi.yaml in swagger editor)
// https://osucollector.com/openapi.yaml
// https://editor.swagger.io/
export async function getOwnUser() {
  const response = await axios.get(`/api/users/me`)
  const { loggedIn, user } = response.data
  return loggedIn ? user : null
}

export async function getUserFavourites(userId, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/users/${userId}/favourites`, {}, cancelCallback)
}

export async function getUserUploads(userId, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/users/${userId}/uploads`, {}, cancelCallback)
}
export function useUserUploads(userId) {
  const { data, error, mutate } = useSWRImmutable(userId ? `/api/users/${userId}/uploads` : null, axiosFetcher)
  if (error) console.error(error)
  return {
    collections: data?.collections,
    tournaments: data?.tournaments,
    tournamentError: error,
    mutateUploads: mutate,
  }
}

export async function getMetadata(cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/metadata`, {}, cancelCallback)
}
export const useMetadata = () => useCancellableSWRImmutable(`/api/metadata`)

export async function submitOtp(otp, y) {
  return await axios.post(`/api/authentication/otp?otp=${otp}&y=${y}`)
}

export async function getTwitchSubStatus(cancelCallback = undefined) {
  const endpoint = '/api/users/me/twitchSub'
  try {
    const response = await axios.get(endpoint, {
      cancelToken: cancelCallback ? new Axios.CancelToken(cancelCallback) : undefined,
    })
    return response.data.isSubbedToFunOrange
  } catch (err) {
    if (err.toString() === 'Cancel') {
      return
    }
    if (err.response.status === 404) {
      return null
    } else {
      console.log(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
      return null
    }
  }
}

export async function linkPaypalSubscription(subscriptionId) {
  const endpoint = '/api/payments/paypalSubscription/link'
  if (!subscriptionId) {
    throw new Error('subscriptionId is required')
  }
  try {
    const response = await axios.post(endpoint, {
      subscriptionId: subscriptionId,
    })
    return response.data
  } catch (err) {
    throw new Error(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
  }
}

export async function getPaypalSubscription(cancelCallback = undefined) {
  const endpoint = '/api/payments/paypalSubscription'
  try {
    const response = await axios.get(endpoint, {
      cancelToken: cancelCallback ? new Axios.CancelToken(cancelCallback) : undefined,
    })
    return response.data
  } catch (err) {
    if (err.toString() === 'Cancel') {
      return
    }
    if (err.response.status === 404) {
      return null
    } else {
      console.log(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
      return null
    }
  }
}

export async function cancelPaypalSubscription() {
  const endpoint = '/api/payments/paypalSubscription/cancel'
  try {
    await axios.post(endpoint)
  } catch (err) {
    if (err.response.status !== 404) {
      throw new Error(`${endpoint} responded with ${err.response.status}: ${JSON.stringify(err.response.data)}`)
    } else {
      console.error(err)
    }
  }
}

export async function createCustomer(email) {
  try {
    const response = await axios.post(`/api/payments/createCustomer`, { email })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(
      `/api/payments/createCustomer responded with ${error.response.status}: ${await error.response.text()}`
    )
  }
}

export async function createSubscription() {
  try {
    const response = await axios.post(`/api/payments/createSubscription`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(
      `/api/payments/createSubscription responded with ${error.response.status}: ${await error.response.text()}`
    )
  }
}

export async function getSubscription(cancelCallback = undefined) {
  try {
    const response = await axios.get(`/api/payments/stripeSubscription`, {
      cancelToken: cancelCallback ? new Axios.CancelToken(cancelCallback) : undefined,
    })
    return response.data
  } catch (err) {
    if (err.toString() === 'Cancel') {
      return
    }
    if (err.response?.status === 404) {
      return null
    } else {
      console.error(`/api/payments/createSubscription responded with ${err.response?.status}: ${err.response?.data}`)
      return null
    }
  }
}

export async function cancelSubscription() {
  const endpoint = '/api/payments/cancelSubscription'
  try {
    const response = await axios.post(endpoint)
    return response.data
  } catch (err) {
    throw new Error(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
  }
}

export async function unlinkTwitchAccount() {
  try {
    const response = await axios.post(`/api/users/me/unlinkTwitch`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(
      `/api/users/me/unlinkTwitch responded with ${error.response.status}: ${await error.response.text()}`
    )
  }
}

export async function getInstallerURL(platform = undefined) {
  const response = await axios.get('/api/installerURL', {
    params: { platform },
  })
  return response.data
}

export async function postComment(collectionId, message) {
  try {
    const response = await axios.post(`/api/collections/${collectionId}/comments`, { message })
    return response.data
  } catch (error) {
    console.error(error)
    const response = error.response
    throw new Error(
      `POST /api/collections/${collectionId}/comments responded with ${response.status}: ${await response.text()}`
    )
  }
}

export async function likeComment(collectionId, commentId, remove = false) {
  try {
    const response = await axios.post(`/api/collections/${collectionId}/comments/${commentId}/like`, { remove })
    return response.data
  } catch (error) {
    console.error(error)
    const response = error.response
    throw new Error(
      `POST /api/collections/${collectionId}/comments/${commentId}/like responded with ${
        response.status
      }: ${await response.text()}`
    )
  }
}

export async function deleteComment(collectionId, commentId) {
  try {
    const response = await axios.delete(`/api/collections/${collectionId}/comments/${commentId}`)
    return response.data
  } catch (error) {
    console.error(error)
    const response = error.response
    throw new Error(
      `DELETE /api/collections/${collectionId}/comments/${commentId} responded with ${
        response.status
      }: ${await response.text()}`
    )
  }
}

export async function reportComment(collectionId, commentId) {
  try {
    const response = await axios.post(`/api/collections/${collectionId}/comments/${commentId}/report`)
    return response.data
  } catch (error) {
    console.error(error)
    const response = error.response
    throw new Error(
      `POST /api/collections/${collectionId}/comments/${commentId}/report responded with ${
        response.status
      }: ${await response.text()}`
    )
  }
}

export async function logout() {
  const route = '/api/logout'
  try {
    await axios.post(route)
  } catch (error) {
    console.error(`${route} responded with ${error.response.status}: ${error.response.data}`)
  }
}

export async function createTournament(createTournamentDto) {
  const route = '/api/tournaments'
  const res = await axios.post(route, createTournamentDto)
  if (res.status !== 200) {
    throw new Error(`${route} responded with ${res.status}: ${res.data}`)
  }
  return res.data
}

export async function editTournament(id, createTournamentDto) {
  const route = `/api/tournaments/${id}`
  const res = await axios.patch(route, createTournamentDto)
  if (res.status !== 200) {
    throw new Error(`${route} responded with ${res.status}: ${res.data}`)
  }
  return res.data
}

export async function getRecentTournaments(cursor = undefined, perPage = undefined, cancelCallback = undefined) {
  return getRequestWithQueryParameters(
    '/api/tournaments/recent',
    {
      cursor,
      perPage,
    },
    cancelCallback
  )
}
export function useRecentTournaments({ perPage = 10, fetchCondition }) {
  const { entities, error, isValidating, currentPage, setCurrentPage, hasMore } = useInfinite(
    '/api/tournaments/recent',
    { perPage },
    (data) => data.tournaments,
    fetchCondition
  )
  return {
    recentTournaments: entities,
    recentTournamentsError: error,
    isValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  }
}

export async function searchTournaments(
  queryString,
  cursor,
  perPage = undefined,
  sortBy = undefined,
  orderBy = undefined,
  cancelCallback = undefined
) {
  return getRequestWithQueryParameters(
    '/api/tournaments/search',
    {
      search: queryString,
      cursor,
      perPage,
      sortBy,
      orderBy,
    },
    cancelCallback
  )
}
export function useSearchTournaments({
  search,
  perPage = 10,
  sortBy = undefined,
  orderBy = undefined,
  fetchCondition = true,
}) {
  const { entities, error, isValidating, currentPage, setCurrentPage, hasMore } = useInfinite(
    '/api/tournaments/search',
    {
      search,
      perPage,
      sortBy,
      orderBy,
    },
    (data) => data.tournaments,
    fetchCondition
  )
  return {
    searchTournaments: entities,
    searchTournamentsError: error,
    isValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  }
}

export async function getTournament(id, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/tournaments/${id}`, {}, cancelCallback)
}
export function useTournament(id) {
  const { data, error, mutate } = useSWRImmutable(`/api/tournaments/${id}`, axiosFetcher)
  if (error) console.error(error)
  return { tournament: data, tournamentError: error, mutateTournament: mutate }
}

export async function deleteTournament(id) {
  try {
    const response = await axios.delete(`/api/tournaments/${id}`)
    console.log('tournament successfully deleted')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function linkIrc(ircName) {
  const route = '/api/users/me/linkIrc'
  try {
    const res = await axios.patch(route, { ircName })
    return res.data
  } catch (error) {
    throw new Error(`${route} responded with ${error.response.status}: ${error.response.data}`)
  }
}

export async function updateNpCollectionId(collectionId) {
  const route = '/api/users/me/npCollectionId'
  try {
    const res = await axios.patch(route, { collectionId })
    return res.data
  } catch (error) {
    console.error(`${route} responded with ${error.response.status}: ${error.response.data}`)
  }
}

export async function favouriteTournament(tournamentId, favourited) {
  const route = '/api/users/me/favouriteTournament'
  try {
    const res = await axios.patch(route, {
      tournamentId: Number(tournamentId),
      favourited,
    })
    return res.data
  } catch (error) {
    console.error(`${route} responded with ${error.response.status}: ${error.response.data}`)
  }
}

export async function changeUser({ username, userId }) {
  const route = '/api/users/changeUser'
  const res = await axios.post(route, { username, userId })
  if (res.status !== 200) {
    throw new Error(`${route} responded with ${res.status}: ${res.data}`)
  }
  return res.data
}

export async function loginBasicAuth({ username, password }) {
  const route = '/api/login-basic-auth'
  const res = await axios.post(route, { username, password })
  return res.data
}

export async function setPassword({ username, currentPassword, newPassword }) {
  const route = '/api/users/resetPassword'
  const res = await axios.post(route, { username, currentPassword, newPassword })
  return res.data
}
