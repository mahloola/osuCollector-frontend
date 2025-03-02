import { useContext, useEffect, useState } from 'react'
import { Card, Image, ListGroup, ListGroupItem } from '../bootstrap-osu-collector'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { starToColor } from '../../utils/misc'
import BarGraph from './BarGraph'
import styled, { ThemeContext } from 'styled-components'
import ModeCounters from './ModeCounters'
import './CollectionCard.css'
import * as api from '../../utils/api'

const GraphContainer = styled(Card.Body)`
  cursor: pointer;
  background-color: ${(props) => (props.theme.darkMode ? '#121212' : '#eee')};
`

function CollectionCard({ user, setUser, collection }) {
  if (!collection) return <div></div>
  // @ts-ignore
  const theme = useContext(ThemeContext)

  const [hovered, setHovered] = useState(false)

  const relativeDate = moment.unix(collection.dateUploaded._seconds).fromNow()

  const favourited = user?.favourites?.includes(collection?.id)
  const heartClicked = async () => {
    if (!collection) return
    if (!user) {
      alert('You must be logged in to favourite collections')
      return
    }

    setUser({
      ...user,
      favourites: !favourited
        ? [...(user?.favourites ?? []), collection.id]
        : user.favourites.filter((id) => id !== collection.id),
    })
    if (!favourited) {
      await api.favouriteCollection(collection.id)
    } else {
      await api.unfavouriteCollection(collection.id)
    }
  }

  const difficultySpread = collection.difficultySpread
    ? collection.difficultySpread
    : {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
      }

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Card $lightbg className={`mx-3 ${hovered ? 'shadow' : 'shadow-sm'}`}>
        <Link to={`/collections/${collection.id}`} className='nostyle'>
          {/* Difficulty Spread Graph */}
          <GraphContainer className='px-0 pt-0 pb-1' variant='top'>
            <BarGraph
              data={[
                ['', '', { role: 'style' }],
                ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => [
                  star.toString(),
                  difficultySpread[star],
                  starToColor(star, theme.darkMode),
                ]),
              ]}
              height={80}
              chartEvents={undefined}
            />
          </GraphContainer>
        </Link>
        <Card.Body className='collection-card-clickable pt-3'>
          <div className='d-flex justify-content-between align-items-top'>
            <Link to={`/collections/${collection.id}`} className='nostyle'>
              <div style={{ width: '100%' }}>
                <ModeCounters collection={collection} className='mb-3' />
                <Card.Title className='line-clamp-1'>{collection.name}</Card.Title>
              </div>
            </Link>
            <Link to={`/collections/${collection.id}`} className='nostyle flex-fill'>
              <div className='flex-fill' />
            </Link>
            <div className='d-flex flex-column'>
              <div className='d-flex'>
                <h5 className='mb-0' style={{ display: 'inline-flex' }}>
                  <i
                    className={`fas fa-heart mr-2 ${
                      !user ? 'grey-heart-disabled' : favourited ? 'red-heart-color' : 'grey-heart-color'
                    }`}
                    onClick={user && heartClicked}
                  />
                  <small> {collection?.favourites} </small>
                </h5>
              </div>
              <Link to={`/collections/${collection.id}`}>
                <div className='h-100' />
              </Link>
            </div>
          </div>
          <Link to={`/collections/${collection.id}`} className='nostyle line-clamp-3'>
            {collection.description ? (
              collection.description
            ) : (
              <small style={{ color: '#6c757d' }}>
                <i>no description</i>
              </small>
            )}
          </Link>
        </Card.Body>
        <ListGroup className='list-group-flush'>
          <ListGroupItem $lightbg>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex justify-content-start align-items-center my-1'>
                <Image
                  className='collection-card-uploader-avatar mr-2'
                  src={`https://a.ppy.sh/${collection.uploader.id}`}
                  roundedCircle
                />
                <Link to={`/users/${collection.uploader.id}/uploads`}>{collection.uploader.username}</Link>
                {collection.uploader.rank > 0 && <small className='text-muted ml-1'>#{collection.uploader.rank}</small>}
              </div>
              <small className='text-muted'>{relativeDate}</small>
            </div>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  )
}

export default CollectionCard
