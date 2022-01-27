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
export async function getRecentCollections(cursor = undefined, perPage = undefined, cancelCallback = undefined) {
    return getRequestWithQueryParameters('/api/collections/recent', {
        cursor,
        perPage
    }, cancelCallback)
}

// range: 'today' or 'week' or 'month' or 'year' or 'alltime'
// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
export async function getPopularCollections(range = 'today', cursor = undefined, perPage = undefined, cancelCallback = undefined) {
    return getRequestWithQueryParameters('/api/collections/popularv2', {
        range,
        cursor,
        perPage
    }, cancelCallback)
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollections-200-schema
export async function searchCollections(queryString, cursor, perPage = undefined, sortBy = undefined, orderBy = undefined, cancelCallback = undefined) {
    return getRequestWithQueryParameters('/api/collections/search', {
        search: queryString,
        cursor,
        perPage,
        sortBy,
        orderBy
    }, cancelCallback)
}

// Returns CollectionData object: https://osucollector.com/docs.html#responses-getCollectionById-200-schema
export async function getCollection(id, cancelCallback = undefined) {
    return getRequestWithQueryParameters(`/api/collections/${id}`, {}, cancelCallback)
}

// Returns PaginatedCollectionData object: https://osucollector.com/docs.html#responses-getCollectionBeatmaps-200-schema
export async function getCollectionBeatmaps(id, cursor = undefined, perPage = undefined, sortBy = undefined, orderBy = undefined, filterMin = undefined, filterMax = undefined, cancelCallback = undefined) {
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
export async function uploadCollections(collections) {
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
export async function favouriteCollection(collectionId) {
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
export async function unfavouriteCollection(collectionId) {
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

export async function editCollectionDescription(collectionId, description) {
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

export async function renameCollection(collectionId, name) {
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

export async function deleteCollection(collectionId) {
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

export async function downloadCollectionDb(collectionId) {
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
export async function getUsers(page, perPage = undefined, cancelCallback = undefined) {
    return getRequestWithQueryParameters('/api/users', {
        page,
        perPage
    }, cancelCallback)
}

// Returns User object or null if 404: TODO: add link to docs
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

// Returns an array of CollectionData objects: TODO: add link to docs
export async function getUserUploads(userId, cancelCallback = undefined) {
    return getRequestWithQueryParameters(`/api/users/${userId}/uploads`, {}, cancelCallback)
}

export async function getMetadata(cancelCallback = undefined) {
    return getRequestWithQueryParameters(`/api/metadata`, {}, cancelCallback)
}

export async function submitOtp(otp, y) {
    return await fetch(`${config.get('API_HOST')}/api/authentication/otp?otp=${otp}&y=${y}`, {
        method: 'POST',
    })
}

export async function getTwitchSubStatus(cancelCallback = undefined) {
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

export async function linkPaypalSubscription(subscriptionId) {
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

export async function getPaypalSubscription(cancelCallback = undefined) {
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

export async function cancelPaypalSubscription() {
    const endpoint = '/api/payments/paypalSubscription/cancel'
    try {
        await axios.post(config.get('API_HOST') + endpoint)
    } catch (err) {
        if (err.response.status !== 404) {
            throw new Error(`${endpoint} responded with ${err.response.status}: ${JSON.stringify(err.response.data)}`)
        }
    }
}

export async function createCustomer(email) {
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

export async function createSubscription() {
    const response = await fetch(`${config.get('API_HOST')}/api/payments/createSubscription`, {
        method: 'POST'
    })
    if (response.status === 200)
        return response.json()
    else
        throw new Error(`/api/payments/createSubscription responded with ${response.status}: ${await response.text()}`)
}

export async function getSubscription(cancelCallback = undefined) {
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
        method: 'POST'
    })
    if (response.status === 200)
        return await response.text()
    else
        throw new Error(`/api/users/me/unlinkTwitch responded with ${response.status}: ${await response.text()}`)
}

export async function getInstallerURL(platform = undefined) {
    const response = await axios.get('/api/installerURL', {
        params: { platform }
    })
    return response.data
}

export async function postComment(collectionId, message) {
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

export async function likeComment(collectionId, commentId, remove = false) {
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

export async function deleteComment(collectionId, commentId) {
    const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}`, {
        method: 'DELETE'
    })
    if (response.status === 200)
        return await response.text()
    else
        throw new Error(`DELETE /api/collections/${collectionId}/comments/${commentId} responded with ${response.status}: ${await response.text()}`)
}

export async function reportComment(collectionId, commentId) {
    const response = await fetch(`${config.get('API_HOST')}/api/collections/${collectionId}/comments/${commentId}/report`, {
        method: 'POST'
    })
    if (response.status === 200)
        return await response.text()
    else
        throw new Error(`POST /api/collections/${collectionId}/comments/${commentId}/report responded with ${response.status}: ${await response.text()}`)
}

const tournament = {
    id: 1,
    name: 'Mahloola Regional Cup 3',
    description: 'https://osu.ppy.sh/community/forums/topics/1420782?n=1',
    dateUploaded: {
        _seconds: Date.now() / 1000
    },
    dateModified: {
        _seconds: Date.now() / 1000
    },
    uploader: {
        avatarURL: 'https://a.ppy.sh/3898396?1627092983.jpeg',
        id: 3898396,
        username: 'Eddie-'
    },
    banner: 'https://assets.ppy.sh/beatmaps/1034823/covers/card@2x.jpg?1622170037',
    mappool: [
        {
            round: 'qualifiers',
            maps: [
                {
                    mod: 'NM',
                    maps: [
                        { id: 3264035 },
                        { id: 2613136 },
                        { id: 3144020 },
                        { id: 2823535 },
                    ]
                },
                {
                    mod: 'HR',
                    maps: [
                        { id: 3180981 },
                        { id: 2871777 },
                    ]
                },
                {
                    mod: 'DT',
                    maps: [
                        { id: 563370 },
                        { id: 1814067 },
                    ]
                },
                {
                    mod: 'FM',
                    maps: [
                        { id: 3154009 },
                        { id: 896689 },
                    ]
                },
            ]
        },
        {
            round: 'round of 24',
            maps: [
                {
                    mod: 'NM',
                    maps: [
                        { id: 1010809 },
                        { id: 3107770 },
                        { id: 3291091 },
                        { id: 2123415 },
                        { id: 3258081 },
                    ]
                },
                {
                    mod: 'HR',
                    maps: [
                        { id: 2570326 },
                        { id: 2489781 },
                    ]
                },
                {
                    mod: 'DT',
                    maps: [
                        { id: 1692419 },
                        { id: 2766955 },
                    ]
                },
                {
                    mod: 'FM',
                    maps: [
                        { id: 1882588 },
                        { id: 3081353 },
                    ]
                },
                {
                    mod: 'TB',
                    maps: [
                        { id: 1332071 },
                    ]
                },
            ]
        },
        {
            round: 'round of 16',
            maps: [
                {
                    mod: 'NM',
                    maps: [
                        { id: 3232580 },
                        { id: 3313230 },
                        { id: 2687032 },
                        { id: 2680792 },
                        { id: 3117956 },
                    ]
                },
                {
                    mod: 'HR',
                    maps: [
                        { id: 3313250 },
                        { id: 2138306 },
                        { id: 2626718 },
                    ]
                },
                {
                    mod: 'DT',
                    maps: [
                        { id: 3313223 },
                        { id: 2694599 },
                        { id: 3167236 },
                    ]
                },
                {
                    mod: 'FM',
                    maps: [
                        { id: 3114483 },
                        { id: 2796779 },
                        { id: 2524652 },
                    ]
                },
                {
                    mod: 'TB',
                    maps: [
                        { id: 1188847 },
                    ]
                }
            ]
        },
        {
            round: 'quarterfinals',
            maps: [
                {
                    mod: 'NM',
                    maps: [
                        { id: 3325009 },
                        { id: 3046849 },
                        { id: 2581265 },
                        { id: 3325906 },
                        { id: 3325902 },
                        { id: 2659351 },
                    ]
                },
                {
                    mod: 'HR',
                    maps: [
                        { id: 776522 },
                        { id: 1994939 },
                        { id: 2603689 },
                        { id: 3325882 },
                    ]
                },
                {
                    mod: 'DT',
                    maps: [
                        { id: 2272242 },
                        { id: 3181150 },
                        { id: 3057427 },
                        { id: 991229 },
                    ]
                },
                {
                    mod: 'FM',
                    maps: [
                        { id: 3168036 },
                        { id: 1555562 },
                        { id: 2548006 },
                        { id: 3322862 },
                    ]
                },
                {
                    mod: 'TB',
                    maps: [
                        { id: 1231420 },
                    ]
                }
            ]
        },
        {
            round: 'semifinals',
            maps: [
                {
                    mod: 'NM',
                    maps: [
                        { id: 1744742 },
                        { id: 3336990 },
                        { id: 1419975 },
                        { id: 3193011 },
                        { id: 3218308 },
                        { id: 3227979 },
                    ]
                },
                {
                    mod: 'HR',
                    maps: [
                        { id: 1864007 },
                        { id: 2020374 },
                        { id: 3259779 },
                        { id: 1519914 },
                    ]
                },
                {
                    mod: 'DT',
                    maps: [
                        { id: 966335 },
                        { id: 1528970 },
                        { id: 2753035 },
                        { id: 1802518 },
                    ]
                },
                {
                    mod: 'FM',
                    maps: [
                        { id: 2958967 },
                        { id: 3168758 },
                        { id: 3227595 },
                        { id: 1970032 },
                    ]
                },
                 {
                    mod: 'TB',
                    maps: [
                        { id: 1910547 },
                    ]
                }
            ]
        },
        {
            round: 'finals',
            maps: [
                {
                    mod: 'NM',
                    maps: [
                        { id: 3348479 },
                        { id: 3348280 },
                        { id: 2633685 },
                        { id: 1576337 },
                        { id: 3213279 },
                        { id: 3323488 },
                        { id: 1532151 },
                    ]
                },
                {
                    mod: 'HR',
                    maps: [
                        { id: 2798816 },
                        { id: 2415770 },
                        { id: 1191349 },
                        { id: 2271666 },
                    ]
                },
                {
                    mod: 'DT',
                    maps: [
                        { id: 2275555 },
                        { id: 3348362 },
                        { id: 3191336 },
                        { id: 2522615 },
                    ]
                },
                {
                    mod: 'FM',
                    maps: [
                        { id: 3346796 },
                        { id: 3284140 },
                        { id: 3340629 },
                        { id: 2549390 },
                    ]
                },
                 {
                    mod: 'TB',
                    maps: [
                        { id: 1378892 },
                    ]
                }
            ]
        },
        {
            round: 'grand finals',
            maps: [
                {
                    mod: 'NM',
                    maps: [
                        { id: 3358433 },
                        { id: 3359658 },
                        { id: 3227488 },
                        { id: 3359700 },
                        { id: 3359671 },
                        { id: 2955142 },
                        { id: 3070802 },
                    ]
                },
                {
                    mod: 'HR',
                    maps: [
                        { id: 1464221 },
                        { id: 2791200 },
                        { id: 2659353 },
                        { id: 3120003 },
                    ]
                },
                {
                    mod: 'DT',
                    maps: [
                        { id: 3359697 },
                        { id: 2255707 },
                        { id: 2594991 },
                        { id: 2993045 },
                    ]
                },
                {
                    mod: 'FM',
                    maps: [
                        { id: 3358461 },
                        { id: 3359698 },
                        { id: 1419149 },
                        { id: 3359695 },
                    ]
                },
                {
                    mod: 'TB',
                    maps: [
                        { id: 3287767 },
                    ]
                }
            ]
        }
    ]
}

// eslint-disable-next-line no-unused-vars
export async function getTournaments(cancelCallback = undefined) {
    const noMappool = { ...tournament }
    delete noMappool.mappool
    return {
        nextPageCursor: null,
        hasMore: false,
        tournaments: [noMappool]
    }
    // return getRequestWithQueryParameters('/api/tournaments', {}, cancelCallback)
}

// eslint-disable-next-line no-unused-vars
export async function getTournament(id, cancelCallback = undefined) {
    return tournament
    // return getRequestWithQueryParameters(`/api/tournaments/${id}`, {}, cancelCallback)
}

export async function deleteTournament(id) {
    const response = await fetch(`${config.get('API_HOST')}/api/tournemants/${id}`, {
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
