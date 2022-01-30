import { useState, useEffect } from 'react'
import { Card, Alert, Container } from '../bootstrap-osu-collector'
import { getRecentCollections } from '../../utils/api'
import CollectionList from '../common/CollectionList'
import { addFavouritedByUserAttribute } from 'utils/misc'

function Recent({ user, setUser }) {
  const [collectionPage, setCollectionPage] = useState(null)
  const [collections, setCollections] = useState(new Array(18).fill(null))
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancel
    getRecentCollections(undefined, 18, (c) => (cancel = c))
      .then((_collectionPage) => {
        setCollectionPage(_collectionPage)
        addFavouritedByUserAttribute(_collectionPage.collections, user)
        setCollections(_collectionPage.collections)
      })
      .catch(setError)
    return cancel
  }, [])

  const loadMore = async () => {
    try {
      const _collectionPage = await getRecentCollections(collectionPage.nextPageCursor, 18)
      setCollectionPage(_collectionPage)
      addFavouritedByUserAttribute(_collectionPage.collections, user)
      setCollections([...collections, ..._collectionPage.collections])
    } catch (err) {
      setError(err)
    }
  }

  return (
    <Container className='pt-4'>
      <Card className='shadow-lg'>
        <Card.Body>
          <h2 className='my-2 ml-3'>Recent Collections</h2>
          {error ? (
            <Alert variant='danger'>
              <p>Sorry, an error occurred with the server. Please try refreshing the page. Error details:</p>
              <p>{error.toString()}</p>
            </Alert>
          ) : (
            <CollectionList
              collections={collections}
              setCollections={setCollections}
              hasMore={collectionPage?.hasMore}
              loadMore={loadMore}
              user={user}
              setUser={setUser}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Recent
