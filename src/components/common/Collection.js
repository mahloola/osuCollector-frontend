import { Card } from 'react-bootstrap';
import './Collection.css';

const { id } = this.props;
const { beatmapCount } = this.props;
const { collection } = this.props;

const Collection = ({ collection }) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    {id}
                </Card.Title>
                <Card.Subtitle>
                    {beatmapCount}
                    {collection}
                </Card.Subtitle>
            </Card.Body>
        </Card>
    )
}

export default Collection;
