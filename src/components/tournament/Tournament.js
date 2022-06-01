/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import UserChip from 'components/common/UserChip'
import { useEffect, useState } from 'react'
import { Globe, PencilSquare, TrashFill } from 'react-bootstrap-icons'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Breakpoints, useFallbackImg, userOwnsTournament } from 'utils/misc'
import * as api from '../../utils/api'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Nav,
  ReactPlaceholder,
  Row,
  Spinner,
  Tab,
} from '../bootstrap-osu-collector'
import slimcoverfallback from '../common/slimcoverfallback.jpg'
import MappoolRound from './MappoolRound'
import Truncate from 'react-truncate'
import { Ellipsis } from 'react-bootstrap/esm/PageItem'
import { Tabs } from 'react-bootstrap'

function Tournament({ user }) {
  const history = useHistory()
  // @ts-ignore
  let { id } = useParams()
  const [tournament, setTournament] = useState(undefined)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [error, setError] = useState(null)

  // run this code on initial load
  const refreshTournament = (cancelCallback = undefined) => {
    // GET tournament
    api
      .getTournament(id, cancelCallback)
      .then((tournament) => {
        setTournament(tournament)
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setTournament(null)
        } else {
          console.error(err)
          setError(err)
        }
      })
  }
  useEffect(() => {
    let cancel
    refreshTournament((c) => (cancel = c))
    return cancel
  }, [])

  // message modal
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const deleteTournament = async () => {
    setDeleting(true)
    const result = await api.deleteTournament(tournament.id)
    setDeleting(false)
    setShowDeleteConfirmationModal(false)
    if (result) {
      setTournamentSuccessfullyDeleted(true)
    } else {
      alert('Delete failed. Check console for more info.')
    }
  }

  const [tournamentSuccessfullyDeleted, setTournamentSuccessfullyDeleted] = useState(false)
  if (tournamentSuccessfullyDeleted) {
    return (
      <Alert variant='danger'>
        <Alert.Heading className='text-center m-0'>Tournament deleted</Alert.Heading>
      </Alert>
    )
  }

  if (error) {
    return (
      <Container>
        <div className='d-flex flex-column justify-content-center p-5'>
          <div>
            <h1 className='text-muted'>Error</h1>
            <h5 className='mb-5'>Please try refreshing the page.</h5>
            <p className='text-muted'>{error.message}</p>
          </div>
        </div>
      </Container>
    )
  }

  const notFound = tournament === null
  if (notFound) {
    return (
      <Container>
        <div className='d-flex flex-column justify-content-center p-5'>
          <div>
            <h1>404</h1>
            <h5 className='text-muted'>that tournament could not be found.</h5>
          </div>
        </div>
      </Container>
    )
  }

  const loading = tournament === undefined
  return (
    <>
      <Container className='pt-4'>
        <Card className='mb-3 shadow'>
          <ReactPlaceholder ready={!loading} showLoadingAnimation type='rect' style={{ height: '330px' }}>
            {tournament && (
              <img
                className='card-img-top'
                src={tournament.banner}
                onError={(ev) => useFallbackImg(ev, slimcoverfallback)}
                style={{ objectFit: 'cover', width: '100%', height: 330 }}
              />
            )}
          </ReactPlaceholder>

          <div className='p-4 pb-0'>
            <div className='px-2'>
              <div className='d-flex justify-content-between'>
                <ReactPlaceholder
                  ready={!loading}
                  showLoadingAnimation
                  type='rect'
                  style={{ width: '50%', height: '56px' }}
                >
                  {tournament && <h1>{tournament?.name}</h1>}
                </ReactPlaceholder>
                {user && tournament && userOwnsTournament(user, tournament) && (
                  <div className='d-flex'>
                    <LinkContainer to={`/tournaments/${id}/edit`}>
                      <div>
                        <Button
                          variant='secondary'
                          className='p-0 mx-2'
                          style={{
                            width: '50px',
                            height: '34px',
                          }}
                        >
                          <PencilSquare className='svg-shadow' size={18} />
                        </Button>
                      </div>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      onClick={() => setShowDeleteConfirmationModal(true)}
                      className='p-0'
                      style={{
                        width: '50px',
                        height: '34px',
                      }}
                    >
                      <TrashFill className='svg-shadow' size={18} />
                    </Button>
                  </div>
                )}
              </div>
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
                    <ReactPlaceholder ready={!loading} showLoadingAnimation className='mt-4 pr-5'>
                      {tournament && (
                        <>
                          <div className='d-flex align-items-center mb-4'>
                            <Globe />
                            <span className='mx-2'> Info: </span>
                            <a href={tournament?.link}>
                              {' '}
                              <small>{tournament?.link}</small>{' '}
                            </a>
                          </div>
                          <p className='pr-4' style={{ whiteSpace: 'pre-line' }}>
                            {tournament?.description}
                          </p>
                        </>
                      )}
                    </ReactPlaceholder>
                    <div className='d-flex flex-row my-4'>
                      <Button
                        className='mr-1'
                        onClick={() => {
                          if (user?.paidFeaturesAccess) {
                            setModalMessage('Tournament launched in osu!Collector desktop client!')
                            window.open(`osucollector://tournaments/${tournament.id}`)
                          } else {
                            history.push('/client')
                          }
                        }}
                      >
                        Download maps
                      </Button>
                      <Button
                        onClick={() => {
                          if (user?.paidFeaturesAccess) {
                            setModalMessage('Tournament launched in osu!Collector desktop client!')
                            window.open(`osucollector://tournaments/${tournament.id}`)
                          } else {
                            history.push('/client')
                          }
                        }}
                      >
                        Add mappool to osu!
                      </Button>
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
                    {!loading && (
                      <>
                        <div className='text-muted mb-2'>Uploader</div>
                        <div className='d-flex' style={{ minHeight: '50px' }}>
                          <UserChip id={tournament.uploader.id} username={tournament.uploader.username} />
                        </div>
                      </>
                    )}
                    {/* organizers */}
                    {!loading && tournament.organizers.length > 0 && (
                      <>
                        <div className='text-muted mt-3 mb-2'>Organizers</div>
                        <div className='d-flex flex-wrap'>
                          {tournament.organizers.map((organizer) => (
                            <UserChip key={organizer.id} id={organizer.id} username={organizer.username} />
                          ))}
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </Card>

        <Card className='p-4 shadow' style={{ minHeight: '100vh' }}>
          <h1 className='mb-4'> Mappool </h1>
          <Tab.Container defaultActiveKey={0}>
            <Breakpoints.XLUp>
              <div className='d-flex'>
                <div className='px-2 mr-1' style={{ width: 150 }}>
                  <Nav variant='pills' className='flex-column'>
                    <ReactPlaceholder
                      ready={!loading}
                      type='rect'
                      showLoadingAnimation
                      style={{ height: '40px' }}
                      color='#0D6EFD'
                    >
                      {tournament?.rounds.map((round, i) => (
                        <Nav.Item key={i}>
                          <Nav.Link eventKey={i}>
                            <div
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: 118,
                                margin: 0,
                              }}
                            >
                              {round.round}
                            </div>
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </ReactPlaceholder>
                  </Nav>
                </div>
                <div className='flex-fill'>
                  <Tab.Content>
                    {loading
                      ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <ReactPlaceholder
                            key={i}
                            ready={false}
                            type='rect'
                            showLoadingAnimation
                            style={{ height: '66px' }}
                            className='mb-1'
                          >
                            {' '}
                          </ReactPlaceholder>
                        ))
                      : tournament?.rounds.map((round, i) => (
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
            </Breakpoints.XLUp>
            <Breakpoints.LGDown>
              <div>
                <div className='px-2 mr-1'>
                  <Nav variant='pills'>
                    <div className='d-flex'>
                      <ReactPlaceholder
                        ready={!loading}
                        type='rect'
                        showLoadingAnimation
                        style={{ height: '40px' }}
                        color='#0D6EFD'
                      >
                        {tournament?.rounds.map((round, i) => (
                          <Nav.Item key={i}>
                            <Nav.Link eventKey={i}>
                              <div
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  margin: 0,
                                }}
                              >
                                {round.round}
                              </div>
                            </Nav.Link>
                          </Nav.Item>
                        ))}
                      </ReactPlaceholder>
                    </div>
                  </Nav>
                </div>
                <div className='flex-fill'>
                  <Tab.Content>
                    {loading
                      ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <ReactPlaceholder
                            key={i}
                            ready={false}
                            type='rect'
                            showLoadingAnimation
                            style={{ height: '66px' }}
                            className='mb-1'
                          >
                            {' '}
                          </ReactPlaceholder>
                        ))
                      : tournament?.rounds.map((round, i) => (
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
            </Breakpoints.LGDown>
          </Tab.Container>
        </Card>
      </Container>

      <Modal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)} centered={true}>
        <Modal.Body>Are you sure you want to delete this tournament?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteConfirmationModal(false)} disabled={deleting}>
            No
          </Button>
          <Button variant='danger' onClick={deleteTournament} disabled={deleting}>
            {deleting ? <Spinner size='sm' animation='border'></Spinner> : 'Yes'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!modalMessage} onHide={() => setModalMessage('')} centered={true}>
        <Modal.Body className='px-4 py-5'>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalMessage('')} disabled={deleting}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const S = {}
S.Container = styled(Container)`
  border-color: ${({ theme }) => theme.primary30};
  border-width: 1;
`

export default Tournament
