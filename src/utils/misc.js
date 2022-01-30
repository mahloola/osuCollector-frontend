export function truncate(inputString, length) {
  return inputString.length > length ? inputString.substring(0, length) + '...' : inputString
}

export function secondsToHHMMSS (sec_num) {
  let hours = Math.floor(sec_num / 3600)
  let minutes = Math.floor((sec_num - hours * 3600) / 60)
  let seconds = sec_num - hours * 3600 - minutes * 60

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
  hours = Math.round(hours)
  minutes = Math.round(minutes)
  seconds = Math.round(seconds)

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

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
