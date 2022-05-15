import axios from 'axios'
import useSWRImmutable from 'swr/immutable'
import { useMediaQuery } from 'react-responsive'

export function truncate(inputString, length) {
  return inputString.length > length ? inputString.substring(0, length) + '...' : inputString
}

export function secondsToHHMMSS(sec_num) {
  const sec = Math.round(sec_num)
  let hours = Math.floor(sec / 3600)
  let minutes = Math.floor((sec - hours * 3600) / 60)
  let seconds = sec - hours * 3600 - minutes * 60

  if (hours < 10) {
    // @ts-ignore
    hours = '0' + hours
  }
  if (minutes < 10 && hours > 0) {
    // @ts-ignore
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    // @ts-ignore
    seconds = '0' + seconds
  }

  return hours > 0 ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

export function bpmToColor(bpm, darkMode) {
  const _bpm = clamp(Math.floor(bpm / 10) * 10, 150, 300)
  if (_bpm === 150) return '#93e2ff'
  if (_bpm === 160) return '#80dbff'
  if (_bpm === 170) return '#6bd3fe'
  if (_bpm === 180) return '#55cbff'
  if (_bpm === 190) return '#39c3ff'
  if (_bpm === 200) return '#00bbff'
  if (_bpm === 210) return '#00a8ea'
  if (_bpm === 220) return '#0095d6'
  if (_bpm === 230) return '#0082c2'
  if (_bpm === 240) return '#0070ae'
  if (_bpm === 250) return '#005f9b'
  if (_bpm === 260) return '#004e88'
  if (_bpm === 270) return '#003e76'
  if (_bpm === 280) return '#002e64'
  if (_bpm === 290) return '#002052'
  if (_bpm === 300) return darkMode ? '#fff' : '#000000'
  return '#000000'
}

export function starToColor(star, darkMode = false) {
  const _star = clamp(Math.floor(star), 1, 10)
  if (_star === 1) return '#6EFF79'
  if (_star === 2) return '#4FC0FF'
  if (_star === 3) return '#F8DA5E'
  if (_star === 4) return '#FF7F68'
  if (_star === 5) return '#FF4E6F'
  if (_star === 6) return '#A653B0'
  if (_star === 7) return '#3B38B2'
  if (_star === 8) return darkMode ? '#fff' : '#000000'
  if (_star === 9) return darkMode ? '#fff' : '#000000'
  if (_star === 10) return darkMode ? '#fff' : '#000000'
  return darkMode ? '#fff' : '#000000'
}

export function useFallbackImg(ev, fallbackImg) {
  if (ev.target.src === fallbackImg) {
    return
  }
  ev.target.err = null
  ev.target.src = fallbackImg
}

export function addFavouritedByUserAttribute(collections, user) {
  if (!user) return
  if (Array.isArray(collections)) {
    for (const collection of collections) {
      collection.favouritedByUser = Boolean(user.favourites && user.favourites.includes(collection.id))
    }
  } else {
    // case: single collection
    const collection = collections
    collection.favouritedByUser = Boolean(user.favourites && user.favourites.includes(collection.id))
  }
}

export function changeCollectionFavouritedStatus(collections, collectionId, favourited) {
  const changedCollection = collections.find((collection) => collection.id === collectionId)
  if (changedCollection) {
    const _collections = [...collections]
    changedCollection.favouritedByUser = favourited
    changedCollection.favourites += favourited ? 1 : -1
    return _collections
  } else {
    return collections
  }
}

export function parseMappool(text) {
  const lines = text
    .split('\n')
    .filter((line) => line.trim().length > 0) // filter blank lines
    .filter((line) => !/^#/.test(line)) // filter comments

  const sectionRegex = /^\s*\[(.+)\.(.+)\]\s*$/
  const urlRegex1 = /^https:\/\/osu\.ppy\.sh\/beatmapsets\/.+\/(\d+)/
  const urlRegex2 = /^https:\/\/osu\.ppy\.sh\/b\/(\d+)/
  const urlRegex3 = /^https:\/\/osu\.ppy\.sh\/beatmaps\/(\d+)/
  const beatmapIdRegex = /^(\d+)\s*$/

  const rounds = []
  let roundString = null
  let modString = null
  for (const line of lines) {
    const sectionMatch = line.match(sectionRegex)
    if (sectionMatch) {
      roundString = sectionMatch[1]
      modString = sectionMatch[2]
      continue
    }

    let beatmapId = null
    const urlMatch1 = line.match(urlRegex1)
    if (urlMatch1) {
      beatmapId = urlMatch1[1]
    }

    const urlMatch2 = line.match(urlRegex2)
    if (urlMatch2) {
      beatmapId = urlMatch2[1]
    }

    const urlMatch3 = line.match(urlRegex3)
    if (urlMatch3) {
      beatmapId = urlMatch3[1]
    }

    const beatmapIdMatch = line.match(beatmapIdRegex)
    if (beatmapIdMatch) {
      beatmapId = beatmapIdMatch[1]
    }

    if (beatmapId && roundString && modString) {
      // add round to mappool if it hasn't been added yet
      let roundIndex = rounds.findIndex((_round) => _round.round === roundString)
      if (roundIndex < 0) {
        roundIndex = rounds.length
        rounds.push({
          round: roundString,
          mods: [],
        })
      }

      // add round.mod to mappool if it hasn't been added yet
      const round = rounds[roundIndex]
      let modIndex = round.mods.findIndex((_mod) => _mod.mod === modString)
      if (modIndex < 0) {
        modIndex = round.mods.length
        round.mods.push({
          mod: modString,
          maps: [],
        })
      }

      // add beatmap to mappool
      // @ts-ignore
      rounds[roundIndex].mods[modIndex].maps.push(Number(beatmapId))
      continue
    }

    // line doesn't match any pattern
    return { rounds: null, error: `This line is invalid:\n\n${line}` }
  }
  return { rounds: rounds, error: null }
}

export function isEqual(arr1, arr2) {
  if (!arr1 || !arr2) return false
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

export function userOwnsTournament(user, tournament) {
  if (user?.id === tournament?.uploader.id) {
    return true
  }
  if (tournament.organizers.map((user) => user.id).includes(user.id)) {
    return true
  }
  return false
}

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

export const Breakpoints = {
  XS: ({ children }) => (useMediaQuery({ maxWidth: 576 }) ? children : null),

  SMDown: ({ children }) => (useMediaQuery({ maxWidth: 768 - 1 }) ? children : null),
  SM: ({ children }) => (useMediaQuery({ minWidth: 576, maxWidth: 768 - 1 }) ? children : null),
  SMUp: ({ children }) => (useMediaQuery({ minWidth: 576 }) ? children : null),

  MDDown: ({ children }) => (useMediaQuery({ maxWidth: 992 - 1 }) ? children : null),
  MD: ({ children }) => (useMediaQuery({ minWidth: 768, maxWidth: 992 - 1 }) ? children : null),
  MDUp: ({ children }) => (useMediaQuery({ minWidth: 768 }) ? children : null),

  LGDown: ({ children }) => (useMediaQuery({ maxWidth: 1200 - 1 }) ? children : null),
  LG: ({ children }) => (useMediaQuery({ minWidth: 992, maxWidth: 1200 - 1 }) ? children : null),
  LGUp: ({ children }) => (useMediaQuery({ minWidth: 992 }) ? children : null),

  XLDown: ({ children }) => (useMediaQuery({ maxWidth: 1400 - 1 }) ? children : null),
  XL: ({ children }) => (useMediaQuery({ minWidth: 1200, maxWidth: 1400 - 1 }) ? children : null),
  XLUp: ({ children }) => (useMediaQuery({ minWidth: 1200 }) ? children : null),

  XXL: ({ children }) => (useMediaQuery({ minWidth: 1400 }) ? children : null),
}

export function useCancellableSWRImmutable(key, swrOptions) {
  const source = axios.CancelToken.source()
  const { data, error } = useSWRImmutable(
    key,
    (url) => axios.get(url, { cancelToken: source.token }).then((res) => res.data),
    swrOptions
  )
  if (error) console.error(error)
  return { data, error, loading: !data, cancelToken: source }
}
