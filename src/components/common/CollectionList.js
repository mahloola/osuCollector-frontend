import { Container, Row, Col } from 'react-bootstrap';
import Collection from './Collection';
import PropTypes from 'prop-types';
import './CollectionList.css';

const CollectionList = ({ collections }) => {

    return (

        <Container>
            <Row>
            {
                collections.map((collection) => (
                    <Collection key={collection.id} collection={collection}></Collection>
                ))
            }
            
                <Col>
                </Col>
            </Row>
        </Container>

    )
}

CollectionList.propTypes = {
    collections: PropTypes.arrayOf(PropTypes.object)
}

export default CollectionList;