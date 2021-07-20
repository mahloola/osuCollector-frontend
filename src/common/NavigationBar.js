import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Redirect } from 'react-router';

function NavigationBar() {

    function handleSearch() {
        console.log("lkjkdsjkfhds");
    }
    function handleLogin() {
        <Redirect to='/login'/>
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
                        <LinkContainer to="/popular">
                            <Nav.Link>Popular</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/recent">
                            <Nav.Link>Recent</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/subscribe">
                            <Nav.Link>Subscribe</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Form onSubmit={handleSearch} inline>
                        <FormControl type="text" placeholder="Collection" className="mr-sm-2" />
                        <i class="bi bi-search"></i>
                        <Button type="submit" variant="outline-primary">Search</Button>
                    </Form>
                    <Form onSubmit={handleLogin} inline>
                        <Button type="submit" variant="outline-primary">Login</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </div>

    )
}

export default NavigationBar;