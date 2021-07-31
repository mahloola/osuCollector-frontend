import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {

    return (
        // fixed to the bottom by adding inline css
        <footer class="bg-dark text-light p-3" style={{position: "fixed", bottom: "0", width: "100%"}}>
            <Container>
                <Row>
                    <Col>
                        <div class="d-flex justify-content-center">
                            {/* nbsp because space was not working lol*/}
                            © 2021 Copyright: FunOrange & mahloola •&nbsp;<Link to='/about' style={{ textDecoration: 'none' }}>About</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}


export default Footer;