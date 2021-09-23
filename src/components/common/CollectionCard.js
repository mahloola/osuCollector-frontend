import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsHeartFill } from "react-icons/bs";

import './CollectionCard.css';

const CollectionCard = ({ collection }) => {
    return (
        <Card className="collection-card">
            <a href={"/collections/" + collection.id} className="collection-anchor">
                <Container className="collection-container">
                    <div className="collection-favourites-counter">
                        {collection.favourites}
                        <div className="collection-favourite-button">
                            <BsHeartFill />
                        </div>

                    </div>


                    <Row>
                        <Col>
                            {collection.name}<br />
                            <span className="collection-beatmapCount">Beatmaps</span> {collection.beatmapCount}
                        </Col>
                        <Col>
                            <div className="uploader-popup-window">
                                Hello world!
                            </div>
                            <Link to={"https://osu.ppy.sh/u/" + collection.uploader.id} replace>
                                <img src={collection.uploader.avatarURL} alt="Logo" className="collection-uploader-avatar" /><br />
                            </Link>
                            {/* <div className="collection-uploader">
                            {collection.uploader.username}
                        </div> */}
                        </Col>
                    </Row>
                </Container>
            </a>

        </Card>
    )
}

export default CollectionCard;
