import { useContext, useState } from 'react'
import { Card, Image, ListGroup, ListGroupItem } from '../bootstrap-osu-collector'
import { LinkContainer } from 'react-router-bootstrap'
import moment from 'moment'
import { useFallbackImg } from 'utils/misc'
import slimcoverfallback from '../common/slimcoverfallback.jpg'
import { ThemeContext } from 'styled-components'

export default function TournamentCard({ tournament }) {
  const theme = useContext(ThemeContext)
  const [hovered, setHovered] = useState(false)

  const dateUploaded = tournament.dateUploaded._seconds
    ? moment.unix(tournament.dateUploaded._seconds)
    : moment(tournament.dateUploaded)
  const relativeDate = dateUploaded.fromNow()

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Card $lightbg className={`mx-3 ${hovered ? 'shadow' : 'shadow-sm'}`}>
        <LinkContainer to={`/tournaments/${tournament.id}`}>
          <a className='nostyle'>
            <img
              className='card-img-top'
              src={tournament.banner}
              onError={(ev) => useFallbackImg(ev, slimcoverfallback)}
              style={{ objectFit: 'cover', width: '100%', height: 140 }}
            />
          </a>
        </LinkContainer>
        <ListGroup className='list-group-flush'>
          <ListGroupItem $lightbg>
            <h4 className={`${theme.darkMode && 'img-overlay-text'} mt-1 mb-1`}> {tournament.name} </h4>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex justify-content-start align-items-center my-1'>
                <Image
                  className='collection-card-uploader-avatar mr-2'
                  src={`https://a.ppy.sh/${tournament.uploader.id}`}
                  roundedCircle
                />
                <LinkContainer to={`/users/${tournament.uploader.id}/uploads`}>
                  <a> {tournament.uploader.username} </a>
                </LinkContainer>
                {tournament.uploader.rank > 0 && <small className='text-muted ml-1'>#{tournament.uploader.rank}</small>}
              </div>
              <small className='text-muted'>{relativeDate}</small>
            </div>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  )
}
