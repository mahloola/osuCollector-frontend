import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Subscribe() {
    return (
        <div>
            <h2>
                Support our project by subscribing to get the desktop client for only $1.99 a month!
            </h2>
            <br/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        Features
                    </Card.Title>
                    <Card.Subtitle>
                        osu!Direct client integration
                    </Card.Subtitle>
                </Card.Body>
            </Card>
            <br/>
            <h3>
                <Link to='/download'>Download</Link>
            </h3>
        </div>
    )
}

export default Subscribe;