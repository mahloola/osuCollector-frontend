import { useContext, useState } from 'react'
import { CloudUpload, LightbulbFill, Moon } from 'react-bootstrap-icons'
import md5 from 'md5'
import { useMediaQuery } from 'react-responsive'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import config from '../../config/config'
import * as api from '../../utils/api'
import { Button, Form, FormControl, InputGroup, Nav, Navbar, ReactPlaceholder } from '../bootstrap-osu-collector'
import '../common/Glow.css'
import './NavButton.css'
import './NavigationBar.css'
import UploadModal from './UploadModal'
import UserBadge from './UserBadge'

// desktop imports
import { useEffect } from 'react'
import DownloadsModal from './DownloadsModal'
import { CloudDownload } from 'react-bootstrap-icons'
import { FaCog } from 'react-icons/fa'
import PreferencesModal from './PreferencesModal'
import { ArrowLeftShort, ArrowRightShort } from 'react-bootstrap-icons'

const { ipcRenderer } = window.require('electron')

const Large = ({ children }) => (useMediaQuery({ maxWidth: 1200 - 1 }) ? children : null)
const ExtraLarge = ({ children }) => (useMediaQuery({ minWidth: 1200 }) ? children : null)

const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

function NavigationBar({
  user,
  setAuthX,
  setSearchText,
  toggleTheme,
  collectionDownloads,
  downloadsModalIsOpen,
  setDownloadsModalIsOpen,
  showDownloadTroubleshootText,
  setShowDownloadTroubleshootText,
  preferences,
  localCollections,
  setLocalCollections,
}) {
  // @ts-ignore
  const theme = useContext(ThemeContext)

  const [preferencesModalIsOpen, setPreferencesModalIsOpen] = useState(false)
  const [remoteCollections, setRemoteCollections] = useState([])
  const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false)
  const [searchBarInput, setSearchBarInput] = useState('')
  const history = useHistory()

  const searchSubmit = (event) => {
    event.preventDefault()
    history.push(`/all?search=${encodeURIComponent(searchBarInput)}`)
    setSearchText(searchBarInput)
    return false
  }

  const otpLogin = () => {
    const clientId = config.get('CLIENT_ID')
    const callback = encodeURIComponent(config.get('OAUTH_CALLBACK'))
    const x = md5(Date.now())
    setAuthX(x)
    console.log(x)
    openInNewTab(
      `https://osu.ppy.sh/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callback}&state=${x}`
    )
    history.push('/login/enterOtp')
  }

  const getRemoteCollections = async () => {
    const { collections } = await api.getUserUploads(user.id)
    setRemoteCollections(collections)
  }

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

  useEffect(() => {
    if (preferences === null) {
      setPreferencesModalIsOpen(true)
    }
  }, [preferences])

  const preferencesShouldGlow =
    preferences !== undefined &&
    (preferences === null ||
      preferences?.osuInstallDirectory?.trim() === '' ||
      preferences?.osuSongsDirectory?.trim() === '')

  return (
    <div className='navbar-sticky'>
      <Navbar bg='dark' variant='dark' expand='xl' className='pl-3'>
        <ExtraLarge>
          <div className='d-flex' style={{ marginLeft: -8 }}>
            <div onClick={history.goBack} className='nav-button mx-0'>
              <ArrowLeftShort style={{ margin: '0 auto' }} size={32} />
            </div>
            <div onClick={history.goForward} className='nav-button mr-2'>
              <ArrowRightShort style={{ margin: '0 auto' }} size={32} />
            </div>
          </div>
          <LinkContainer to='/'>
            <Navbar.Brand>
              osu!<strong>Collector</strong>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav' className='justify-content-between'>
            <Nav className='me-auto'>
              <LinkContainer to='/recent'>
                <Nav.Link>Recent</Nav.Link>
              </LinkContainer>

              <LinkContainer to='/popular?range=alltime'>
                <Nav.Link>Popular</Nav.Link>
              </LinkContainer>

              <LinkContainer to='/users'>
                <Nav.Link>Users</Nav.Link>
              </LinkContainer>

              <LinkContainer to='/tournaments'>
                <Nav.Link>Tournaments</Nav.Link>
              </LinkContainer>
            </Nav>

            <Form onSubmit={searchSubmit} className='ml-3 me-auto'>
              <InputGroup>
                <FormControl
                  onChange={(e) => setSearchBarInput(e.target.value)}
                  type='search'
                  placeholder='tech, aim, speed'
                />
                <Button type='submit' variant='primary'>
                  Search
                </Button>
              </InputGroup>
            </Form>

            <Nav>
              <Button className='ml-2' variant='outline-secondary' onClick={toggleTheme}>
                {theme.darkMode ? <LightbulbFill /> : <Moon />}
              </Button>
              <Button
                className='ml-3'
                onClick={() => {
                  setShowDownloadTroubleshootText(false)
                  setDownloadsModalIsOpen(true)
                }}
              >
                <div className='d-flex align-items-center'>
                  <CloudDownload className='mr-2' />
                  Downloads
                </div>
              </Button>

              <Button
                className='ml-2'
                onClick={() => {
                  if (user) {
                    loadCollectionDb()
                    getRemoteCollections()
                    setUploadModalIsOpen(true)
                  } else {
                    alert('Please log in!')
                  }
                }}
              >
                <div className='d-flex align-items-center'>
                  <CloudUpload className='mr-2' />
                  Upload
                </div>
              </Button>

              <ReactPlaceholder
                ready={user !== undefined}
                showLoadingAnimation
                type='rect'
                className='mx-3'
                style={{
                  width: '120px',
                  height: 'auto',
                  borderRadius: '30px',
                }}
              >
                {user ? (
                  <UserBadge className='mx-3' user={user} />
                ) : (
                  <Button className='mx-2' onClick={otpLogin}>
                    Login
                  </Button>
                )}
              </ReactPlaceholder>

              <Button
                className={preferencesShouldGlow ? 'glowing' : ''}
                variant='secondary'
                onClick={() => setPreferencesModalIsOpen(true)}
              >
                <FaCog />
              </Button>
            </Nav>
          </Navbar.Collapse>
        </ExtraLarge>
        <Large>
          <LinkContainer to='/'>
            <Navbar.Brand>
              osu!<strong>Collector</strong>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav' className='justify-content-between'>
            <Nav className='me-auto'>
              <LinkContainer to='/recent'>
                <Nav.Link>Recent</Nav.Link>
              </LinkContainer>

              <LinkContainer to='/popular?range=alltime'>
                <Nav.Link>Popular</Nav.Link>
              </LinkContainer>

              <LinkContainer to='/users'>
                <Nav.Link>Users</Nav.Link>
              </LinkContainer>

              <LinkContainer to='/tournaments'>
                <Nav.Link>Tournaments</Nav.Link>
              </LinkContainer>

              <Nav.Link onClick={toggleTheme}>
                {theme.darkMode ? <LightbulbFill className='mr-2' /> : <Moon className='mr-2' />}
                {theme.darkMode ? 'Light Mode' : 'Dark Mode'}
              </Nav.Link>

              <Nav.Link
                onClick={() => {
                  setShowDownloadTroubleshootText(false)
                  setDownloadsModalIsOpen(true)
                }}
              >
                <CloudDownload className='mr-2' />
                Downloads
              </Nav.Link>

              <Nav.Link
                onClick={() => {
                  if (user) setUploadModalIsOpen(true)
                  else alert('Please log in!')
                }}
              >
                <CloudUpload className='mr-2' />
                Upload
              </Nav.Link>

              {!user && <Nav.Link onClick={otpLogin}>Login</Nav.Link>}

              <Nav.Link onClick={() => setPreferencesModalIsOpen(true)}>
                <FaCog className='mr-2' />
                Settings
              </Nav.Link>

              <Form onSubmit={searchSubmit} className='me-auto my-2'>
                <InputGroup>
                  <FormControl
                    onChange={(e) => setSearchBarInput(e.target.value)}
                    type='search'
                    size='sm'
                    placeholder='tech, aim, speed'
                  />
                  <Button type='submit' size='sm' variant='primary'>
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Large>
      </Navbar>
      <UploadModal
        uploadModalIsOpen={uploadModalIsOpen}
        setUploadModalIsOpen={setUploadModalIsOpen}
        remoteCollections={remoteCollections}
        localCollections={localCollections}
      />
      <DownloadsModal
        preferences={preferences}
        collectionDownloads={collectionDownloads}
        downloadsModalIsOpen={downloadsModalIsOpen}
        setDownloadsModalIsOpen={setDownloadsModalIsOpen}
        showDownloadTroubleshootText={showDownloadTroubleshootText}
        setShowDownloadTroubleshootText={setShowDownloadTroubleshootText}
      />
      <PreferencesModal
        preferences={preferences}
        preferencesModalIsOpen={preferencesModalIsOpen}
        setPreferencesModalIsOpen={setPreferencesModalIsOpen}
      />
    </div>
  )
}

export default NavigationBar
