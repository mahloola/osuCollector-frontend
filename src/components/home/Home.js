import { useEffect, useState } from 'react'
import { Card, Col, Container, ReactPlaceholder, Row } from '../bootstrap-osu-collector'
import {
  useMetadata,
  getPopularCollections,
  favouriteCollection,
  unfavouriteCollection,
  useRecentCollections,
  usePopularCollections,
} from '../../utils/api'
import './Home.css'
import 'react-placeholder/lib/reactPlaceholder.css'
import CollectionCard from '../common/CollectionCard'
import { LinkContainer } from 'react-router-bootstrap'
import { Alert } from 'react-bootstrap'
import { addFavouritedByUserAttribute, changeCollectionFavouritedStatus } from 'utils/misc'
import { Discord } from 'react-bootstrap-icons'
import { openInBrowser } from '../../utils/misc'

function Home({ user, setUser }) {
  const { data: metadata, loading: metadataLoading } = useMetadata()

  const {
    popularCollections: _popularCollections,
    popularCollectionsError,
    isValidating: popularIsValidating,
  } = usePopularCollections({ range: 'week', perPage: 9 })
  const [popularCollections, setPopularCollections] = useState([])
  useEffect(() => setPopularCollections(_popularCollections), [_popularCollections])

  const {
    recentCollections: _recentCollections,
    recentCollectionsError,
    isValidating: recentIsValidating,
  } = useRecentCollections({ perPage: 9 })
  const [recentCollections, setRecentCollections] = useState([])
  useEffect(() => setRecentCollections(_recentCollections), [_recentCollections])

  const favouriteButtonClicked = (collectionId, favourited) => {
    if (!user) return
    setUser((user) => ({
      ...user,
      favourites: favourited ? [...user.favourites, collectionId] : user.favourites.filter((id) => id !== collectionId),
    }))
    setRecentCollections((recent) => changeCollectionFavouritedStatus(recent, collectionId, favourited))
    setPopularCollections((popular) => changeCollectionFavouritedStatus(popular, collectionId, favourited))
    if (favourited) {
      favouriteCollection(collectionId)
    } else {
      unfavouriteCollection(collectionId)
    }
  }

  return (
    <Container className='pt-4 pb-4'>
      <Row>
        <Alert variant='info' className='text-center'>
          {/* @ts-ignore */}
          <Discord className='mr-2' size={26} />
          Join the{' '}
          <a href='#' onClick={() => openInBrowser('https://discord.gg/WZMQjwF5Vr')}>
            osu!Collector discord
          </a>
          ! Feel free to message FunOrange about any issues you have or suggestions for the site.
        </Alert>
        <Col className='px-5 my-2' md={12} lg={9}>
          <h2>Welcome to osu!Collector!</h2>
          <p>
            This is a place where you can view beatmap collections uploaded by other players. It is mainly developed by{' '}
            <a onClick={() => openInBrowser('https://twitter.com/funorange42')}>FunOrange</a> and{' '}
            <a onClick={() => openInBrowser('https://twitter.com/mahloola')}>Mahloola</a>.
          </p>
        </Col>
        <Col md={12} lg={3} className='mb-3'>
          <Card>
            <Card.Header>Statistics</Card.Header>
            <Card.Body>
              <Row>
                <Col xs={7}>Users</Col>
                <Col xs={5}>
                  <ReactPlaceholder className='my-1' ready={!metadataLoading} showLoadingAnimation type='textRow'>
                    <b>{metadata?.userCount}</b>
                  </ReactPlaceholder>
                </Col>
              </Row>
              <Row>
                <Col xs={7}>Collections</Col>
                <Col xs={5}>
                  <ReactPlaceholder className='my-1' ready={!metadataLoading} showLoadingAnimation type='textRow'>
                    <b>{metadata?.totalCollections}</b>
                  </ReactPlaceholder>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className='mb-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center mb-0'>
            <div className='d-flex justify-content-start'>
              <h2 className='my-2 ml-2'>
                <i className='fas fa-fire mr-3' style={{ color: 'orange' }}></i>
                Popular this week
              </h2>
            </div>
          </div>
          <Container className='p-2'>
            <Row>
              {popularCollectionsError ? (
                <div style={{ color: 'red', marginLeft: 8 }}>There was an error retrieving collections.</div>
              ) : (
                <Container className='p-2'>
                  <Row>
                    {(popularIsValidating ? new Array(6).fill(null) : popularCollections).map((collection, i) => (
                      <Col lg={6} xl={4} className='p-0 my-3' key={i}>
                        <ReactPlaceholder
                          ready={collection}
                          showLoadingAnimation
                          type='rect'
                          className='mx-auto'
                          style={{ width: '90%', height: '235px' }}
                        >
                          <CollectionCard
                            user={user}
                            collection={collection}
                            favouriteButtonClicked={(collectionId, favourited) =>
                              favouriteButtonClicked(collectionId, favourited)
                            }
                          />
                        </ReactPlaceholder>
                      </Col>
                    ))}
                  </Row>
                  <LinkContainer to='/popular?range=week'>
                    <Card $lightbg className='shadow-sm mt-1 mx-1 p-3 collection-card-clickable text-center'>
                      <h5 className='mb-0'> See all </h5>
                    </Card>
                  </LinkContainer>
                </Container>
              )}
            </Row>
          </Container>
        </Card.Body>
      </Card>

      <Card className='my-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center mb-0'>
            <div className='d-flex justify-content-start'>
              <h2 className='my-2 ml-2'>Recently Uploaded</h2>
            </div>
          </div>
          {recentCollectionsError ? (
            <Alert variant='danger'>
              <p>Sorry, there was an error retrieving collections. Please try refreshing the page. Error details:</p>
              <p>{recentCollectionsError.toString()}</p>
            </Alert>
          ) : (
            <Container className='p-2'>
              <Row>
                {(recentIsValidating ? new Array(9).fill(null) : recentCollections).map((collection, i) => (
                  <Col lg={6} xl={4} className='p-0 my-3' key={i}>
                    <ReactPlaceholder
                      ready={collection}
                      showLoadingAnimation
                      type='rect'
                      className='mx-auto'
                      style={{ width: '90%', height: '235px' }}
                    >
                      <CollectionCard
                        user={user}
                        collection={collection}
                        favouriteButtonClicked={(collectionId, favourited) =>
                          favouriteButtonClicked(collectionId, favourited)
                        }
                      />
                    </ReactPlaceholder>
                  </Col>
                ))}
              </Row>
              <LinkContainer to='/recent'>
                <Card $lightbg className='shadow-sm mt-1 mx-1 p-3 collection-card-clickable text-center'>
                  <h5 className='mb-0'> See all </h5>
                </Card>
              </LinkContainer>
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Home
