import { Col, Container, Row } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';

import Home from './home/Home';
import About from './about/About';
import Collection from './collection/Collection';
import NotFound from './notfound/NotFound';
import Popular from './popular/Popular';
import Recent from './recent/Recent';
import NavigationBar from './common/NavigationBar';
import Footer from './common/Footer';
import Subscribe from './subscribe/Subscribe';
import Desktop from './desktop/Desktop';
import Login from './login/Login';

function App() {

  return (
    <div className="App">
      <NavigationBar />
      <br/>
      <Container>
        <Row>
          <Col>
            <Switch>
              <Route exact path='/'>
                <Home />
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
      <br/>
      <Footer/>
    </div>
  );
}

export default App;
