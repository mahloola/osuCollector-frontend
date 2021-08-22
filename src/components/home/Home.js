import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import * as api from '../../utils/api'
import './Home.css';

const imgUrls = [
    'https://exo.pet/fm/construction_xtra_large.gif',
    'https://i.imgur.com/wb4yOgu.gif ',
    'https://i.imgur.com/tC7a2qk.gif',
    'https://i.imgur.com/eRmAh9i.png',
    'https://i.imgur.com/IHJ2ELP.gif',
    'https://i.imgur.com/sbfZ0p5.gif',
    'https://i.imgur.com/fuv6iyl.gif',
    'https://i.imgur.com/3lMPMKS.gif',
    'https://i.imgur.com/YkmDKe6.gif',
    'https://upload.wikimedia.org/wikipedia/commons/1/19/Under_construction_graphic.gif'
]

function shuffle(array) {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const range = (min, max) => min + Math.floor(Math.random() * max);

function Home() {
    const [metadata, setMetadata] = useState(null);

    useEffect(async () => {
        setMetadata(await api.getMetadata());
    }, [])

    return (
        <div>
            <h1>
                <Container>
                    <Row>
                        <Col xs={3}>
                            <img
                                src='https://i.imgur.com/4j8ywYf.png'
                                style={{ zoom: 0.2, transform: 'rotate(230deg)' }} />
                        </Col>
                        <Col>
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
                        </Col>
                    </Row>
                </Container>
                Home page is under construction, please use the links above!
                <br />
                <br />
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {shuffle(imgUrls).map(url => (
                    <img key={url} src={url} style={{height: range(100, 150)}}></img>
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {shuffle(imgUrls).map(url => (
                    <img key={url} src={url} style={{height: range(100, 150)}}></img>
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {shuffle(imgUrls).map(url => (
                    <img key={url} src={url} style={{height: range(100, 150)}}></img>
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {shuffle(imgUrls).map(url => (
                    <img key={url} src={url} style={{height: range(100, 150)}}></img>
                ))}
            </div>
        </div>
    )
}

export default Home;