import { useState, useEffect } from 'react'
import { Card, Container, Image, ReactPlaceholder } from '../bootstrap-osu-collector'
import CollectionList from '../common/CollectionList'
import * as api from '../../utils/api'
import TournamentList from '../tournaments/TournamentList'
import { capitalizeFirstLetter } from '../../utils/misc'

function UserUploads({ user, setUser }) {
  const [pageUser, setPageUser] = useState(null)

  // run this code on initial page load
  useEffect(() => {
    ;(async () => {
      // get user id from path, eg. /users/123/uploads
      const match = window.location.pathname.match(/\/users\/(\d+)\/uploads/g)
      if (!match) {
        alert('User not found.')
        return
      }
      const userId = Number(match[0].replace('/users/', '').replace('/uploads', '').trim())

      // get user from database
      const user = await api.getUser(userId)
      if (user) setPageUser(user)
      else alert(`user with id ${userId} not found`)
    })()
  }, [])

  // get collections when user changes
  const { collections, tournaments, tournamentError, mutate } = api.useUserUploads(pageUser?.id)
  const tournamentUploadCount = tournaments?.filter((tournament) => tournament.uploader.id === pageUser.id)?.length
  const tournamentOrganizeCount = tournaments
    ?.filter((tournament) => tournament.uploader.id !== pageUser.id)
    ?.filter((tournament) => tournament.organizerIds.includes(pageUser.id))?.length

  const tournamentUploadText = [
    tournamentUploadCount > 0 ? `uploaded ${tournamentUploadCount} tournaments` : null,
    tournamentOrganizeCount > 0 ? `organizes ${tournamentOrganizeCount} tournaments` : null,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Container className='pt-4'>
      <Card className='shadow-lg'>
        <Card.Body>
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
              <h1 className='mb-0'> {pageUser?.osuweb?.username}</h1>
            </ReactPlaceholder>
          </div>
          {tournaments?.length > 0 && (
            <div>
              <ReactPlaceholder
                ready={tournaments}
                showLoadingAnimation
                type='rect'
                className='ml-2 mb-0 mt-3'
                style={{ width: '140px', height: '30px' }}
              >
                <h4 className='ml-2 mb-0 mt-3'>{capitalizeFirstLetter(tournamentUploadText)} </h4>
              </ReactPlaceholder>
              <TournamentList tournaments={tournaments} hasMore={false} loadMore={() => {}} noEndMessage />
            </div>
          )}
          <ReactPlaceholder
            ready={collections}
            showLoadingAnimation
            type='rect'
            className='ml-2 mb-0 mt-3'
            style={{ width: '140px', height: '30px' }}
          >
            <h4 className='ml-2 mb-0 mt-3'>Uploaded {collections?.length} collections </h4>
          </ReactPlaceholder>
          <CollectionList
            collections={collections ?? []}
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

export default UserUploads
