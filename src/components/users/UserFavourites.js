import { useState, useEffect } from 'react'
import { Card, Container, Image, ReactPlaceholder } from '../bootstrap-osu-collector'
import { getUserFavourites } from '../../utils/api'
import CollectionList from '../common/CollectionList'
import * as api from '../../utils/api'
import { addFavouritedByUserAttribute } from 'utils/misc'

function UserFavourites({ user, setUser, match }) {
  const [pageUser, setPageUser] = useState(null)
  const [collections, setCollections] = useState(new Array(3).fill(null))

  // run this code on initial page load
  useEffect(() => {
    ;(async () => {
      // get user id from path, eg. /users/123/favourites
      const _match = match.url.match(/\/users\/(\d+)\/favourites/g)
      if (!_match) {
        alert(`User not found.\n${match.url}`)
        return
      }
      const userId = Number(_match[0].replace('/users/', '').replace('/favourites', '').trim())

      // get user from database
      const user = await api.getUser(userId)
      if (user) setPageUser(user)
      else alert(`user with id ${userId} not found`)
    })()
  }, [])

  // run this code when page changes
  useEffect(() => {
    if (!pageUser) return
    let cancel
    getUserFavourites(pageUser.id, (c) => (cancel = c)).then((collections) => {
      addFavouritedByUserAttribute(collections, user)
      setCollections(collections)
    })
    return cancel
  }, [pageUser])

  return (
    <Container className='pt-4'>
      <Card className='shadow-lg'>
        <Card.Body>
          <div className='ml-2'>
            <div className='d-flex justify-content-left align-items-center p-2 pb-0 mb-2'>
              <ReactPlaceholder
                ready={pageUser}
                showLoadingAnimation
                type='round'
                className='mr-3'
                style={{ width: '48px', height: '48px' }}
              >
                <Image
                  className='mr-3 border border-light shadow-sm'
                  src={`https://a.ppy.sh/${pageUser?.id}`}
                  roundedCircle
                  style={{
                    width: '48px',
                    height: '48px',
                  }}
                />
              </ReactPlaceholder>
              <ReactPlaceholder
                ready={pageUser}
                showLoadingAnimation
                type='rect'
                style={{ width: '300px', height: '40px' }}
              >
                <h1 className='mb-0'> {pageUser?.osuweb?.username}&apos;s Favourites </h1>
              </ReactPlaceholder>
            </div>
            <ReactPlaceholder
              ready={collections.length !== 0 && collections[0] !== null}
              showLoadingAnimation
              type='rect'
              className='ml-2 mb-0 mt-3'
              style={{ width: '140px', height: '30px' }}
            >
              <h4 className='ml-2 mb-0 mt-3'> {collections.length} collections </h4>
            </ReactPlaceholder>
          </div>
          <CollectionList
            collections={collections}
            setCollections={setCollections}
            hasMore={false}
            loadMore={() => 0}
            user={user}
            setUser={setUser}
          />
        </Card.Body>
      </Card>
    </Container>
  )
}

export default UserFavourites
