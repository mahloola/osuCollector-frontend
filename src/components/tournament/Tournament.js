/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import UserChip from 'components/common/UserChip'
import { useEffect, useState } from 'react'
import { Download, Globe, Heart, PencilSquare, TrashFill } from 'react-bootstrap-icons'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Breakpoints, getHostname, useFallbackImg, userOwnsTournament, openInBrowser } from 'utils/misc'
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
import FavouriteButton from '../common/FavouriteButton'
import slimcoverfallback from '../common/slimcoverfallback.jpg'
import MappoolRound from './MappoolRound'
import ImportMappoolModal from './ImportMappoolModal'
import RemoveMappoolModal from './RemoveMappoolModal'

const { ipcRenderer } = window.require('electron')

function Tournament({ user, setUser, setDownloadsModalIsOpen, localCollections, setLocalCollections }) {
  // @ts-ignore
  let { id } = useParams()
  const { tournament } = api.useTournament(id)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [error, setError] = useState(null)

  // modals
  const [importModalIsOpen, setImportModalIsOpen] = useState(false)
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false)
  const [messageModalText, setMessageModalText] = useState('')

  // download
  const checkUserPermissions = () => {
    if (!user) {
      setMessageModalText('You must be logged in to use this feature')
      return false
    }
    if (!user?.paidFeaturesAccess) {
      setMessageModalText('You must be subscribed to use this feature')
      return false
    }
    return true
  }
  const downloadButtonClicked = async () => {
    if (!checkUserPermissions()) {
      return
    }
    try {
      await ipcRenderer.invoke('start-tournament-download', tournament)
      setDownloadsModalIsOpen(true)
    } catch (error) {
      setMessageModalText(error.message)
    }
  }

  // read collection.db to show preview of mappool collections to be removed
  const loadCollectionDb = async () => {
    const { error, data } = await ipcRenderer.invoke('parse-collection-db')
    if (error) {
      alert(error + '\n\nPlease check that your osu! install folder is configured properly in settings.')
      return
    }
    setLocalCollections(
      data.collection.map((collection) => ({
        name: collection.name,
        beatmapChecksums: collection.beatmapsMd5,
      }))
    )
  }

  // message modal
  const [showDownloadLinkConfirmation, setShowDownloadLinkConfirmation] = useState(false)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const deleteTournament = async () => {
    setDeleting(true)
    const result = await api.deleteTournament(tournament.id)
    setDeleting(false)
    setShowDeleteConfirmationModal(false)
    if (result) {
      setTournamentSuccessfullyDeleted(true)
      // setTimeout(() => (window.location.href = `/tournaments`), 1000)
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

  const favouriteClicked = () => {
    if (!user) return
    if (user.favouriteTournaments?.includes(Number(id))) {
      // remove from favourites
      setUser((prev) => ({
        ...prev,
        favouriteTournaments: user.favouriteTournaments?.filter((tournamentId) => tournamentId !== Number(id)) ?? [],
      }))
      api.favouriteTournament(Number(id), false)
    } else {
      // add to favourites
      setUser((prev) => ({
        ...prev,
        favouriteTournaments: [...(prev.favouriteTournaments ?? []), Number(id)],
      }))
      api.favouriteTournament(Number(id), true)
    }
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
                          <div className='d-flex align-items-center mb-2'>
                            <Globe />
                            <span className='mx-2'> Info: </span>
                            <a
                              style={{ color: '#0d6efd', cursor: 'pointer' }}
                              onClick={() => openInBrowser(tournament?.link)}
                            >
                              <small>{tournament?.link}</small>
                            </a>
                          </div>
                          <div className='d-flex align-items-center mb-4'>
                            <Download />
                            <span className='mx-2'> Mappool download: </span>
                            {tournament?.downloadUrl ? (
                              <a href='#' onClick={() => setShowDownloadLinkConfirmation(true)}>
                                <small>{tournament?.downloadUrl}</small>
                              </a>
                            ) : (
                              <small className='text-muted' style={{ marginBottom: '1px' }}>
                                no download URL provided
                              </small>
                            )}
                          </div>
                          <p className='pr-4' style={{ whiteSpace: 'pre-line' }}>
                            {tournament?.description}
                          </p>
                        </>
                      )}
                    </ReactPlaceholder>
                    <FavouriteButton
                      className='mr-1'
                      favourites={0}
                      favourited={user?.favouriteTournaments?.includes(Number(id))}
                      onClick={favouriteClicked}
                    />
                    <div className='d-flex flex-row my-4' style={{ gap: '5px' }}>
                      <Button onClick={downloadButtonClicked}>Download all maps</Button>
                      <Button onClick={() => setImportModalIsOpen((prev) => !prev)}>Import collections</Button>
                      <Button
                        variant='secondary'
                        onClick={() => {
                          loadCollectionDb()
                          setRemoveModalIsOpen((prev) => !prev)
                        }}
                      >
                        Remove imported collections
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

      <ImportMappoolModal
        tournament={tournament}
        importModalIsOpen={importModalIsOpen}
        setImportModalIsOpen={setImportModalIsOpen}
      />
      <RemoveMappoolModal
        tournament={tournament}
        localCollections={localCollections}
        setLocalCollections={setLocalCollections}
        removeModalIsOpen={removeModalIsOpen}
        setRemoveModalIsOpen={setRemoveModalIsOpen}
      />

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

      <Modal show={!!messageModalText} onHide={() => setMessageModalText('')} size='lg' centered={true}>
        <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>{messageModalText}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setMessageModalText('')} variant='secondary'>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={!!showDownloadLinkConfirmation}
        onHide={() => setShowDownloadLinkConfirmation(false)}
        centered={true}
      >
        <Modal.Body className='px-4 py-5 d-flex flex-column align-items-center'>
          <div>You are navigating away from osucollector.com to:</div>
          <h3>{getHostname(tournament?.downloadUrl)}</h3>
          <div>Only proceed if you trust this link.</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDownloadLinkConfirmation(false)}>
            Cancel
          </Button>
          <Button onClick={() => window.open(tournament?.downloadUrl)}>yeah sure whatever</Button>
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
