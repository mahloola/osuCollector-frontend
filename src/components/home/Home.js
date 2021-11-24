import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from '../bootstrap-osu-collector';
import * as api from '../../utils/api'
import './Home.css';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import CollectionCard from '../common/CollectionCard';
import { LinkContainer } from 'react-router-bootstrap';
import { Alert } from 'react-bootstrap';

function Home() {
    const [metadata, setMetadata] = useState(null);
    const [popular, setPopular] = useState(new Array(6).fill(null));
    const [recent, setRecent] = useState(new Array(3).fill(null));

    useEffect(async () => {
        setMetadata(await api.getMetadata());
        api.getPopularCollections('week', 1, 6).then(paginatedCollectionData => {
            setPopular(paginatedCollectionData.collections)
        })
        api.getRecentCollections(1, 9).then(paginatedCollectionData => {
            setRecent(paginatedCollectionData.collections)
        })
    }, [])

    return (
        <Container className='pt-4 pb-4'>
            <Row>
                <Alert variant='success' className='text-center'>
                    Beatmap downloads are working again. If any issues arise, please visit the <a href='https://discord.gg/WZMQjwF5Vr'>osu!Collector discord</a>.
                </Alert>
                <Col className='px-5 my-2' md={12} lg={9}>
                    <h2>
                        Welcome to osu!Collector!
                    </h2>
                    <p>
                        This is a place where you can view beatmap collections uploaded by other players.
                        It is mainly developed by <a href='https://twitter.com/funorange42'>FunOrange</a> and <a href='https://twitter.com/mahloola'>Mahloola</a>.
                        {/* {process.env.NODE_ENV !== 'production' && */
                            (<>&nbsp;If you like the project, consider supporting us to get access to <LinkContainer to='/client'><a>extra features</a></LinkContainer>.</>)
                        }
                    </p>
                </Col>
                <Col md={12} lg={3} className='mb-3'>
                    <Card>
                        <Card.Header>
                            Statistics
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={7}>
                                    Users
                                </Col>
                                <Col xs={5}>
                                    <ReactPlaceholder className='my-1' ready={metadata} showLoadingAnimation type='textRow'>
                                        <b>{metadata?.userCount}</b>
                                    </ReactPlaceholder>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={7}>
                                    Collections
                                </Col>
                                <Col xs={5}>
                                    <ReactPlaceholder className='my-1' ready={metadata} showLoadingAnimation type='textRow'>
                                        <b>{metadata?.totalCollections}</b>
                                    </ReactPlaceholder>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className='mb-4'>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-0">
                        <div className="d-flex justify-content-start">
                            <h2 className='my-2 ml-2'>
                                <i className="fas fa-fire mr-3" style={{ color: 'orange' }}></i>
                                Popular this week
                            </h2>
                        </div>
                        <LinkContainer to='/popular?range=week'>
                            <a className='mr-2'>See all</a>
                        </LinkContainer>
                    </div>
                    <Container className='p-2'>
                        <Row>
                            {popular?.map((collection, i) => (
                                <Col lg={6} xl={4} className='p-0 my-3' key={i}>
                                    <ReactPlaceholder ready={collection} showLoadingAnimation type='rect'
                                        className='mx-auto'
                                        style={{ width: '90%', height: '235px' }}
                                    >
                                        <CollectionCard collection={collection}></CollectionCard>
                                    </ReactPlaceholder>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </Card.Body>
            </Card>

            <Card className='my-4'>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-0">
                        <div className="d-flex justify-content-start">
                            <h2 className='my-2 ml-2'>
                                Recently Uploaded
                            </h2>
                        </div>
                        <LinkContainer to='/recent'>
                            <a className='mr-2'>See all</a>
                        </LinkContainer>
                    </div>
                    <Container className='p-2'>
                        <Row>
                            {recent?.map((collection, i) => (
                                <Col lg={6} xl={4} className='p-0 my-3' key={i}>
                                    <ReactPlaceholder ready={collection} showLoadingAnimation type='rect'
                                        className='mx-auto'
                                        style={{ width: '90%', height: '235px' }}
                                    >
                                        <CollectionCard collection={collection}></CollectionCard>
                                    </ReactPlaceholder>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Home;