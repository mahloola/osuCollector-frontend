import { Nav, Navbar, Form, FormControl, Button, InputGroup, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UserBadge from './UserBadge';
import LoginButton from './LoginButton';
import Modal from './Modal';

function NavigationBar({ user }) {

    const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);
    const [searchBarInput, setSearchBarInput] = useState('');
    const history = useHistory()

    const searchSubmit = (event) => {
        event.preventDefault();
        history.push(`/all?search=${encodeURIComponent(searchBarInput)}`);
        window.location.reload()
        return false;
    }

    return (
        <div>
            <Navbar bg='dark' variant='dark' expand='md'>
                <LinkContainer to='/'>
                    <Navbar.Brand>osu!Collector</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav' className='justify-content-between'>
                    <Nav>
                        <LinkContainer to='/recent'>
                            <Nav.Link>Recent</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to='/popular?range=alltime'>
                            <Nav.Link>Popular</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to='/users'>
                            <Nav.Link>Users</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to='/subscribe'>
                            <Nav.Link>Subscribe</Nav.Link>
                        </LinkContainer>

                    </Nav>
                    
                    <Form onSubmit={searchSubmit} className='mx-4 w-25'>
                        <InputGroup>
                            <FormControl
                                onChange={(e) => setSearchBarInput(e.target.value)}
                                type='search'
                                style={{borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}
                                placeholder='tech, sotarks, camellia'/>
                            <Button
                                type='submit'
                                variant={searchBarInput.trim() === '' ? 'outline-primary' : 'primary'}
                                {...{disabled: searchBarInput.trim() === ''}}>
                                Search
                            </Button>
                        </InputGroup>
                    </Form>

                    <div>
                    {process.env.NODE_ENV !== 'production' &&
                        // TODO: check if user is logged in
                        <Button className="mx-3" onClick={() => setUploadModalIsOpen(true)}>
                            Upload
                        </Button>
                    }

                    {user ? <UserBadge user={user}/> : user === null ? <LoginButton/> : null}
                    {/* 
                        Design plan:
                        log in button on the top right when not signed in
                        when signed in, display username + avatar with a dropdown menu 
                        dropdown menu includes 'my profile', log out, etc 
                    */}
                    </div>
                </Navbar.Collapse>
            </Navbar>
            <Modal open={uploadModalIsOpen} onClose={() => setUploadModalIsOpen(false)} >
                <h3>1. Open <a href='https://osu.ppy.sh/wiki/en/osu%21_File_Formats/Db_%28file_format%29#collection.db'>collection.db</a></h3>
                collection.db is a file that contains all of your osu! collections. It is located in your osu! install folder. Example: 
                <pre className='bg-light my-2 py-1 px-3'><code>
                    C:\Users\jun\AppData\Local\osu!\collection.db
                </code></pre>
                <Form.Control type="file" />
                <br/>
                <h3>2. Select which collections to upload</h3>
                <div className='mb-3' style={{height: 500, overflowY: 'scroll'}}>
                    {['speed', 'aim', 'speed', 'aim', 'speed', 'aim', 'speed', 'aim', 'speed', 'aim', 'speed', 'aim', 'speed', 'aim', 'speed', 'aim', 'speed', 'aim', 'speed', 'aim'].map(name => 
                        <Card key={`${name}`} className='shadow-sm mx-3 my-2 py-2 px-4'>
                            <Row>
                                <Col>
                                    {name}
                                </Col>
                                <Col>
                                    20 beatmaps
                                </Col>
                                <Col xs={1}>
                                    <Form.Check/>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </div>
                <ButtonGroup>
                    <Button>Select All</Button>
                    <Button variant='secondary'>Cancel</Button>
                    <Button>Upload</Button>
                </ButtonGroup>
            </Modal>
        </div>
    )
}

// NavigationBar.propTypes = {
//     searchText: PropTypes.string,
//     setSearchText: PropTypes.func.isRequired
// }
NavigationBar.propTypes = {
    user: PropTypes.object,
}

export default NavigationBar;