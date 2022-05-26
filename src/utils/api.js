import { useMemo } from 'react'
import config from '../config/config'
import axios from 'axios'
import { axiosFetcher, formatQueryParams, useCancellableSWRImmutable } from './misc'
import useSWRInfinite from 'swr/infinite'

const getRequestWithQueryParameters = async (
  route,
  params = undefined,
  cancelCallback = undefined
) => {
  const res = await axios({
    method: 'GET',
    url: config.get('API_HOST') + route,
    params: params,
    cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined,
  })
  return res.data
}

function useInfinite(url, query, mappingFunction = (x) => x) {
  const {
    data: pages,
    error,
    isValidating,
    size: currentPage,
    setSize: setCurrentPage,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      let _query = { ...query }
      if (previousPageData?.nextPageCursor) {
        _query.cursor = previousPageData.nextPageCursor
      }
      return url + formatQueryParams(_query)
    },
    (url) => axiosFetcher(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
    }
  )
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

export async function getRecentCollections(
  cursor = undefined,
  perPage = undefined,
  cancelCallback = undefined
) {
  return getRequestWithQueryParameters(
    '/api/collections/recent',
    {
      cursor,
      perPage,
    },
    cancelCallback
  )
}
export function useRecentCollections({ perPage = 9 }) {
  const { entities, error, isValidating, currentPage, setCurrentPage, hasMore } = useInfinite(
    '/api/collections/recent?',
    { perPage },
    (data) => data.collections
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
    '/api/collections/popularv2?',
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
  return getRequestWithQueryParameters(
    `/api/collections/${id}/beatmapsv2`,
    {
      cursor,
      perPage,
      sortBy,
      orderBy,
      filterMin: filterMin && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMin : undefined,
      filterMax: filterMax && ['difficulty_rating', 'bpm'].includes(sortBy) ? filterMax : undefined,
    },
    cancelCallback
  )
}

// throws error on upload failure
export async function uploadCollections(collections) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(collections),
  })
  if (response.status === 200) return response.json()
  else
    throw new Error(
      `/api/collections/upload responded with ${response.status}: ${await response.text()}`
    )
}

// Returns true on success
export async function favouriteCollection(collectionId) {
  const response = await fetch(
    `${config.get('API_HOST')}/api/collections/${collectionId}/favourite`,
    {
      method: 'POST',
    }
  )
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
export async function unfavouriteCollection(collectionId) {
  const response = await fetch(
    `${config.get('API_HOST')}/api/collections/${collectionId}/favourite`,
    {
      method: 'DELETE',
    }
  )
  if (response.status === 200) {
    console.log(`collection ${collectionId} removed from favourites`)
    return true
  } else {
    console.log(response)
    console.log(await response.text())
    return false
  }
}

export async function editCollectionDescription(collectionId, description) {
  const response = await fetch(
    `${config.get('API_HOST')}/api/collections/${collectionId}/description`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: description,
      }),
    }
  )
  if (response.status === 200) {
    console.log('description successfully edited')
    return true
  } else {
    console.log(response)
    console.log(await response.text())
    return false
  }
}

export async function renameCollection(collectionId, name) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/rename`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
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

export async function deleteCollection(collectionId) {
  const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}`, {
    method: 'DELETE',
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

export async function downloadCollectionDb(collectionId) {
  const route = `/api/collections/${collectionId}/collectionDb/export`
  try {
    const res = await axios.get(config.get('API_HOST') + route, {
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
export async function getOwnUser() {
  const res = await fetch(`${config.get('API_HOST')}/api/users/me`)
  const data = await res.json()
  return data.loggedIn ? data.user : null
}

// Returns an array of CollectionData objects: https://osucollector.com/docs.html#responses-getUserFavourites-200-schema
export async function getUserFavourites(userId, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/users/${userId}/favourites`, {}, cancelCallback)
}

// Returns an array of CollectionData objects
export async function getUserUploads(userId, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/users/${userId}/uploads`, {}, cancelCallback)
}

export async function getMetadata(cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/metadata`, {}, cancelCallback)
}
export const useMetadata = () => useCancellableSWRImmutable(`/api/metadata`)

export async function submitOtp(otp, y) {
  return await fetch(`${config.get('API_HOST')}/api/authentication/otp?otp=${otp}&y=${y}`, {
    method: 'POST',
  })
}

export async function getTwitchSubStatus(cancelCallback = undefined) {
  const endpoint = '/api/users/me/twitchSub'
  try {
    const response = await axios.get(config.get('API_HOST') + endpoint, {
      cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined,
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
    const response = await axios.post(config.get('API_HOST') + endpoint, {
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
    const response = await axios.get(config.get('API_HOST') + endpoint, {
      cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined,
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
    await axios.post(config.get('API_HOST') + endpoint)
  } catch (err) {
    if (err.response.status !== 404) {
      throw new Error(
        `${endpoint} responded with ${err.response.status}: ${JSON.stringify(err.response.data)}`
      )
    }
  }
}

export async function createCustomer(email) {
  const response = await fetch(`${config.get('API_HOST')}/api/payments/createCustomer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  })
  if (response.status === 200) return await response.text()
  else
    throw new Error(
      `/api/payments/createCustomer responded with ${response.status}: ${await response.text()}`
    )
}

export async function createSubscription() {
  const response = await fetch(`${config.get('API_HOST')}/api/payments/createSubscription`, {
    method: 'POST',
  })
  if (response.status === 200) return response.json()
  else
    throw new Error(
      `/api/payments/createSubscription responded with ${response.status}: ${await response.text()}`
    )
}

export async function getSubscription(cancelCallback = undefined) {
  try {
    const response = await axios.get(`${config.get('API_HOST')}/api/payments/stripeSubscription`, {
      cancelToken: cancelCallback ? new axios.CancelToken(cancelCallback) : undefined,
    })
    return response.data
  } catch (err) {
    if (err.toString() === 'Cancel') {
      return
    }
    if (err.response?.status === 404) {
      return null
    } else {
      console.error(
        `/api/payments/createSubscription responded with ${err.response?.status}: ${err.response?.data}`
      )
      return null
    }
  }
}

export async function cancelSubscription() {
  const endpoint = '/api/payments/cancelSubscription'
  try {
    const response = await axios.post(config.get('API_HOST') + endpoint)
    return response.data
  } catch (err) {
    throw new Error(`${endpoint} responded with ${err.response.status}: ${err.response.data}`)
  }
}

export async function unlinkTwitchAccount() {
  const response = await fetch(`${config.get('API_HOST')}/api/users/me/unlinkTwitch`, {
    method: 'POST',
  })
  if (response.status === 200) return await response.text()
  else
    throw new Error(
      `/api/users/me/unlinkTwitch responded with ${response.status}: ${await response.text()}`
    )
}

export async function getInstallerURL(platform = undefined) {
  const response = await axios.get('/api/installerURL', {
    params: { platform },
  })
  return response.data
}

export async function postComment(collectionId, message) {
  const response = await fetch(
    `${config.get('API_HOST')}/api/collections/${collectionId}/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
      }),
    }
  )
  if (response.status === 200) return await response.text()
  else
    throw new Error(
      `POST /api/collections/${collectionId}/comments responded with ${response.status
      }: ${await response.text()}`
    )
}

export async function likeComment(collectionId, commentId, remove = false) {
  const response = await fetch(
    `${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}/like`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        remove: remove,
      }),
    }
  )
  if (response.status === 200) return await response.text()
  else
    throw new Error(
      `POST /api/collections/${collectionId}/comments/${commentId}/like responded with ${response.status
      }: ${await response.text()}`
    )
}

export async function deleteComment(collectionId, commentId) {
  const response = await fetch(
    `${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}`,
    {
      method: 'DELETE',
    }
  )
  if (response.status === 200) return await response.text()
  else
    throw new Error(
      `DELETE /api/collections/${collectionId}/comments/${commentId} responded with ${response.status
      }: ${await response.text()}`
    )
}

export async function reportComment(collectionId, commentId) {
  const response = await fetch(
    `${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}/report`,
    {
      method: 'POST',
    }
  )
  if (response.status === 200) return await response.text()
  else
    throw new Error(
      `POST /api/collections/${collectionId}/comments/${commentId}/report responded with ${response.status
      }: ${await response.text()}`
    )
}

export async function logout() {
  const route = '/api/logout'
  try {
    await axios.post(config.get('API_HOST') + route)
  } catch (error) {
    console.error(`${route} responded with ${error.response.status}: ${error.response.data}`)
  }
}

// eslint-disable-next-line no-unused-vars
const createTournamentDto = {
  name: 'Mahloola Regional Cup 3',
  link: 'https://osu.ppy.sh/community/forums/topics/1420782?n=1',
  description: 'Canadian tournament hosted by Mahloola',
  organizers: [8759374, 6701656, 3388082],
  banner:
    'https://i.ppy.sh/703bd12f5dda80a76ace24e467f03adcba1e1697/68747470733a2f2f63646e2e646973636f72646170702e636f6d2f6174746163686d656e74732f3536343634353437353037373139333736392f3838373739313031383036343337353836392f6d61696e62616e6e65722e706e67',
  rounds: [
    {
      round: 'qualifiers',
      mods: [
        {
          mod: 'NM',
          maps: [3264035, 2613136, 3144020, 2823535],
        },
        {
          mod: 'HR',
          maps: [3180981, 2871777],
        },
        {
          mod: 'DT',
          maps: [563370, 1814067],
        },
        {
          mod: 'FM',
          maps: [3154009, 896689],
        },
      ],
    },
    {
      round: 'round of 24',
      mods: [
        {
          mod: 'NM',
          maps: [1010809, 3107770, 3291091, 2123415, 3258081],
        },
        {
          mod: 'HR',
          maps: [2570326, 2489781],
        },
        {
          mod: 'DT',
          maps: [1692419, 2766955],
        },
        {
          mod: 'FM',
          maps: [1882588, 3081353],
        },
        {
          mod: 'TB',
          maps: [1332071],
        },
      ],
    },
    {
      round: 'round of 16',
      mods: [
        {
          mod: 'NM',
          maps: [3232580, 3313230, 2687032, 2680792, 3117956],
        },
        {
          mod: 'HR',
          maps: [3313250, 2138306, 2626718],
        },
        {
          mod: 'DT',
          maps: [3313223, 2694599, 3167236],
        },
        {
          mod: 'FM',
          maps: [3114483, 2796779, 2524652],
        },
        {
          mod: 'TB',
          maps: [1188847],
        },
      ],
    },
    {
      round: 'quarterfinals',
      mods: [
        {
          mod: 'NM',
          maps: [3325009, 3046849, 2581265, 3325906, 3325902, 2659351],
        },
        {
          mod: 'HR',
          maps: [776522, 1994939, 2603689, 3325882],
        },
        {
          mod: 'DT',
          maps: [2272242, 3181150, 3057427, 991229],
        },
        {
          mod: 'FM',
          maps: [3168036, 1555562, 2548006, 3322862],
        },
        {
          mod: 'TB',
          maps: [1231420],
        },
      ],
    },
    {
      round: 'semifinals',
      mods: [
        {
          mod: 'NM',
          maps: [1744742, 3336990, 1419975, 3193011, 3218308, 3227979],
        },
        {
          mod: 'HR',
          maps: [1864007, 2020374, 3259779, 1519914],
        },
        {
          mod: 'DT',
          maps: [966335, 1528970, 2753035, 1802518],
        },
        {
          mod: 'FM',
          maps: [2958967, 3168758, 3227595, 1970032],
        },
        {
          mod: 'TB',
          maps: [1910547],
        },
      ],
    },
    {
      round: 'finals',
      mods: [
        {
          mod: 'NM',
          maps: [3348479, 3348280, 2633685, 1576337, 3213279, 3323488, 1532151],
        },
        {
          mod: 'HR',
          maps: [2798816, 2415770, 1191349, 2271666],
        },
        {
          mod: 'DT',
          maps: [2275555, 3348362, 3191336, 2522615],
        },
        {
          mod: 'FM',
          maps: [3346796, 3284140, 3340629, 2549390],
        },
        {
          mod: 'TB',
          maps: [1378892],
        },
      ],
    },
    {
      round: 'grand finals',
      mods: [
        {
          mod: 'NM',
          maps: [3358433, 3359658, 3227488, 3359700, 3359671, 2955142, 3070802],
        },
        {
          mod: 'HR',
          maps: [1464221, 2791200, 2659353, 3120003],
        },
        {
          mod: 'DT',
          maps: [3359697, 2255707, 2594991, 2993045],
        },
        {
          mod: 'FM',
          maps: [3358461, 3359698, 1419149, 3359695],
        },
        {
          mod: 'TB',
          maps: [3287767],
        },
      ],
    },
  ],
}

export async function createTournament(createTournamentDto) {
  const route = '/api/tournaments'
  const res = await axios.post(config.get('API_HOST') + route, createTournamentDto)
  if (res.status !== 200) {
    throw new Error(`${route} responded with ${res.status}: ${res.data}`)
  }
  return res.data
}

export async function editTournament(id, createTournamentDto) {
  const route = `/api/tournaments/${id}`
  const res = await axios.patch(config.get('API_HOST') + route, createTournamentDto)
  if (res.status !== 200) {
    throw new Error(`${route} responded with ${res.status}: ${res.data}`)
  }
  return res.data
}

export async function getRecentTournaments(
  cursor = undefined,
  perPage = undefined,
  cancelCallback = undefined
) {
  return getRequestWithQueryParameters(
    '/api/tournaments/recent',
    {
      cursor,
      perPage,
    },
    cancelCallback
  )
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

export async function getTournament(id, cancelCallback = undefined) {
  return getRequestWithQueryParameters(`/api/tournaments/${id}`, {}, cancelCallback)
}

export async function deleteTournament(id) {
  const response = await fetch(`${config.get('API_HOST')}/api/tournaments/${id}`, {
    method: 'DELETE',
  })
  if (response.status === 200) {
    console.log('tournament successfully deleted')
    return true
  } else {
    console.log(response)
    console.log(await response.text())
    return false
  }
}
