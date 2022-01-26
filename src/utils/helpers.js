function addFavouritedByUserAttribute(collections, user) {
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

function changeCollectionFavouritedStatus(collections, collectionId, favourited) {
  const changedCollection = collections.find(collection => collection.id === collectionId)
  if (changedCollection) {
    const _collections = [...collections]
    changedCollection.favouritedByUser = favourited
    changedCollection.favourites += favourited ? 1 : -1
    return _collections
  } else {
    return collections
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export {
  addFavouritedByUserAttribute,
  changeCollectionFavouritedStatus,
  validateEmail
}