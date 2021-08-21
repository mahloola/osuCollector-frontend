import { Nav, Navbar, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UserBadge from './UserBadge';
import LoginButton from './LoginButton';
import UploadModal from './UploadModal';
import './common.css';
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

                        {process.env.NODE_ENV !== 'production' &&
                            <LinkContainer to='/subscribe'>
                                <Nav.Link>Subscribe</Nav.Link>
                            </LinkContainer>
                        }

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
                        <Button
                            className="mx-3"
                            onClick={() => {
                                if (user)
                                    setUploadModalIsOpen(true)
                                else
                                    alert('Please log in!')
                            }}>
                            Upload
                        </Button>

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
            <UploadModal uploadModalIsOpen={uploadModalIsOpen} setUploadModalIsOpen={setUploadModalIsOpen}/>
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