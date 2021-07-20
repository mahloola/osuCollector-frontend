import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {

    return (
        <div class="bg-dark text-light p-3">
            <Container>
                <Row>
                    <Col>
                    <div class="d-flex justify-content-center">
                    © 2021 Copyright: FunOrange & mahloola •&nbsp;<Link to='/about' style={{ textDecoration: 'none' }}>About</Link>
                    </div>                       
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;