import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Button, Container } from '../bootstrap-osu-collector'
import { getPopularCollections, usePopularCollections } from '../../utils/api'
import { useQuery } from '../../utils/hooks'
import CollectionList from '../common/CollectionList'
import { addFavouritedByUserAttribute } from 'utils/misc'

const dateRanges = [
  { range: 'today', label: 'today' },
  { range: 'week', label: 'this week' },
  { range: 'month', label: 'this month' },
  { range: 'year', label: 'this year' },
  { range: 'alltime', label: 'all time' },
]

function Popular({ user, setUser }) {
  const query = useQuery()
  const [range, setRange] = useState(query.get('range') || 'alltime')
  // const [collectionPage, setCollectionPage] = useState(null)
  // const [collections, setCollections] = useState(new Array(18).fill(null))
  const history = useHistory()

  const {
    popularCollections: _popularCollections,
    popularCollectionsError,
    isValidating: popularIsValidating,
    currentPage,
    setCurrentPage,
    hasMore,
  } = usePopularCollections({ range, perPage: 18 })
  const [popularCollections, setPopularCollections] = useState([])
  useEffect(() => setPopularCollections(_popularCollections), [_popularCollections])

  // useEffect(() => {
  //   const queryParamRange = query.get('range')
  //   setRange(queryParamRange || 'alltime')
  // }, [])

  useEffect(() => {
    if (!range) {
      return
    }
    // let cancel
    // getPopularCollections(range, undefined, 18, (c) => (cancel = c))
    //   .then((_collectionPage) => {
    //     setCollectionPage(_collectionPage)
    //     addFavouritedByUserAttribute(_collectionPage.collections, user)
    //     setCollections(_collectionPage.collections)
    //   })
    //   .catch(console.error)
    // return cancel
  }, [range])

  const loadMore = () => setCurrentPage(currentPage + 1)
  // const loadMore = async () => {
  //   try {
  //     const _collectionPage = await getPopularCollections(range, collectionPage.nextPageCursor, 18)
  //     setCollectionPage(_collectionPage)
  //     addFavouritedByUserAttribute(_collectionPage.collections, user)
  //     setCollections([...collections, ..._collectionPage.collections])
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  return (
    <Container className='pt-4'>
      <Card className='shadow-lg'>
        <Card.Body>
          <div className='d-flex justify-content-left align-items-center p-2 pb-0'>
            <h2 className='mt-2 ml-2 mr-5'>
              <i className='fas fa-fire mr-3' style={{ color: 'orange' }} />
              Popular Collections
            </h2>
            <div>
              {dateRanges.map((opt, i) => (
                <Button
                  key={i}
                  className='mx-1'
                  disabled={range === opt.range}
                  onClick={() => {
                    // setCollectionPage(null)
                    // setCollections(new Array(18).fill(null))
                    history.push(`/popular?range=${opt.range}`)
                    setRange(opt.range)
                    setCurrentPage(1)
                  }}
                  variant={range === opt.range ? 'danger' : 'outline-secondary'}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          <CollectionList
            collections={popularCollections}
            setCollections={setPopularCollections}
            hasMore={hasMore}
            loadMore={loadMore}
            user={user}
            setUser={setUser}
          />
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Popular
