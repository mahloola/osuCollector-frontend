import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Button, Container, Alert } from '../bootstrap-osu-collector'
import { usePopularCollections } from '../../utils/api'
import { useQuery } from '../../utils/hooks'
import CollectionList from '../common/CollectionList'

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

  const loadMore = () => setCurrentPage(currentPage + 1)

  return (
    <Container className="pt-4">
      <Card className="shadow-lg">
        <Card.Body>
          <div className="d-flex justify-content-left align-items-center p-2 pb-0">
            <h2 className="mt-2 ml-2 mr-5">
              <i className="fas fa-fire mr-3" style={{ color: 'orange' }} />
              Popular Collections
            </h2>
            <div>
              {dateRanges.map((opt, i) => (
                <Button
                  key={i}
                  className="mx-1"
                  disabled={range === opt.range}
                  onClick={() => {
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
          {popularCollectionsError ? (
            <Alert variant="danger">
              <p>
                Sorry, there was an error retrieving collections. Please try refreshing the page.
                Error details:
              </p>
              <p>{popularCollectionsError.toString()}</p>
            </Alert>
          ) : (
            <CollectionList
              collections={
                popularIsValidating && popularCollections.length === 0
                  ? new Array(18).fill(null)
                  : popularCollections
              }
              setCollections={setPopularCollections}
              hasMore={hasMore}
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

export default Popular
