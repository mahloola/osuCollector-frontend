import { Route, Switch, useHistory } from 'react-router-dom'
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
import SubscriptionStatus from './components/subscription/SubscriptionStatus'

// website imports
import NotFound from './components/notfound/NotFound'
import DesktopClient from './components/client/DesktopClient'
import ShowOtp from './components/login/ShowOtp'
import TwitchSuccess from './components/twitchSuccess/TwitchSuccess'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Checkout from './components/payments/Checkout'
import Success from './components/payments/Success'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import LinkIrc from './components/login/LinkIrc'
import { Helmet } from 'react-helmet'
import BasicAuth from 'components/login/BasicAuth'
import ResetPassword from 'components/login/ResetPassword'

extend([mixPlugin])

// const stripePromise = loadStripe("pk_test_51JVjhhKoq9U17mD0sDkdxbLmHsLEvF0eeUUhgaJEeZgG0Iskojm8KV6UQPp4KeccpCU06rDqPmlb1EhMTOy9TrVN001tIYiti9")
const stripePromise = loadStripe(
  'pk_live_51JVjhhKoq9U17mD0DFdbNlJ7dBkPDBZd6lMrLcfd3AfKiuSp7beXY16YpttOc4ZzS4ulVJ7vwSoLeCfe2tTuYnF100TETgqT2M'
)

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

      // undo theme if user is not subscribed
      // if (!user?.paidFeaturesAccess && currentTheme.darkMode) {
      //   const newTheme = {
      //     ...currentTheme,
      //     darkMode: false,
      //   }
      //   setCurrentTheme(newTheme)
      //   localStorage.setItem('darkMode', 'false')
      // }
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
    // if (!user?.paidFeaturesAccess) {
    //   // redirect to /client
    //   history.push('/client')
    //   return
    // }
    setCurrentTheme((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }))
    localStorage.setItem('darkMode', currentTheme.darkMode ? 'false' : 'true')
  }

  return (
    <>
      <Helmet>
        <title>osu!Collector | Find osu! beatmap collections</title>
      </Helmet>

      <PayPalScriptProvider
        options={{
          'client-id': 'AeUARmSkIalUe4gK08KWZjWYJqSq0AKH8iS9cQ3U8nIGiOxyUmrPTPD91vvE2xkVovu-3GlO0K7ISv2R',
          vault: true,
          intent: 'subscription',
          components: 'buttons',
        }}
      >
        <Elements stripe={stripePromise}>
          <ThemeProvider theme={currentTheme}>
            <StyledApp className='App'>
              <NavigationBar user={user} setAuthX={setAuthX} setSearchText={setSearchText} toggleTheme={toggleTheme} />
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
                  <Route path='/users/:id/favourites'>
                    <UserFavourites user={user} setUser={setUser} />
                  </Route>
                  <Route path='/users/:id/uploads'>
                    <UserUploads user={user} setUser={setUser} />
                  </Route>
                  <Route path='/client'>
                    <DesktopClient user={user} setUser={setUser} />
                  </Route>
                  <Route exact path='/tournaments'>
                    <Tournaments user={user} setUser={setUser} />
                  </Route>
                  <Route exact path='/tournaments/create'>
                    <CreateTournament />
                  </Route>
                  <Route path='/tournaments/:id'>
                    <Tournament user={user} setUser={setUser} />
                  </Route>
                  <Route path='/tournaments/:id/edit'>
                    <EditTournament />
                  </Route>
                  <Route path='/payments/checkout'>
                    <Checkout />
                  </Route>
                  <Route path='/payments/success'>
                    <Success />
                  </Route>
                  <Route path='/login/enterOtp'>
                    <EnterOtp authX={authX} setUser={setUser} />
                  </Route>
                  <Route path='/login/showOtp'>
                    <ShowOtp />
                  </Route>
                  <Route path='/login/linkIrc'>
                    <LinkIrc user={user} />
                  </Route>
                  <Route path='/twitchSuccess'>
                    <TwitchSuccess user={user} />
                  </Route>
                  <Route path='/collections/:id'>
                    <Collection user={user} setUser={setUser} />
                  </Route>
                  <Route path='/subscription/status'>
                    <SubscriptionStatus user={user} setUser={setUser} />
                  </Route>
                  <Route path='/login/basicAuth'>
                    <BasicAuth setUser={setUser} />
                  </Route>
                  <Route path='/resetPassword'>
                    <ResetPassword />
                  </Route>
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </div>
            </StyledApp>
          </ThemeProvider>
        </Elements>
      </PayPalScriptProvider>
    </>
  )
}

export default App
