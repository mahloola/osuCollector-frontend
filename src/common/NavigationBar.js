import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function NavigationBar() {

    function handleSubmit() {
        console.log("lkjkdsjkfhds");
    }

    return (
        <Navbar bg="light" expand="lg">
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
                <Form onSubmit={handleSubmit} inline>
                    <FormControl type="text" placeholder="Collection" className="mr-sm-2" />
                    <Button type="submit" variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar;