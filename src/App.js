import { Route, Switch, useHistory } from 'react-router-dom'
import { getOwnUser } from './utils/api.js'
import { useState, useEffect } from 'react'
import { useQuery } from './utils/hooks'
import { css, ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { colord, extend } from 'colord'
import mixPlugin from "colord/plugins/mix"

import Home from './components/home/Home'
import Collection from './components/collection/Collection'
import Popular from './components/popular/Popular'
import Recent from './components/recent/Recent'
import NavigationBar from './components/navbar/NavigationBar'
import All from './components/all/All'
import Users from './components/users/Users'
import './App.css'
import UserFavourites from './components/users/UserFavourites.js'
import UserUploads from './components/users/UserUploads.js'
import EnterOtp from './components/login/EnterOtp.js'

// website imports
import NotFound from './components/notfound/NotFound'
import DesktopClient from './components/client/DesktopClient'
import ShowOtp from './components/login/ShowOtp.js'
import TwitchSuccess from './components/twitchSuccess/TwitchSuccess.js'
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import Checkout from './components/payments/Checkout.js'
import Success from './components/payments/Success.js'
import { checkUserIsSubscribed } from './utils/misc.js'

extend([mixPlugin])

// const stripePromise = loadStripe("pk_test_51JVjhhKoq9U17mD0sDkdxbLmHsLEvF0eeUUhgaJEeZgG0Iskojm8KV6UQPp4KeccpCU06rDqPmlb1EhMTOy9TrVN001tIYiti9")
const stripePromise = loadStripe("pk_live_51JVjhhKoq9U17mD0DFdbNlJ7dBkPDBZd6lMrLcfd3AfKiuSp7beXY16YpttOc4ZzS4ulVJ7vwSoLeCfe2tTuYnF100TETgqT2M")

const StyledApp = styled.div`
    ${props => props.theme.darkMode && css`
        background-color: ${props.theme.primary0};
        color: #f8f8f2;
    `}
`

function App() {

    const history = useHistory()

    // undefined (loading) -> [{...} OR null]
    const [user, setUser] = useState(undefined)
    // searchText is shared between NavigationBar and All
    const [searchText, setSearchText] = useState('')
    const query = useQuery()

    // For authentication using OTP (react dev environment, electron app)
    // eslint-disable-next-line no-unused-vars
    const [authX, setAuthX] = useState('')

    // get query params on initial page load
    useEffect(async () => {
        // store logged in user object in app level state
        const user = await getOwnUser()
        // undo theme if user is not subscribed
        if (!checkUserIsSubscribed(user) && currentTheme.darkMode) {
            const newTheme = {
                ...currentTheme,
                darkMode: false 
            }
            setCurrentTheme(newTheme)
            localStorage.setItem('theme', JSON.stringify(newTheme))
        }
        setUser(user)
        setSearchText(query.get('search') || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const theme = {
        darkMode: false,
        primary: '#86AAFC'
    }
    for (const i of Array(100).keys()) {
        theme['primary' + i] = colord('#121212').mix(theme.primary, i / 100).toHex()
    }
    const readTheme = () => {
        try {
            return JSON.parse(localStorage.getItem('theme'))
        } catch (err) {
            return null
        }
    }
    const [currentTheme, setCurrentTheme] = useState(readTheme() || theme)
    const toggleTheme = () => {
        if (!checkUserIsSubscribed(user)) {
            // redirect to /client
            history.push('/client')
            return
        }
        const newTheme = {
            ...currentTheme,
            darkMode: !currentTheme.darkMode
        }
        setCurrentTheme(newTheme)
        localStorage.setItem('theme', JSON.stringify(newTheme))
    }

    return (
        <Elements stripe={stripePromise}>
            <ThemeProvider theme={currentTheme}>
                <StyledApp className="App">
                    <NavigationBar
                        user={user}
                        setAuthX={setAuthX}
                        setSearchText={setSearchText}
                        toggleTheme={toggleTheme}
                    />
                <div style={{ minHeight: 'calc(100vh - 56px)' }}>
                    <Switch>
                        <Route exact path='/'>
                            <Home />
                        </Route>
                        <Route path='/all'>
                            <All searchText={searchText} setSearchText={setSearchText} />
                        </Route>
                        <Route path='/popular'>
                            <Popular />
                        </Route>
                        <Route path='/recent'>
                            <Recent />
                        </Route>
                        <Route exact path='/users'>
                            <Users />
                        </Route>
                        <Route path='/users/:id/favourites'>
                            <UserFavourites />
                        </Route>
                        <Route path='/users/:id/uploads'>
                            <UserUploads />
                        </Route>
                        <Route path='/client'>
                            <DesktopClient user={user} setUser={setUser} />
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
                        <Route path='/twitchSuccess'>
                            <TwitchSuccess user={user} />
                        </Route>
                        <Route path='/collections/:id'>
                            <Collection
                                user={user}
                            />
                        </Route>
                        <Route>
                            <NotFound />
                        </Route>
                    </Switch>
                </div>
                </StyledApp>
            </ThemeProvider>
        </Elements>
    )
}

export default App
