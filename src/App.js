import { Redirect, Route, Router, Switch, useHistory } from 'react-router-dom'
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
import ScrollToTop from './components/common/ScrollToTop'
import Tournaments from './components/tournaments/Tournaments'
import Tournament from './components/tournament/Tournament'
import CreateTournament from './components/tournament/CreateTournament'
import EditTournament from './components/tournament/EditTournament'

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
  const history = useHistory()

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
    ;(async () => {
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
        console.log(`history.push('/collections/${collectionId}')`)
        history.push(`/collections/${collectionId}`)
      })
      ipcRenderer.on('open-tournament', (_event, tournamentId) => {
        console.log(`history.push('/tournaments/${tournamentId}')`)
        history.push(`/tournaments/${tournamentId}`)
      })

      ipcRenderer.send('reload-preferences')
      ipcRenderer.on('preferences-changed', (_event, _preferences) => {
        setPreferences(_preferences)
      })

      ipcRenderer.on('download-progress', (_event, _collectionDownloads) => {
        setCollectionDownloads(_collectionDownloads)
      })
    })()
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
          <Switch>
            <Route exact path='/'>
              <Home user={user} setUser={setUser} />
            </Route>
            <Route path='/all'>
              <All searchText={searchText} setSearchText={setSearchText} user={user} setUser={setUser} />
            </Route>
            <Route path='/popular'>
              <Popular user={user} setUser={setUser} />
            </Route>
            <Route path='/recent'>
              <Recent user={user} setUser={setUser} />
            </Route>
            <Route exact path='/users'>
              <Users />
            </Route>
            {/* use component={...} so that child can access match prop */}
            <Route
              path='/users/:id/favourites'
              component={(props) => <UserFavourites user={user} setUser={setUser} {...props} />}
            />
            <Route
              path='/users/:id/uploads'
              component={(props) => <UserUploads user={user} setUser={setUser} {...props} />}
            />
            <Route exact path='/tournaments'>
              <Tournaments />
            </Route>
            <Route exact path='/tournaments/create'>
              <CreateTournament />
            </Route>
            <Route exact path='/tournaments/:id'>
              <Tournament
                user={user}
                setDownloadsModalIsOpen={setDownloadsModalIsOpen}
                localCollections={localCollections}
                setLocalCollections={setLocalCollections}
              />
            </Route>
            <Route path='/tournaments/:id/edit'>
              <EditTournament />
            </Route>
            <Route path='/login/enterOtp'>
              <EnterOtp authX={authX} setUser={setUser} />
            </Route>
            <Route path='/collections/:id'>
              <Collection
                user={user}
                setUser={setUser}
                setDownloadsModalIsOpen={setDownloadsModalIsOpen}
                setShowDownloadTroubleshootText={setShowDownloadTroubleshootText}
              />
            </Route>
            <Route>
              <Redirect to='/' />
            </Route>
          </Switch>
        </div>
      </StyledApp>
    </ThemeProvider>
  )
}

export default App
