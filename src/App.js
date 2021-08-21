import { Col, Container, Row } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import { getOwnUser } from './utils/api.js';
import { useState, useEffect } from 'react';
import { useQuery } from './utils/hooks';

import Home from './components/home/Home';
import About from './components/about/About';
import Collection from './components/collection/Collection';
import NotFound from './components/notfound/NotFound';
import Popular from './components/popular/Popular';
import Recent from './components/recent/Recent';
import NavigationBar from './components/common/NavigationBar';
import Subscribe from './components/subscribe/Subscribe';
import Desktop from './components/desktop/Desktop';
import LoginButton from './components/common/LoginButton';
import All from './components/all/All';
import Users from './components/users/Users';
import './App.css';
import UserFavourites from './components/users/UserFavourites.js';
import UserUploads from './components/users/UserUploads.js';

function App() {

    // undefined (loading) -> [{...} OR null]
    const [userSession, setUserSession] = useState(undefined);
    // searchText is shared between NavigationBar and All
    const [searchText, setSearchText] = useState('')
    const query = useQuery();

  useEffect(async () => {
  }, []);
  
  // get query params on initial page load
  useEffect(async () => {
      // store logged in user object in app level state
      let user = await getOwnUser();
      setUserSession(user);
      setSearchText(query.get('search') || '');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="App">
            <NavigationBar setSearchText={setSearchText} user={userSession}/>
            <br />
            <Container>
                <Row>
                    <Col>
                        <Switch>
                            <Route exact path='/'>
                                <Home />
                            </Route>
                            <Route path='/all'>
                                <All searchText={searchText} />
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
                            <Route path='/subscribe'>
                                <Subscribe />
                            </Route>
                            <Route path='/download'>
                                <Desktop />
                            </Route>
                            <Route path='/login'>
                                <LoginButton />
                            </Route>
                            <Route path='/collections/:id'>
                                <Collection user={userSession}/>
                            </Route>
                            <Route path='/About'>
                                <About />
                            </Route>
                            <Route>
                                <NotFound />
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </Container>
            <br />
            {process.env.NODE_ENV !== 'production' &&
                <Footer />
            }

        </div>
    );
}

export default App;
