import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import config from '../../config/config'

function Footer() {

    const [userId, setUserId] = useState(2051389);
    function userIdChanged(e) {
        setUserId(e.target.value)
    }
    function debugLogin() {
        fetch(`${config.get('API_HOST')}/api/users/${userId}/debugLogin`, {
            method: 'POST'
        }).then((res) => {
            if (res.status === 200) {
                alert(`Logged in as user id ${userId}`)
            } else {
                alert(`${res.status}: ${res.statusText}`)
            }
        })
    }

    return (
        // fixed to the bottom by adding inline css
        <footer className="bg-dark text-light p-3" style={{position: "fixed", bottom: "0", width: "100%"}}>
            <Container>
                <Row>
                    <Col>
                        <div className="d-flex justify-content-center">
                            {/* nbsp because space was not working lol*/}
                            © 2021 Copyright: FunOrange & mahloola •&nbsp;<Link to='/about' style={{ textDecoration: 'none' }}>About</Link>
                            {process.env.NODE_ENV !== 'production' &&  
                            <div>
                                <input type="text" onChange={userIdChanged} defaultValue="2051389"></input>
                                <Button onClick={debugLogin} variant="outline-primary"> Debug Login </Button>
                            </div>}
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}


export default Footer;