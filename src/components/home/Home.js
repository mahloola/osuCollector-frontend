import './Home.css';
import * as api from '../../utils/api';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

function Home() {
    const [metadata, setMetadata] = useState(null);

    useEffect(async () => {
        setMetadata(await api.getMetadata());
    }, [])

    return (
        <div>
            <h1>
                Welcome to osu!Collector!
            </h1>
            <Card className="stats">
                <Card.Body>
                    <h5>
                        {metadata &&
                            <Container>
                                <Row>
                                    <Col>Total Users</Col>
                                    <Col>Total Collections</Col>
                                </Row>
                                <Row>
                                    <Col>{metadata.userCount}</Col>
                                    <Col>{metadata.totalCollections}</Col>
                                </Row>
                            </Container>
                        }
                    </h5>
                </Card.Body>
            </Card>

            {/* <h1>
                News
            </h1>
            <br/>
            <div className="news">
                <h3>
                    We are going live.
                </h3>
                <h6>
                    Hey guys what&apos;s up guys back at it again at Krispy Kreme!
                </h6>
                <div className="text-muted date">
                    July 25, 2021
                </div>
            </div>
            <div className="news">
                <h3>
                    kjjkj
                </h3>
                <h6>
                    Congratulations! If you&apos;re reading this you lost the game.
                </h6>
                <div className="text-muted date">
                    July 25, 2021
                </div>
            </div> */}
        </div>
    )
}

export default Home;