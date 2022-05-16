/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Alert, Card, Container, Col, ReactPlaceholder, Spinner, Pagination } from '../bootstrap-osu-collector'
import { getUsers } from '../../utils/api'
import UserCard from './UserCard'

function Users() {
  const [userResults, setUserResults] = useState(null)
  const [users, setUsers] = useState(new Array(24).fill(null))
  const [error, setError] = useState(null)

  // get query params on initial page load
  useEffect(() => {
    let cancel
    getUsers(1, 24, (c) => (cancel = c))
      .then((_userResults) => {
        setUserResults(_userResults)
        setUsers(_userResults.users)
      })
      .catch(console.error)
    return cancel
  }, [])

  const loadMore = async () => {
    try {
      const _userResults = await getUsers(userResults.nextPage, 24)
      setUserResults(_userResults)
      setUsers([...users, ..._userResults.users])
    } catch (err) {
      setError(err)
    }
  }

  return (
    <Container className='pt-4'>
      <Card className='shadow-lg'>
        <Card.Body>
          <h2 className='mt-2 ml-3'>Users</h2>
          {error ? (
            <Alert variant='danger'>
              <p>Sorry, an error occurred with the server. Please try refreshing the page. Error details:</p>
              <p>{error.toString()}</p>
            </Alert>
          ) : (
            <Container className='p-2'>
              <InfiniteScroll
                dataLength={users.length}
                next={loadMore}
                hasMore={userResults !== null}
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
                {users.map((user, i) => (
                  <Col lg={6} xl={3} className='p-0 my-3' key={i}>
                    <ReactPlaceholder
                      ready={user !== null}
                      showLoadingAnimation
                      type='rect'
                      className='mx-auto'
                      style={{ width: '90%', height: '210px' }}
                    >
                      {user && <UserCard user={user}></UserCard>}
                    </ReactPlaceholder>
                  </Col>
                ))}
              </InfiniteScroll>
            </Container>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Users
