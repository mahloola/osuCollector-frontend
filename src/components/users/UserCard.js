import { Card, CardBody } from '../bootstrap-osu-collector'
import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './UserCard.css'
import Flags from 'country-flag-icons/react/3x2'
import { openInBrowser, useFallbackImg } from '../../utils/misc'
import usercoverfallback from './usercoverfallback.jpg'
import styled from 'styled-components'

const Username = styled.a`
  text-decoration: none;
  font-size: 1.3em;
  color: ${(props) => (props.theme.darkMode ? '#fff' : '#000')};

  &:hover {
    text-decoration: none;
  }
`

const UserCard = ({ user }) => {
  const userFavouritesButton = (user) => {
    const disabled = !user.favourites || !user.favourites.length > 0
    return (
      <LinkContainer to={`/users/${user.id}/favourites`}>
        <Button
          size='sm'
          variant={disabled ? 'outline-secondary' : 'outline-danger'}
          className='mx-1'
          {...{ disabled: disabled }}
        >
          Favourites: {user.favourites ? user.favourites.length : 0}
        </Button>
      </LinkContainer>
    )
  }

  const Flag = Flags[user.osuweb.country_code.toUpperCase()]

  const userUploadsButton = (user) => {
    const disabled = !user.uploads || !user.uploads.length > 0
    return (
      <LinkContainer to={`/users/${user.id}/uploads`}>
        <Button
          size='sm'
          variant={disabled ? 'outline-secondary' : 'outline-primary'}
          className='mx-1'
          {...{ disabled: disabled }}
        >
          Uploads: {user.uploads ? user.uploads.length : 0}
        </Button>
      </LinkContainer>
    )
  }

  return (
    <div className='mx-3'>
      <Card $lightbg variant='Primary'>
        <img
          className='card-img-top user-cover'
          src={user.osuweb.cover.url}
          onError={(ev) => useFallbackImg(ev, usercoverfallback)}
        />
        <div className='d-flex justify-content-center'>
          <img src={user.osuweb.avatar_url} className='user-avatar'></img>
        </div>
        <CardBody $lightbg className='text-center'>
          <div className='d-flex justify-content-center'>
            <Username onClick={() => openInBrowser(`https://osu.ppy.sh/users/${user.id}`)}>
              {user.osuweb.username}
            </Username>
            <div className='d-flex flex-column ml-3 pt-1'>
              <h5 className='m-0 p-0 text-left'> #{user.osuweb.statistics.global_rank} </h5>
              <div className='d-flex' style={{ paddingLeft: '2px', marginTop: '-1px' }}>
                <small className='text-muted mr-2'>#{user.osuweb.statistics.country_rank}</small>
                <Flag style={{ width: '18px' }} />
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-center mt-2'>
            {userFavouritesButton(user)}
            {userUploadsButton(user)}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default UserCard
