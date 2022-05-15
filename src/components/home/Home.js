import { useEffect, useState } from 'react'
import { Card, Col, Container, ReactPlaceholder, Row } from '../bootstrap-osu-collector'
import {
  useMetadata,
  getPopularCollections,
  getRecentCollections,
  favouriteCollection,
  unfavouriteCollection,
} from '../../utils/api'
import './Home.css'
import 'react-placeholder/lib/reactPlaceholder.css'
import CollectionCard from '../common/CollectionCard'
import { LinkContainer } from 'react-router-bootstrap'
import { Alert } from 'react-bootstrap'
import { addFavouritedByUserAttribute, changeCollectionFavouritedStatus } from 'utils/misc'
import { Discord } from 'react-bootstrap-icons'

function Home({ user, setUser }) {
  const { data: metadata, loading: metadataLoading } = useMetadata()
  const [popular, setPopular] = useState(new Array(6).fill(null))
  const [recent, setRecent] = useState(new Array(3).fill(null))

  useEffect(() => {
    let cancel2, cancel3
    getPopularCollections('week', 1, 6, (c) => (cancel2 = c))
      .then((paginatedCollectionData) => {
        addFavouritedByUserAttribute(paginatedCollectionData.collections, user)
        setPopular(paginatedCollectionData.collections)
      })
      .catch(console.log)
    getRecentCollections(1, 9, (c) => (cancel3 = c))
      .then((paginatedCollectionData) => {
        setRecent(paginatedCollectionData.collections)
      })
      .catch(console.log)
    return () => {
      if (cancel2) cancel2()
      if (cancel3) cancel3()
    }
  }, [])

  const likeButtonClicked = (collectionId, favourited) => {
    setUser({
      ...user,
      favourites: favourited ? [...user.favourites, collectionId] : user.favourites.filter((id) => id !== collectionId),
    })
    setRecent(changeCollectionFavouritedStatus(recent, collectionId, favourited))
    setPopular(changeCollectionFavouritedStatus(popular, collectionId, favourited))
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
          <Discord className='mr-2' size={26} />
          Join the <a href='https://discord.gg/WZMQjwF5Vr'>osu!Collector discord</a>! Feel free to message FunOrange
          about any issues you have or suggestions for the site.
        </Alert>
        <Col className='px-5 my-2' md={12} lg={9}>
          <h2>Welcome to osu!Collector!</h2>
          <p>
            This is a place where you can view beatmap collections uploaded by other players. It is mainly developed by{' '}
            <a href='https://twitter.com/funorange42'>FunOrange</a> and{' '}
            <a href='https://twitter.com/mahloola'>mahloola</a>.
            {
              /* {process.env.NODE_ENV !== 'production' && */
              <>
                &nbsp;If you like the project, consider supporting us to get access to{' '}
                <LinkContainer to='/client'>
                  <a>extra features</a>
                </LinkContainer>
                .
              </>
            }
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
              {popular?.map((collection, i) => (
                <Col lg={6} xl={4} className='p-0 my-3' key={i}>
                  <ReactPlaceholder
                    ready={collection}
                    showLoadingAnimation
                    type='rect'
                    className='mx-auto'
                    style={{ width: '90%', height: '235px' }}
                  >
                    <CollectionCard
                      collection={collection}
                      likeButtonClicked={(collectionId, favourited) => likeButtonClicked(collectionId, favourited)}
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
        </Card.Body>
      </Card>

      <Card className='my-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center mb-0'>
            <div className='d-flex justify-content-start'>
              <h2 className='my-2 ml-2'>Recently Uploaded</h2>
            </div>
          </div>
          <Container className='p-2'>
            <Row>
              {recent?.map((collection, i) => (
                <Col lg={6} xl={4} className='p-0 my-3' key={i}>
                  <ReactPlaceholder
                    ready={collection}
                    showLoadingAnimation
                    type='rect'
                    className='mx-auto'
                    style={{ width: '90%', height: '235px' }}
                  >
                    <CollectionCard
                      collection={collection}
                      likeButtonClicked={(collectionId, favourited) => likeButtonClicked(collectionId, favourited)}
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
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Home
