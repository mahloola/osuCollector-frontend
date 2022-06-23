import { Col, Container, ReactPlaceholder, Spinner } from '../bootstrap-osu-collector'
import InfiniteScroll from 'react-infinite-scroll-component'
import CollectionCard from './CollectionCard'
import { changeCollectionFavouritedStatus } from 'utils/misc'
import * as api from '../../utils/api'

const CollectionList = ({ collections, setCollections = null, hasMore, loadMore, user, setUser }) => {
  if (!collections) {
    console.log('WTF')
    console.log(collections)
  }

  return (
    <Container className='p-2'>
      <InfiniteScroll
        dataLength={collections.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className='d-flex justify-content-center p-2'>
            <Spinner animation='border' />
          </div>
        }
        endMessage={
          <p className='text-muted' style={{ textAlign: 'center' }}>
            <b>Nothing more to show.</b>
          </p>
        }
        className='row'
      >
        {collections.map((collection, i) => (
          <Col lg={6} xl={4} className='p-0 my-3' key={i}>
            <ReactPlaceholder
              ready={collection !== null}
              showLoadingAnimation
              type='rect'
              className='mx-auto'
              style={{ width: '90%', height: '268px' }}
            >
              {collection && <CollectionCard user={user} setUser={setUser} collection={collection} />}
            </ReactPlaceholder>
          </Col>
        ))}
      </InfiniteScroll>
    </Container>
  )
}

export default CollectionList
