import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { getOwnUser } from './utils/api'
import { useState, useEffect } from 'react'
import { useQuery } from './utils/hooks'
import { css, ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { colord, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'
import Home from './components/home/Home'
import Collection from './components/collection/Collection'
import Popular from './components/popular/Popular'
import Recent from './components/recent/Recent'
import NavigationBar from './components/navbar/NavigationBar'
import All from './components/all/All'
import Users from './components/users/Users'
import './App.css'
import UserFavourites from './components/users/UserFavourites'
import UserUploads from './components/users/UserUploads'
import EnterOtp from './components/login/EnterOtp'
import BasicAuth from 'components/login/BasicAuth'
import ResetPassword from 'components/login/ResetPassword'
import ScrollToTop from './components/common/ScrollToTop'
import Tournaments from './components/tournaments/Tournaments'
import Tournament from './components/tournament/Tournament'
import CreateTournament from './components/tournament/CreateTournament'
import EditTournament from './components/tournament/EditTournament'
import SubscriptionStatus from './components/subscription/SubscriptionStatus'

extend([mixPlugin])

const { ipcRenderer } = window.require('electron')

const StyledApp = styled.div`
  ${(props) =>
    props.theme.darkMode &&
    css`
      background-color: ${props.theme.primary0};
      color: #f8f8f2;
    `}
`

function App() {
  // undefined (loading) -> [{...} OR null]
  const [user, setUser] = useState(undefined)
  // searchText is shared between NavigationBar and All
  const [searchText, setSearchText] = useState('')
  const query = useQuery()
  const navigate = useNavigate()

  // For authentication using OTP (react dev environment, electron app)
  // eslint-disable-next-line no-unused-vars
  const [authX, setAuthX] = useState('')

  // Preferences
  const [preferences, setPreferences] = useState(undefined)

  // Downloads
  const [downloadsModalIsOpen, setDownloadsModalIsOpen] = useState(false)
  const [showDownloadTroubleshootText, setShowDownloadTroubleshootText] = useState(false)
  const [collectionDownloads, setCollectionDownloads] = useState([])

  // collection.db
  const [localCollections, setLocalCollections] = useState([])

  // get query params on initial page load
  useEffect(() => {
    const init = async () => {
      setSearchText(query.get('search') || '')

      let user = null
      try {
        user = await getOwnUser()
      } catch (err) {
        console.error(err)
      }
      setUser(user)

      ipcRenderer.send('check-startup-location')
      ipcRenderer.on('open-collection', (_event, collectionId) => {
        console.log(`navigate('/collections/${collectionId}')`)
        navigate(`/collections/${collectionId}`)
      })
      ipcRenderer.on('open-tournament', (_event, tournamentId) => {
        console.log(`navigate('/tournaments/${tournamentId}')`)
        navigate(`/tournaments/${tournamentId}`)
      })

      ipcRenderer.send('reload-preferences')
      ipcRenderer.on('preferences-changed', (_event, _preferences) => {
        setPreferences(_preferences)
      })

      ipcRenderer.on('download-progress', (_event, _collectionDownloads) => {
        setCollectionDownloads(_collectionDownloads)
      })
    }
    init()
  }, [])

  const theme = {
    darkMode: true,
    primary: '#86AAFC',
  }
  for (const i of Array(100).keys()) {
    theme['primary' + i] = colord('#121212')
      .mix(theme.primary, i / 100)
      .toHex()
  }
  const [currentTheme, setCurrentTheme] = useState({
    ...theme,
    darkMode: JSON.parse(localStorage.getItem('darkMode')) ?? true,
  })
  const toggleTheme = () => {
    setCurrentTheme((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }))
    localStorage.setItem('darkMode', currentTheme.darkMode ? 'false' : 'true')
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <StyledApp className='App'>
        <NavigationBar
          user={user}
          setAuthX={setAuthX}
          setSearchText={setSearchText}
          toggleTheme={toggleTheme}
          collectionDownloads={collectionDownloads}
          downloadsModalIsOpen={downloadsModalIsOpen}
          setDownloadsModalIsOpen={setDownloadsModalIsOpen}
          showDownloadTroubleshootText={showDownloadTroubleshootText}
          setShowDownloadTroubleshootText={setShowDownloadTroubleshootText}
          preferences={preferences}
          localCollections={localCollections}
          setLocalCollections={setLocalCollections}
        />
        <div style={{ minHeight: 'calc(100vh - 56px)' }}>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home user={user} setUser={setUser} />} />
            <Route
              path='/all'
              element={<All searchText={searchText} setSearchText={setSearchText} user={user} setUser={setUser} />}
            />
            <Route path='/popular' element={<Popular user={user} setUser={setUser} />} />
            <Route path='/recent' element={<Recent user={user} setUser={setUser} />} />
            <Route path='/users' element={<Users />} />
            <Route path='/users/:id/favourites' element={<UserFavourites user={user} setUser={setUser} />} />
            <Route path='/users/:id/uploads' element={<UserUploads user={user} setUser={setUser} />} />
            <Route path='/tournaments' element={<Tournaments user={user} setUser={setUser} />} />
            <Route path='/tournaments/create' element={<CreateTournament />} />
            <Route
              path='/tournaments/:id'
              element={
                <Tournament
                  user={user}
                  setUser={setUser}
                  setDownloadsModalIsOpen={setDownloadsModalIsOpen}
                  localCollections={localCollections}
                  setLocalCollections={setLocalCollections}
                />
              }
            />
            <Route path='/tournaments/:id/edit' element={<EditTournament />} />
            <Route path='/login/enterOtp' element={<EnterOtp authX={authX} setUser={setUser} />} />
            <Route
              path='/collections/:id'
              element={
                <Collection
                  user={user}
                  setUser={setUser}
                  setDownloadsModalIsOpen={setDownloadsModalIsOpen}
                  setShowDownloadTroubleshootText={setShowDownloadTroubleshootText}
                />
              }
            />
            <Route path='/subscription/status' element={<SubscriptionStatus user={user} setUser={setUser} />} />
            <Route path='/login/basicAuth' element={<BasicAuth setUser={setUser} />} />
            <Route path='/resetPassword' element={<ResetPassword />} />
            <Route element={<Navigate to='/' />} />
          </Routes>
        </div>
      </StyledApp>
    </ThemeProvider>
  )
}

export default App
