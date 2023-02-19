import { useState, useEffect } from 'react'
import { Card, Alert, Container } from '../bootstrap-osu-collector'
import { useRecentCollections } from '../../utils/api'
import CollectionList from '../common/CollectionList'
import Helmet from 'react-helmet'

function Recent({ user, setUser }) {
  const {
    recentCollections: _recentCollections,
    recentCollectionsError,
    isValidating: recentIsValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  } = useRecentCollections({ perPage: 18 })
  const [recentCollections, setRecentCollections] = useState([])
  useEffect(() => setRecentCollections(_recentCollections), [_recentCollections])

  const loadMore = () => setCurrentPage(currentPage + 1)

  return (
    <>
      <Helmet>
        <title>Recent osu! beatmap collections | osu!Collector</title>
      </Helmet>

      <Container className='pt-4'>
        <Card className='shadow-lg'>
          <Card.Body>
            <h1 className='my-2 ml-3'>Recent Collections</h1>
            {recentCollectionsError ? (
              <Alert variant='danger'>
                <p>Sorry, there was an error retrieving collections. Please try refreshing the page. Error details:</p>
                <p>{recentCollectionsError.toString()}</p>
              </Alert>
            ) : (
              <CollectionList
                collections={
                  recentIsValidating && recentCollections.length === 0 ? new Array(18).fill(null) : recentCollections
                }
                setCollections={setRecentCollections}
                hasMore={hasMore}
                loadMore={loadMore}
                user={user}
                setUser={setUser}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default Recent
