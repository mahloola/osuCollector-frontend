import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Authentication from './Authentication';
import { useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { useState } from 'react';

function NavigationBar({ user }) {

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
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='mr-auto'>
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

                    {/* hard coded 20% rightPadding to center the searchbar for now*/}
                    <Form
                        onSubmit={searchSubmit}
                        inline
                        className='col-xs-3'
                        style={{ margin: 'auto', paddingRight: '35%' }}>

                        <FormControl
                            onChange={(e) => setSearchBarInput(e.target.value)}
                            type='text'
                            placeholder='tech, sotarks, camellia'
                            className='mr-sm-2' />

                        <Button type='submit' variant={searchBarInput.trim() === '' ? 'outline-primary' : 'primary'} {...{disabled: searchBarInput.trim() === ''}}>Search</Button>
                    </Form>

                    <Authentication user={user}/>
                    {/* 
                        Design plan:
                        log in button on the top right when not signed in
                        when signed in, display username + avatar with a dropdown menu 
                        dropdown menu includes 'my profile', log out, etc 
                    */}
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

// NavigationBar.propTypes = {
//     searchText: PropTypes.string,
//     setSearchText: PropTypes.func.isRequired
// }

export default NavigationBar;