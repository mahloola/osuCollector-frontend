import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Authentication from './Authentication';

function NavigationBar() {

    function handleSearch() {
        console.log("lkjkdsjkfhds");
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="md">
                <LinkContainer to="/">
                    <Navbar.Brand>osu!Collector</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <LinkContainer to="/recent">
                            <Nav.Link>Recent</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/popular?range=alltime">
                            <Nav.Link>Popular</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/users">
                            <Nav.Link>Users</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/subscribe">
                            <Nav.Link>Subscribe</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    {/* hard coded 20% rightPadding to center the searchbar for now*/}
                    <Form onSubmit={handleSearch} inline style={{ margin: "auto", paddingRight: "35%" }}>
                        <FormControl type="text" placeholder="tech, sotarks, camellia" className="mr-sm-2" />
                        <i className="bi bi-search"></i>
                        <Button type="submit" variant="outline-primary">Search</Button>
                    </Form>
                    <Authentication />
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

export default NavigationBar;