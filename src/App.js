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
import Footer from './components/common/Footer';
import Subscribe from './components/subscribe/Subscribe';
import Desktop from './components/desktop/Desktop';
import Login from './components/common/Login';
import All from './components/all/All';

function App() {

    const [userSession, setUserSession] = useState(null);
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
                            <Route path='/subscribe'>
                                <Subscribe />
                            </Route>
                            <Route path='/download'>
                                <Desktop />
                            </Route>
                            <Route path='/login'>
                                <Login />
                            </Route>
                            <Route path='/collections/:id'>
                                <Collection />
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
            <Footer />
        </div>
    );
}

export default App;
