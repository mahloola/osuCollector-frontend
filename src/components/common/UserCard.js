import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsHeartFill } from "react-icons/bs";

import './CollectionCard.css';

const CollectionCard = ({ user }) => {
    return (
        <Card className="user-card">
            <a href={"/users/" + user.id} className="user-anchor">
                <Container className="user-container">



                    <Row>
                        <Col>
                            {user.name}<br />
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
