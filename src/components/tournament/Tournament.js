import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, Card, Col, Container, Row, Tab, Nav } from '../bootstrap-osu-collector'
import * as api from '../../utils/api'
import { Globe } from 'react-bootstrap-icons'
import { useFallbackImg } from 'utils/misc'
import slimcoverfallback from '../common/slimcoverfallback.jpg'
import UserChip from 'components/common/UserChip'
import styled from 'styled-components'
import MappoolRound from './MappoolRound'

function Tournament() {
  let { id } = useParams()
  const [tournament, setTournament] = useState(undefined)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)

  // run this code on initial load
  const refreshTournament = (cancelCallback = undefined) => {
    // GET tournament
    api
      .getTournament(id, cancelCallback)
      .then((tournament) => {
        setTournament(tournament)
      })
      .catch(console.log)
  }
  useEffect(() => {
    let cancel
    refreshTournament((c) => (cancel = c))
    return cancel
  }, [])

  // message modal
  // const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
  // const [deleting, setDeleting] = useState(false)

  // const deleteTournament = async () => {
  //   setDeleting(true)
  //   const result = await api.deleteTournament(tournament.id)
  //   setDeleting(false)
  //   setShowDeleteConfirmationModal(false)
  //   if (result) {
  //     setTournamentSuccessfullyDeleted(true)
  //   } else {
  //     alert('Delete failed. Check console for more info.')
  //   }
  // }

  // const [tournamentSuccessfullyDeleted, setTournamentSuccessfullyDeleted] = useState(false)
  // if (tournamentSuccessfullyDeleted) {
  //   return (
  //     <Alert variant='danger'>
  //       <Alert.Heading className='text-center m-0'>Tournament deleted</Alert.Heading>
  //     </Alert>
  //   )
  // }

  if (!tournament) {
    return <h1>Loading...</h1>
  }

  // const flattenedBeatmapsGroupedByRound = tournament.rounds.map((round) =>
  //   round.mods
  //     .map((mod) =>
  //       mod.maps.map((beatmap, i) => ({
  //         round: round.round,
  //         mod: mod.mod,
  //         index: i + 1,
  //         beatmap: beatmap,
  //       }))
  //     )
  //     .flat()
  // )

  if (tournament) {
    return (
      <Container className='pt-4'>
        <Card className='mb-3 shadow'>
          <img
            className='card-img-top'
            src={tournament.banner}
            onError={(ev) => useFallbackImg(ev, slimcoverfallback)}
            style={{ objectFit: 'cover', width: '100%', height: 330 }}
          />

          <div className='p-4 pb-0'>
            <div className='px-2'>
              <h1>{tournament?.name}</h1>
              <Container>
                <Row>
                  <Col
                    xs={{ span: 12, order: 2 }}
                    sm={{ span: 12, order: 2 }}
                    md={{ span: 12, order: 2 }}
                    lg={{ span: 7, order: 1 }}
                    xl={{ span: 8, order: 1 }}
                    className='p-0'
                  >
                    <div className='d-flex align-items-center mb-4'>
                      <Globe />
                      <span className='mx-2'> Info: </span>
                      <a href={tournament?.link}>
                        {' '}
                        <small>{tournament?.link}</small>{' '}
                      </a>
                    </div>
                    <p className='pr-4' style={{ whiteSpace: 'pre' }}>
                      {tournament?.description}
                    </p>
                    <div className='d-flex flex-row my-4'>
                      <Button className='mr-1'>Download maps</Button>
                      <Button>Add mappool to osu!</Button>
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 12, order: 1 }}
                    sm={{ span: 12, order: 1 }}
                    md={{ span: 12, order: 1 }}
                    lg={{ span: 5, order: 2 }}
                    xl={{ span: 4, order: 2 }}
                    className='p-0 mb-4'
                  >
                    {/* uploader */}
                    <div className='text-muted mb-2'>Uploader</div>
                    <div className='d-flex'>
                      <UserChip id={tournament.uploader.id} username={tournament.uploader.username} />
                    </div>
                    {/* organizers */}
                    <div className='text-muted mt-3 mb-2'>Organizers</div>
                    <div className='d-flex flex-wrap'>
                      {tournament.organizers.map((organizer) => (
                        <UserChip key={organizer.id} id={organizer.id} username={organizer.username} />
                      ))}
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </Card>

        <Card className='p-4 shadow' style={{ minHeight: '100vh' }}>
          <h1 className='mb-4'> Mappool </h1>
          <div>TODO: mobile layout</div>
          <Tab.Container defaultActiveKey={0}>
            <div className='d-flex'>
              <div className='px-2 mr-1' style={{ width: 150 }}>
                <Nav variant='pills' className='flex-column'>
                  {tournament.rounds.map((round, i) => (
                    <Nav.Item key={i}>
                      <Nav.Link eventKey={i}>{round.round}</Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
              <div className='flex-fill'>
                <Tab.Content>
                  {tournament.rounds.map((round, i) => (
                    <Tab.Pane key={i} eventKey={i}>
                      <MappoolRound
                        round={round}
                        currentlyPlaying={currentlyPlaying}
                        setCurrentlyPlaying={setCurrentlyPlaying}
                      />
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </div>
            </div>
          </Tab.Container>
        </Card>
      </Container>
    )
  } else {
    return <div></div>
  }
}

const S = {}
S.Container = styled(Container)`
  border-color: ${({ theme }) => theme.primary30};
  border-width: 1;
`

export default Tournament
